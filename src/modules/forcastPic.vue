<template>
<div class="moduleItemArea">
  <div class="breadcrumbArea" style="padding: 0 10px;">
    <span style="font-size: 14px;">当前位置: </span>
    <el-breadcrumb style="display: inline-block;" separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/forcast', query: { orgName: orgName} }">{{orgName}}技术预测</el-breadcrumb-item>
      <el-breadcrumb-item>{{orgName}}技术曲线</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="topInfoArea" style="padding: 0 10px; margin-bottom: 15px;" >
    <span class='titleItem'>技术曲线</span>
  </div>
  <div class="container flow" style="padding: 0 10px;" >
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
</div>
</template>

<script>
import topRankList from "./../components/topRankList";
import DeleteButton from "./../components/opConfirmButton";

export default {
  name: '',
  components: {
    topRankList,
    DeleteButton
  },
  data() {
    return {
      orgName: this.$route.query.orgName || "Gartner",
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
      picArray: [],
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
    this.updateRankList();
  },
  methods: {
    handleDeleteSuccess() {
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
    updateRankList() {
     this.getForcastPic(true);
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
  font-size: 14px;
  padding-bottom: 10px;
}

.downloadBtn {
  font-size: 20px;
  float: right;
  margin-top: -5px;
  vertical-align: middle;
}

.forcastPicName:hover .buttonContainer  {
  display: inline-block;
}

.buttonItem {
  margin-top: -15px;
}

.viewReportBtn {
  margin-left: 10px;
}
</style>
