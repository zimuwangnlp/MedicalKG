<template>
<div class="moduleItemArea">
  <div class="breadcrumbArea" style="padding: 0 10px;">
    <span style="font-size: 14px;">当前位置: </span>
    <el-breadcrumb style="display: inline-block;" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{orgName}}技术预测</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="topInfoArea" style="padding: 0 10px; margin-bottom: 15px;">
    <span class='titleItem'>技术曲线</span>
    <span class="buttonItem">
      <el-button link type="primary" @click="handleButtonClick">更多<el-icon>
          <DArrowRight />
        </el-icon>
      </el-button>
    </span>
  </div>
  <div class="container flow" style="padding: 0 10px;">
    <el-row :gutter="20">
      <el-empty style="margin: auto;" v-if="picArray.length === 0" description="暂无数据" />
      <slot v-for="d in picArray">
        <el-col :span="8">
          <div class="forcastPicName">
            <DeleteButton :data="d" type="HypeCyclePic" @deleteSuccess="handleDeleteSuccess"></DeleteButton>
            <span :title="d.name" class="ellipsis" style="display: inline-block; width: calc( 100% - 25px );">{{d.name}}</span>
            <el-button title="下载图片" link type="primary" @click="downloadImage(d.pic, d.name)" class="downloadBtn">
              <el-icon>
                <Download />
              </el-icon>
            </el-button>
          </div>
          <div class="grid-content bg-purple">
            <el-image :src="d.pic" :preview-src-list="[d.pic]"></el-image>
            <!-- <el-image :src="d.dataUrl"></el-image> -->
          </div>
        </el-col>
      </slot>
    </el-row>
  </div>
  <div v-if="techArray.length !== 0" class="topInfoArea" style="padding: 0 10px; margin-bottom: 15px;">
    <span class='titleItem'>技术实现时间预测</span>
  </div>
  <div v-if="techArray.length !== 0" class="forcastTimer">
    <div class="tiemPlayerItem">
      <timePlayer :max="timePlayerParam.max" :min="timePlayerParam.min" @change="handleTimeChange" ref="tiemPlayerItem"></timePlayer>
    </div>
    <div class="reportListArea">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple reportListGroup">
            <el-empty style="margin: auto;" v-if="techDataMap['少于2年'].length === 0" description="暂无数据" />

            <p class="ellipsis" v-for="d in techDataMap['少于2年']" :key="d" :title="d">
              <DeleteButton :data="d" type="AchieveTimePrediction" @deleteSuccess="handleDeleteSuccess"></DeleteButton>
              {{d.name}}
            </p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple reportListGroup">
            <el-empty style="margin: auto;" v-if="techDataMap['2-5年'].length === 0" description="暂无数据" />

            <p class="ellipsis" v-for="d in techDataMap['2-5年']" :key="d" :title="d">
              <DeleteButton :data="d" type="AchieveTimePrediction" @deleteSuccess="handleDeleteSuccess"></DeleteButton>{{d.name}}
            </p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple reportListGroup">
            <el-empty style="margin: auto;" v-if="techDataMap['5-10年'].length === 0" description="暂无数据" />

            <p class="ellipsis" v-for="d in techDataMap['5-10年']" :key="d" :title="d">
              <DeleteButton :data="d" type="AchieveTimePrediction" @deleteSuccess="handleDeleteSuccess"></DeleteButton>
              {{d.name}}
            </p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple reportListGroup">
            <el-empty style="margin: auto;" v-if="techDataMap['10年以上'].length === 0" description="暂无数据" />

            <p class="ellipsis" v-for="d in techDataMap['10年以上']" :key="d" :title="d">
              <DeleteButton :data="d" type="AchieveTimePrediction" @deleteSuccess="handleDeleteSuccess"></DeleteButton>
              {{d.name}}
            </p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <slot v-for="label in sectionMap">
          <el-col :span="6">
            <div class="grid-content bg-purple reportLabel">
              <span>{{label}}</span>
            </div>
          </el-col>
        </slot>

      </el-row>
    </div>
  </div>
  <div class="topInfoArea" style="padding: 0 10px;  margin-bottom: 5px;">
    <span class='titleItem'>最新技术热榜</span>
  </div>
  <div class="container flow" style="padding: 0 10px;">
    <el-row :gutter="20">
      <el-empty style="margin: auto;" v-if="rankArray.length === 0" description="暂无数据" />
      <slot v-for="d in rankArray">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <topRankList @deleteSuccess="handleDeleteSuccess" @button-click="handleClickBtn" :style="{width: '100%', height:'auto'}" :dataObj="d"></topRankList>
          </div>
        </el-col>
      </slot>
    </el-row>
  </div>
  <div class="container flow" style="padding: 0 10px;">
    <el-row :gutter="30">
      <el-col :span="16">
        <div class="topInfoArea">
          <span class='titleItem'>预测报告</span>
        </div>
        <div class="grid-content bg-purple">
          <el-empty style="margin: auto;" v-if="reportArray.length === 0" description="暂无数据" />
          <slot v-for="d in reportArray">
            <el-card shadow="never" class="reportCard">
              <template #header>
                <div class="card-header">
                  <DeleteButton :data="d" type="Report" @deleteSuccess="handleDeleteSuccess"></DeleteButton>
                  <span>{{d.name}}</span>
                  <el-button link type="primary" class="viewReportBtn" @click="handleViewReport(d)">
                    <el-icon>
                      <View />
                    </el-icon>
                  </el-button>
                  <span class="reportYear">{{d.year}}</span>
                </div>
              </template>
              <div>
                <p v-html="d.abstract || '...'"></p>
              </div>
            </el-card>
          </slot>
          <el-pagination v-if="reportArray.length !== 0" v-model:currentPage="reportPage.current" :page-size="reportPage.pageSize" size="small" layout="total,  prev, pager, next, jumper" :total="reportPage.total" @current-change="handleCurrentChange" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="topInfoArea">
          <span class='titleItem'>预测报告热词</span>
        </div>
        <div class="grid-content bg-purple">
          <el-empty style="margin: auto;" v-if="echartOption.series[0].data.length === 0" description="暂无数据" />
           <div v-else ref="wordCloudArea" class="wordCloudArea"></div>
        </div>
      </el-col>
    </el-row>
  </div>
  <el-dialog ref="dialogDom" :title="detailDialog.title" v-model="detailDialog.visible" :width="detailDialog.width" :center="detailDialog.center || false">
    <h3 style="text-align: center;">{{detailDialog.title}}
      <el-button title="下载详情" style="float: none;" link type="primary" @click="downloadReport(d)" class="downloadBtn">
        <el-icon>
          <Download />
        </el-icon>
      </el-button>
    </h3>
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
import topRankList from "./../components/topRankList";
import timePlayer from "./../components/timePlayer";
import DeleteButton from "./../components/opConfirmButton";
import * as echarts from "echarts";
import "echarts-wordcloud";

export default {
  name: '',
  components: {
    topRankList,
    timePlayer,
    DeleteButton
  },
  data() {
    return {
      orgName: this.$route.query.orgName,
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
      dataMap: {},
      reportPage: {
        pageSize: 5,
        current: 1,
        total: 0
      },
      reportArray: [{
        describe: "",
        id: 65,
        year: 2022,
        name: "Gartner Top 10 Strategic Technology Trends for 2022",
        org_name: "Gartner"
      }],
      sectionMap: ["少于2年", '2-5年', "5-10年", "10年以上"],
      techDataMap: {
        "少于2年": [],
        '2-5年': [],
        "5-10年": [],
        "10年以上": []
      },
      picArray: [],
      techArray: [],
      orgArray: [],
      rankArray: [],
      rankData: {
        title: "#Top20 点击率",
        data: [{
          name: "功能A1"
        }, {
          name: "功能A2"
        }, {
          name: "功能A3"
        }, {
          name: "功能A4"
        }, {
          name: "功能A5"
        }, {
          name: "功能A6"
        }],
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
      timePlayerParam: {
        max: 2022,
        min: 2021
      },
      echartOption: {
        backgroundColor: '#fff',
        tooltip: {
          show: true
        },
        series: [{
          type: 'wordCloud',
          gridSize: 1,
          sizeRange: [12, 55],
          rotationRange: [-45, 0, 45, 90],
          // maskImage: maskImage,
          textStyle: {
            color: function () {
              return 'rgb(' +
                Math.round(Math.random() * 255) +
                ', ' + Math.round(Math.random() * 255) +
                ', ' + Math.round(Math.random() * 255) + ')'
            }
          },
          left: 'center',
          top: 'center',
          data: []
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
  mounted() {
    this.$nextTick(() => {
      this.updateRankList();
    })

  },
  methods: {
    handleDeleteSuccess() {
      debugger;
      this.updateRankList();
    },
    base64ToBlob(urlData, type) {
      let arr = urlData.split(',');
      let mime = arr[0].match(/:(.*?);/)[1] || type;
      // 去掉url的头，并转化为byte
      let bytes = window.atob(arr[1]);
      // 处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
      let ia = new Uint8Array(ab);
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], {
        type: mime
      });
    },
    downloadImage(pic, name) {
      pic = this.base64ToBlob(pic);
      util.downloadString(pic, name + '.jpg');
    },
    downloadReport() {
      util.downLoadByUrl(adapter.config.downloadReport.url, this.detailDialog.title + ".zip", adapter.config.downloadReport.method, {
        "contents": [],
        "endYear": null,
        "fileIds": [this.detailDialog.data.id],
        "orgNames": [],
        "startYear": null
      }, {
        'Content-Type': adapter.config.downloadReport.bodyType,
        "token": sessionStorage.getItem("token"),
        "userId": sessionStorage.getItem("userId")
      })

    },
    handleButtonClick() {
      this.$router.push({
        path: "/forcastPic",
        query: {
          orgName: this.orgName
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
    },
    handleViewReport(d) {
      this.detailDialog.title = d.name;
      if (d.name_zh) {
        this.detailDialog.title = `${d.name}( ${d.name_zh} )`
      }
      this.initReport(d);
      this.detailDialog.visible = true;
      this.detailDialog.data = d;
    },
    initReport(d, flag) {
      d.describe = "";
      d.describe_cn = "";
      var arr = d.teclist;
      for (var i = 0; i < arr.length; i++) {
        d.describe += `<h3>${arr[i].name}</h3><p>${arr[i].describe}</p>`;
        if (arr[i].name_zh && arr[i].describe_cn) {
          d.describe_cn += `<h3>${arr[i].name_zh}</h3><p>${arr[i].describe_cn}</p>`;
        }
      }
    },
    getReportWords() {
      var param = {
        name: this.orgName
      }
      var _self = this;
      adapter.getReportWords(param, function (tData) {
        console.log("词云数据", tData.data);
        _self.echartOption.series[0].data = tData.data.map(item => {
          return {
            name: item.name,
            value: item.count
          }
        });
        var elem = _self.$refs.wordCloudArea;
        if (elem) {
          var chart = echarts.init(elem);
          chart.setOption(_self.echartOption);
        }
      });
    },
    getForcastPic(flag) {
      var _self = this;
      adapter.getForcastPic({
        is_more: flag,
        name: this.orgName
      }, function (tData) {
        _self.picArray = tData.data.map(item => {
          item.pic = 'data:image/jpg;base64,' + item.pic;
          return item;
        })
      })

    },
    getForcastData(param, callback) {
      param = param || {
        is_more: true,
        org_name: this.orgName,
        stat_year: "",
        end_year: ""
      }
      adapter.getForcastHot(param, function (tData) {
        if (typeof callback === "function") {
          callback(tData);
        }
      })
    },
    handleCurrentChange(v) {
      this.reportArray.current = v;
      this.getForcastReport();
    },
    getForcastReport(callback) {
      var param = {
        name: this.orgName,
        limit: this.reportPage.pageSize,
        offset: this.reportPage.pageSize * (this.reportPage.current - 1)
      }
      var _self = this;
      adapter.getForcastReport(param, function (tData) {
        if (typeof callback === "function") {
          callback(tData);
        } else {
          _self.reportPage.total = Number(tData.data.total);
          _self.reportArray = tData.data.data.map(item => {
            item.abstract = item.describe.trim();
            return item;
          });
        }
      })
    },
    handleTimeChange(year) {
      var tData = this.dataMap[year] || [];
      for (var k in this.techDataMap) {
        this.techDataMap[k] = [];
      }
      for (var i = 0; i < tData.length; i++) {
        var label = tData[i].label;
        this.techDataMap[label] = tData[i].tech_list;
      }
      console.log(tData);
    },
    getCalculateHot() {
      var _self = this;
      adapter.calculateHot({
        name: this.orgName
      }, function (tData) {
        _self.dataMap = _self.dataMap || {};
        var min = 2021;
        var max = 2022;
        var arr = tData.data.map(item => {
          _self.dataMap[item.year] = item.data;
          if (item.year < min) {
            min = item.year;
          }
          if (item.year > max) {
            max = item.year;
          }
          return {
            content: item.year,
            size: 'large',
          }
        });
        _self.timePlayerParam.max = max;
        _self.timePlayerParam.min = min;

        _self.techArray = arr;
        var player = _self.$refs.tiemPlayerItem;
        if (player) {
          player.initActivities(min, max);
        }

      })
    },
    updateRankList() {
      var _self = this;
      this.getForcastData({
        name: this.orgName
      }, function (tData) {
        var arr = tData.data.slice(0, 3);
        _self.rankArray = arr.map((item, index) => {
          item.title = item.name;
          item.keyIndex = _self.rankData.keyIndex;
          item.keyStyle = _self.rankData.keyStyle;
          item.keyType = _self.rankData.keyType;
          return item;
        })
      });
      this.getForcastReport();
      this.getReportWords();

      this.getForcastPic(false);
      this.getCalculateHot();

    },
  },
};
</script>

<style>
.moduleItemArea {
  float: left;
  width: 100%;
  background: #ffffff;
  height: 100%;
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  background-size: 100vw 100%;
  display: block;
  position: relative;
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

.grid-content {
  position: relative;
  float: left;
  width: 100%;
}

.reportCard {
  margin-top: 10px;
}

.el-card__header {
  padding: 5px 10px;
  border-bottom: none;
}

.reportYear {
  float: right;
}

.el-card__body {
  padding: 5px 10px;
}

.el-card__body p {
  margin-bottom: 0px;
  font-size: 14px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.container {
  position: relative;
  float: left;
  width: 100%;
  height: auto;
}

.wordCloudArea {
  width: 100%;
  height: 500px;
}

.forcastPicName {
  position: relative;
  font-size: 14px;
  padding-bottom: 10px;
}

.reportListGroup>p:hover .buttonContainer,
.card-header:hover .buttonContainer,
.forcastPicName:hover .buttonContainer {
  display: inline-block;
}

.downloadBtn {
  font-size: 20px;
  float: right;
  margin-top: -5px;
  vertical-align: middle;
}

.buttonItem {
  margin-top: -15px;
}

.forcastTimer {
  position: relative;
  width: 100%;
  float: left;
}

.tiemPlayerItem {
  float: left;
  display: inline-block;
  position: relative;
  width: 100px;
  height: 400px;
}

.reportListArea {
  float: left;
  display: inline-block;
  position: relative;
  width: calc(100% - 100px);
  padding-left: 10px;
  height: 400px;
}

/* .reportListArea .el-row:nth-child(2) {
  border-top : solid 1px #ddd;
} */

.reportListArea .el-col:nth-child(2n) .reportListGroup {
  background: #f2f2f2;
}

.reportListArea .reportListGroup {
  position: relative;
  height: 350px;
  margin-bottom: 0px;
  overflow: auto;
  border-bottom: solid 1px #ddd;
  padding-top: 10px;
}

.reportListArea .reportListGroup>p {

  padding-left: 10px;
  margin-bottom: 3px;
}

.reportLabel {
  text-align: center;
}

.reportListArea .reportListGroup::nth-child(2n) {
  background: #ddd;
}

.viewReportBtn {
  margin-left: 10px;
}
</style>
