<template>
<div class="mainFramework" :withBreadcrumb="flag">
  <div class="topMenuArea">
    <span class="logoText">{{logoText}}</span>
    <div class="topRightArea">
      <el-dropdown v-if="!!userInfo && userInfo.realName">
        <span class="el-dropdown-link">
          <span class="userInfoArea ellipsis">
            <el-icon>
              <UserFilled />
            </el-icon>{{userInfo.realName}}
          </span>
          <el-icon class="el-icon--right arrowDown">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-if="isAdmin" @click="handleUploadData">上传数据</el-dropdown-item>
            <el-dropdown-item @click="handleExitLogin">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button class="loginBtn" v-else type="primary" @click="handleExitLogin" link>登录</el-button>
      <commonMenu ref="menuItem" class="commonMenuArea" :menuInfo="menuData"></commonMenu>
    </div>
  </div>
  <div class="contentArea">
    <div class="breadcrumbArea" v-if="currentBreadcrumb && currentBreadcrumb.length !== 0">
      <el-breadcrumb separator="/">
        <slot v-for="(d, i) in currentBreadcrumb">
          <slot v-if="i === currentBreadcrumb.length - 1 || !pathMap[d]">
            <el-breadcrumb-item>{{ d }}</el-breadcrumb-item>
          </slot>
          <slot v-else>
            <el-breadcrumb-item class="activeItem" :to="{ path: pathMap[d] }">{{
              d
            }}</el-breadcrumb-item>
          </slot>
        </slot>
      </el-breadcrumb>
    </div>
    <div class="routeContentArea">
      <router-view> </router-view>
      <div class="copyrightArea">Copyright © 2019-2022 知识图谱产品组</div>
    </div>

  </div>
  <el-dialog ref="dialogDom" :title="detailDialog.title" v-model="detailDialog.visible" :width="detailDialog.width" :center="detailDialog.center || false">
    <el-button @click="confirmUpload" type="success" style="position: absolute; top: 90px; right: 25px; z-index: 3;">确认上传</el-button>
    <el-upload :auto-upload="false" :file-list="fileList" :on-change="handleChange" :on-remove="handleRemove" ref="uploadDemo" :headers="headers" class="upload-demo" drag :action="upload" multiple>
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
       拖动文件到这， 或者<em>通过点击选择文件</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          一次性上传excel文件和多张图片，文件内容需符合模板内容规范(<a :href="template" download="template.xlsx">点击下载excel文件模板</a>)
        </div>
      </template>
    </el-upload>
  </el-dialog>
</div>
</template>

<script>
import commonMenu from "./../components/commonMenu"
export default {
  name: '',
  components: {
    commonMenu
  },
  data() {
    var roles = sessionStorage.getItem('roles') || "[]";
    roles = JSON.parse(roles);
    var tArr = roles.map(item => {
      return item.name
    });
    var mData = MenuConfig.other;
    var isAdmin = (tArr.indexOf("管理员") !== -1);
    if (isAdmin) {
      mData = MenuConfig.admin;
    }
    var userInfo = sessionStorage.getItem("userInfo") || "{}";
    return {
      upload: adapter.config.upload.url,
      template: "mock/template.xlsx",
      logoText: document.title,
      currentBreadcrumb: [],
      fileList: [],
      userInfo: JSON.parse(userInfo),
      headers: {
        token: sessionStorage.getItem("token"),
        userId: sessionStorage.getItem("userId")
      },
      roles: roles,
      isAdmin: isAdmin,
      detailDialog: {
        visible: false,
        title: "上传数据",
        width: "700px",
      },
      menuData: {
        defaultActive: this.$route.path,
        data: mData
      },
      pathMap: {
        任务执行: '/implement/taskList',
        报告通报: '/taskReportList',
      },
      breadcrumbMap: {
        taskReportList: ['任务执行', '报告通报'],
        confirmTaskData: ['任务执行', '分析印证'],
        'dataManager-reportDetails': ['配置中心', '数据管理', '素材详情'],
        'reportBrowse-reportDetails': ['任务执行', '报告浏览', '查看报告'],
      },
    };
  },
  watch: {
    $route(to, from) {
      var k = from.name + '-' + to.name;
      this.currentBreadcrumb =
        this.breadcrumbMap[k] || this.breadcrumbMap[to.name] || [];
      localStorage.setItem("currentBreadcrumb", JSON.stringify(this.currentBreadcrumb));
      // this.menuData.defaultActive = this.$route.path;
      this.$refs.menuItem.defaultActive = this.$route.path;
    },
  },
  beforeMount(to, from, next) {
    let code = util.getCode();
    console.log("###code:", code);
    if (code) {
      this.$router.push({
        path: "/transition"
      })
    }
  },
  computed: {
    flag() {
      //是否显示面包屑
      var ret = (!!this.currentBreadcrumb && this.currentBreadcrumb.length !== 0);
      return ret;
    }
  },
  created() {
    var tBreadcrumb = JSON.parse(localStorage.getItem("currentBreadcrumb"));
    this.currentBreadcrumb = tBreadcrumb || this.breadcrumbMap[this.$route.name] || [];
  },
  methods: {
    handleExitLogin() {
      util.loginOut();
    },

    confirmUpload() {
      //判断是否有文件再上传
      if (this.fileList.length === 0) {
        return this.$message.warning('请选取文件后再上传')
      }
      // 下面的代码将创建一个空的FormData对象:
      const formData = new FormData()
      // 你可以使用FormData.append来添加键/值对到表单里面；
      this.fileList.forEach((file) => {
        formData.append('file', file.raw)
      });
      var _self = this;
      adapter.upload(formData, function (tData) {
        if (tData.data.code === 20000 || tData.data.code === 200) {
          _self.$message({
            type: "success",
            message: "上传成功！"
          });
          if (_self.$refs.uploadDemo) {
            _self.$refs.uploadDemo.clearFiles();
          }
        }
      })
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。function(file, fileList)
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleUploadData() {
      this.detailDialog.visible = true;
      if (this.$refs.uploadDemo) {
        this.$refs.uploadDemo.clearFiles();
      }
    }
  },
};
</script>

<style scoped>
.mainFramework {
  float: left;
  width: 100%;
  height: 100%;
  overflow: hidden;
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  background-size: 100vw 100%;
  display: block;
  padding-top: 64px;
  position: relative;
}

.topMenuArea {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 62px;
  line-height: 62px;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  padding-left: 10px;
  border-bottom: solid 0px #666;
  box-shadow: 0px 0px 2px #000;
}

.logoText {
  display: inline-block;
  height: 64px;
  line-height: 64px;
  margin-right: 20px;
  width: auto !important;
  color: #ddd;

}

.logoText {
  font-weight: 800;
  font-size: 20px;
}

.userInfoArea {
  line-height: 64px;
  cursor: pointer;
  margin-right: 10px;
  max-width: 90px;
  color: #ddd;
  z-index: 2;
  display: inline-block;
}

.el-dropdown-link i.arrowDown {
  display: inline-block;
  margin-top: -52px;
}

.el-icon {
  vertical-align: middle;
  font-size: 20px;
}

.contentArea {
  position: relative;
  background-color: #f2f2f2;
  width: 100%;
  height: 100%;

}

.mainFramework[withBreadcrumb='true'] .contentArea {
  padding-top: 64px;
}

.mainFramework[withBreadcrumb='false'] .contentArea {
  padding-top: 0px;
}

.contentArea .breadcrumbArea {
  position: absolute;
  top: 0px;
  left: 0px;
  line-height: 64px;
  width: 100%;
  height: 64px;
}

.routeContentArea {
  width: 100%;
  position: relative;
  height: 100%;
  overflow: auto;
  background-color: #f2f2f2;

}

/* :deep(.el-dialog__body) {
  height: 250px;
} */

.topRightArea {
  position: absolute;
  display: inline-block;
  right: 10px;
  line-height: 64px;
  height: 64px;
  z-index: 2;
  width: calc(50% - 100px);
}

.commonMenuArea {
  position: absolute;
  right: 150px;
  line-height: 64px;
  height: 64px;
  width: calc(100% - 100px);
  display: inline-block;
}

.commonMenuArea .el-menu--horizontal {
  text-align: right;
}

.loginBtn,
.el-dropdown {
  position: absolute;
  right: 0px;
  line-height: 64px;
  height: 64px;
  z-index: 2;
}

.dialogContentArea {
  position: relative;
  float: left;
  width: 100%;
  height: auto;
}

.uploadItemArea {
  width: calc(100% - 120px);
  display: inline-block;
  float: left;
}

.confirmUploadArea {
  width: 120px;
  display: inline-block;
  float: left;
  text-align: right;
}

.routeContentArea>.moduleItemArea {
  float: none !important;
  position: relative;
  padding-left: 10px;
  padding-top: 10px;
  max-width: 1200px;
  margin: auto;
  height: auto;
  min-height: calc(100% - 40px);
  overflow: auto;
}

.copyrightArea {
  float: left;
  width: 100%;
  position: relative;
  text-align: center;
  padding: 10px 0px;
  font-size: 14px;
  background: rgba(0, 11, 66);
  color: #999;
}
</style>
