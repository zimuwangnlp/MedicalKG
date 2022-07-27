<template>
<div class="mainFramework" :withBreadcrumb="flag">
  <div class="topMenuArea">
    <span class="logoText">{{logoText}}</span>
    <commonMenu :menuInfo="menuData"></commonMenu>
  </div>
  <div class="contentArea">
    <div class="secondMenuArea">
      <secondMenu :dataObj="sMenuData"></secondMenu>
    </div>
    <div class="routeContentArea">
      <router-view> </router-view>
    </div>
  </div>
</div>
</template>

<script>
import commonMenu from "./../components/commonMenu";
import secondMenu from "./../components/secondMenu"
export default {
  name: '',
  components: {
    commonMenu,
    secondMenu
  },
  data() {
    return {
      logoText: document.title,
      currentBreadcrumb: [],
      menuData: {
        data: MenuConfig.admin
      },
      sMenuData: {
        data: MenuConfig.admin[1].children
      }
    };
  },
  watch: {
    $route(to, from) {
     
    },
  },
  computed: {
    flag() {
    
    }
  },
  created() {
   
  },
  methods: {},
};
</script>

<style scoped>
.mainFramework {
  float: left;
  width: 100%;
  background: #f5f5f5;
  height: 100%;
  overflow: hidden;
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  background-size: 100vw 100%;
  display: block;
  padding-top: 64px;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
}

.topMenuArea {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 64px;
  line-height: 64px;
  width: 100%;
  text-align: left;
  box-sizing: border-box;
  padding-left: 10px;
  border-bottom: solid 1px #ddd;
  background: #fff;
}

.logoText,
.menuItemsArea {
  display: inline-block;
  height: 64px;
  line-height: 64px;
  margin-right: 20px;
  width: auto !important;
}

.logoText {
  font-weight: 800;
  font-size: 20px;
}

.menuItemsArea {
  min-width: 400px;
  vertical-align: middle;
  margin-top: 1px;
}

.menuItemsArea .el-menu {
  background: none;
}

.menuItemsArea .el-menu--horizontal {
  border-bottom: none;
}

.menuItemsArea .el-menu--horizontal>.el-sub-menu .el-sub-menu__title {
  border-bottom: none;
}

.contentArea {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 50px;
}

.mainFramework .contentArea {
  padding-top: 50px;
}

.contentArea .secondMenuArea {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  line-height: 50px;
  height: 50px;
  z-index: 1;
}

.routeContentArea {
  float: left;
  width: 100%;
  position: relative;
  height: 100%;
  overflow: auto;

}
</style>
