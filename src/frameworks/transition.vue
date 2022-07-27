<style lang="scss" scoped>
  .login {
    height: 100vh;
    background: url(~@/assets/img/bg_shadow.png) no-repeat center center;
    background-size: cover;
    overflow: hidden;
  }
</style>
<template>
  <div class="login" v-loading="loading"></div>
</template>
<script>
  import constant from "@/assets/js/constant";
  export default {
    name: "transition",
    data() {
      return {
        loading: true,
      };
    },
    created() {
      // cas重定向回来的 url中获取 code参数
      let code = util.getCode();
      if (code) {
        // 根据 code获取 token
        this.getTokenByCode(code);
      }
      else {
        util.login();
      }
    },
    mounted() { },
    methods: {
      getUserInfo(token) {
        adapter.getUserInfo({access_token: token}, function(res) {
          if (res.data) {
              var userInfo = res.data.data;
              sessionStorage.setItem("userId", userInfo.id);
              sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
              adapter.getUserRole({
                  access_token: token,
                  offset: -1
                }, function(tData) {
                console.log(tData.data);
                var roles = tData.data.data || []
                sessionStorage.setItem("roles", JSON.stringify(roles));
                location.href = location.protocol + "//" + location.host;
              }, {
                userId: userInfo.id
              })
              
            }
        })
      },
      getTokenByCode(code) {
        var url = location.protocol + "//" + location.host;
        var data = {
          "grant_type":  "authorization_code",
          "client_id": constant.appId,
          "code": code,
          "client_secret": constant.client_secret,
          "redirect_uri" : url
        }
        var _self = this;
        adapter.getUserToken(data, function(res){
          const token = res.data.access_token;
          sessionStorage.setItem("token", token);
          _self.getUserInfo(token);
        });
      }
    },
  };
</script>