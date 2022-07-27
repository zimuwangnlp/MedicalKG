<template>
<div class="contentArea">
  <el-button @click="handleClickBtn" v-if="!logined || !userData.name" type="success" plain>登录/注册</el-button>
  <el-dropdown v-if="logined && userData.name">
    <span class="el-dropdown-link">
      {{userData.name}}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <slot v-for="d in loginedMenu">
          <el-dropdown-item @click="handleClickMenu">{{d.label}}</el-dropdown-item>
        </slot>
         <el-dropdown-item @click="existLogin">退出登录</el-dropdown-item>
      </el-dropdown-menu>
     
    </template>
  </el-dropdown>
</div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      logined: false,
      userData: {
        name: "",
        id: "",
        role: []
      },
      loginedMenu: [{
        label: "我的应用",
        path: "/myApps"
      }]
    };
  },
  beforeMount() {

  },
  methods: {
    handleClickBtn() {
      this.logined = true;
      this.userData.name = "刘文金";
    },
    existLogin() {
      this.logined = false;
      this.userData = {
        name: "",
        id: "",
        role: []
      }
    },
    handleClickMenu() {

    }
  }
};
</script>

<style scope>
.el-dropdown-link {
  cursor: pointer;
}
</style>
