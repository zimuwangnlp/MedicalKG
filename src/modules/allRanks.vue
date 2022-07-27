<template>
<div class="moduleItemArea">
  <div class="breadcrumbArea">
    <span style="font-size: 14px;">当前位置: </span>
    <el-breadcrumb style="display: inline-block;" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>全部技术热榜</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <div class="topInfoArea">
    <span class='titleItem'>全部技术热榜</span>
    <span class="buttonItem">
      <el-button link type="primary" @click="handleButtonClick">
        <el-icon>
          <DArrowLeft />
        </el-icon>返回
      </el-button>
    </span>
  </div>
  <div class="searchRankArea">
    <el-form label-width="80px">
      <el-form-item label="所属机构">
        <el-radio-group v-model="searchForm.result.org_name" @change="handleSearchChange">
          <el-radio-button label="">全部</el-radio-button>
          <slot v-for="item1 in searchForm.optionMap.org_name">
            <el-radio-button :value="item1.value" :label="item1.value || item1.label">{{item1.label}}</el-radio-button>
          </slot>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年份">
        <el-radio-group v-model="searchForm.result.year" @change="handleSearchChange">
          <el-radio-button label="">全部</el-radio-button>
          <slot v-for="item2 in searchForm.optionMap.year">
            <el-radio-button :value="item2.value" :label="item2.value || item2.label">{{item2.label}}</el-radio-button>
          </slot>
        </el-radio-group>
        <span class="timeSelector">
          <el-input-number v-model="searchForm.result.section[0]" controls-position="right" :min="1976" :max="searchForm.result.maxYear-1"></el-input-number> --
          <el-input-number v-model="searchForm.result.section[1]" controls-position="right" :min="1976" :max="searchForm.result.maxYear"></el-input-number>
          <el-button type="primary" circle @click="handleSearchClick">
            <el-icon style="vertical-align: middle;">
              <Search />
            </el-icon>
          </el-button>
        </span>
      </el-form-item>
    </el-form>
  </div>
  <el-row :gutter="20">
    <el-empty style="margin: auto;" v-if="rankArray.length === 0" description="检索结果为空" />
    <slot v-for="d in rankArray">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <topRankList @deleteSuccess="searchForcastData" @button-click="handleClickBtn" :style="{width: '100%', height:'auto'}" :dataObj="d"></topRankList>
        </div>
      </el-col>
    </slot>
  </el-row>
  <el-dialog :title="detailDialog.title" v-model="detailDialog.visible" :width="detailDialog.width" :center="detailDialog.center || false">
    <el-row :gutter="40">
      <el-col :span="!!detailDialog.data.describe_cn ? 12:24">
        <div class="grid-content bg-purple">
          <p v-html="detailDialog.data.describe"></p>
        </div>
      </el-col>
      <el-col :span="12" v-if="detailDialog.data.describe_cn">
        <div class="grid-content bg-purple">
          <p v-html="detailDialog.data.describe_cn"></p>
        </div>
      </el-col>
    </el-row>

  </el-dialog>

</div>
</template>

<script>
import labelTool from "./../components/labelTool";
import topRankList from "./../components/topRankList";
export default {
  name: '',
  components: {
    labelTool,
    topRankList
  },
  data() {
    var year = (new Date()).getFullYear();
    var arr = [];
    for(var i = 0; i < 4; i++) {
      arr.push({
        label: (year - i - 1) + "年以来",
        value: year - i - 1
      })
    }
    return {
      searchForm: {
        optionMap: {
          org_name: [{
              label: "MIT",
            },
            {
              label: "Gartner",
            }
          ],
          year: arr
        },
        result: {
          org_name: "",
          year: "",
          section: [year - 4, year],
          maxYear: year
        }
      },
      detailDialog: {
        visible: false,
        title: "报告名称",
        width: "80%",
        content: "报告内容",
        data: {
          describe: "",
          describe_cn: "",
          id: 1181,
          name: "Data Fabric",
          name_zh: "数据架构"
        }
      },
      showRank: false,
      orgArray: [],
      rankArray: [],
      rankData: {
        title: "#Top20 点击率",
        data: [],
        keyIndex: ["name", "name"],
        keyType: [null, {
          type: 'button',
          sType: 'primary',
          label: "查看详情",
          align: "right",
          width: 80
        }],
        keyStyle: [{
          textAlign: "left"
        }, {
          textAlign: "right"
        }]
      },
      param: {
         is_more: true,
        org_name: "",
        stat_year: "",
        end_year: ""
      }
    };
  },
  watch: {
    $route(to, from) {

    },
  },
  computed: {

  },
  created() {
    this.updateRankList();
  },
  methods: {
    handleButtonClick() {
      this.$router.push({
        path: "/home"
      })
    },
    handleSearchClick() {
      var param = this.searchForm.result;
      this.param.org_name = param.org_name;
      this.param.stat_year = param.section[0];
      this.param.end_year = param.section[1];
      this.searchForcastData();
    },
    handleSearchChange() {
      var param = this.searchForm.result;
        this.param.org_name = param.org_name;
      this.param.stat_year = param.year;
      this.param.end_year = "";
      this.searchForcastData();
    },
    searchForcastData(param) {
      var _self = this;
      param = param || this.param;
      this.getForcastData(param, function (tData) {
        var arr = tData.data;
        _self.rankArray = arr.map((item, index) => {
          item.title = item.name;
          item.keyIndex = _self.rankData.keyIndex;
          item.keyStyle = _self.rankData.keyStyle;
          item.keyType = _self.rankData.keyType;
          return item;
        })
      });
    },
    updateRankList() {
      var _self = this;
      this.getForcastData(null, function (tData) {
        var arr = tData.data;
        _self.rankArray = arr.map((item, index) => {
          item.title = item.name;
          item.keyIndex = _self.rankData.keyIndex;
          item.keyStyle = _self.rankData.keyStyle;
          item.keyType = _self.rankData.keyType;
          return item;
        })
      });
      this.getReportDetail(function (tData) {
        _self.searchForm.optionMap.org_name = tData.data.map(item => {
          return {
            label: item.org_name
          }
        })
      });
    },
    getForcastData(param, callback) {
      param = param || {
        is_more: true,
        org_name: "",
        stat_year: "",
        end_year: ""
      }
      adapter.getForcastHot(param, function (tData) {
        if (typeof callback === "function") {
          callback(tData);
        }
      })
    },
    getReportDetail(callback) {
      adapter.getReportDetail({}, function (tData) {
        if (typeof callback === "function") {
          callback(tData);
        }
      })
    },
    handleClickBtn(label, d) {
      this.detailDialog.title = d.name;
      if (d.name_zh) {
        this.detailDialog.title = `${d.name}( ${d.name_zh} )`
      }
      this.detailDialog.visible = true;
      this.detailDialog.data = d;
      console.log(d);
    }
  },
};
</script>

<style>
.moduleItemArea {
  float: left;
  width: 100%;
  height: 100%;
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  background-size: 100vw 100%;
  display: block;
  position: relative;
  padding-right: 10px;
}

.topInfoArea,
.searchRankArea {
  width: 100%;
  height: auto;
  margin-top: 15px;
  float: left;
}

.timeSelector {
  margin-left: 20px;
}

.timeSelector .el-button {
  margin-left: 10px;
}

.titleItem {
  float: left;
  padding-left: 10px;
  border-left: solid 4px rgb(0, 19, 74);
}

.buttonItem {
  float: right;
  margin-right: 10px;
}

.orgNameArea {
  text-align: left;
  padding: 10px 0px 5px 0px;
  border-bottom: solid 1px #f2f2f2;
  margin-bottom: 5px;
}

.el-dialog__header {
  border-bottom: solid 1px #f2f2f2 !important;
  margin-right: 0px;
}

.grid-content {
  margin-bottom: 15px;
}

.breadcrumbArea {
  vertical-align: middle;
}
.breadcrumbArea>span {
  vertical-align: middle;
}
.breadcrumbArea .el-breadcrumb {
  vertical-align: middle;
  margin-left: 10px;
}

.grid-content p {
  margin-top: 0px;
}
</style>
