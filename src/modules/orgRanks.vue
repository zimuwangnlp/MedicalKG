<template>
<div class="moduleItemArea">
  <div class="breadcrumbArea">
    <span style="font-size: 14px;">当前位置: </span>
    <el-breadcrumb style="display: inline-block;" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{orgName}}技术预测</el-breadcrumb-item>
      <el-breadcrumb-item>{{orgName}}技术预测</el-breadcrumb-item>
    </el-breadcrumb>
  </div>

  <div class="topInfoArea">
    <span class='titleItem'>最新技术热榜</span>
  </div>
  <el-row :gutter="20">
    <slot v-for="d in rankArray">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <topRankList @deleteSuccess="handleDeleteSuccess" @button-click="handleClickBtn" :style="{width: '100%', height:'auto'}" :dataObj="d"></topRankList>
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
    return {
      orgName: this.$route.query.orgName || "Gartner",
      searchForm: {
        optionMap: {
          org_name: [{
              label: "MIT",
            },
            {
              label: "Gartner",
            }
          ],
          year: [{
              label: "2021年以来",
              value: 2021
            },
            {
              label: "2020年以来",
              value: 2020
            },
            {
              label: "2019年以来",
              value: 2019
            }, {
              label: "2018年以来",
              value: 2018
            }
          ]
        },
        result: {
          org_name: "",
          year: "",
          section: [2018, (new Date()).getFullYear()],
          maxYear: (new Date()).getFullYear()
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
      labelToolData: {
        docNodes: [{
            id: "2211",
            text: "测试",
            label: "地区",
            offset: 3,
            index: 0
          },
          {
            id: "2212",
            text: "文档段落",
            entityName: "政治事件",
            type: 1,
            paramName: "发生时间",
            offset: 2,
            index: 1
          }
        ],
        docRelations: [{
          id: "2213223",
          label: "测试",
          source: "2211",
          target: "2212"
        }],
        txtParagraphs: ["#111测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落", "测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落测试文档段落"]
      },
      labelConfig: {
        nodeData: [{
          id: "2221",
          label: "人物",
          properties: [{
            id: "2222211",
            label: "姓名"
          }, {
            id: "2222212",
            label: "通信地址"
          }, {
            id: "2222213",
            label: "职业"
          }]
        }, {
          id: "2222",
          label: "地区",
          properties: [{
            id: "2222211",
            label: "姓名"
          }, {
            id: "2222212",
            label: "通信地址"
          }, {
            id: "2222213",
            label: "职业"
          }]
        }, {
          id: "2222",
          label: "国家"
        }],
        relationData: [{
          id: "1221",
          label: "朋友"
        }, {
          id: "1222",
          label: "配偶"
        }]
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
    handleDeleteSuccess() {

    },
    handleButtonClick() {
      this.$router.push({
        path: "/home"
      })
    },
    handleSearchClick() {
      var param = this.searchForm.result;
      this.searchForcastData({
        is_more: true,
        org_name: param.org_name,
        stat_year: param.section[0],
        end_year: param.section[1]
      });
    },
    handleSearchChange() {
      var param = this.searchForm.result;
      this.searchForcastData({
        is_more: true,
        org_name: param.org_name,
        stat_year: param.year,
        end_year: ""
      });
    },
    searchForcastData(param) {
      var _self = this;
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
      this.searchForcastData({
        is_more: true,
        org_name: this.orgName,
        stat_year: "",
        end_year: ""
      })
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
