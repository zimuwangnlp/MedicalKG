<template>
<router-view></router-view>
<LoadingMask></LoadingMask>
</template>

<script>
import LoadingMask from './components/loadingMask.vue';

export default {
  name: 'App',
  components: {
    LoadingMask
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: url(./assets/img/topic_bg.png) no-repeat center center;
  background-size: cover;
}

* {
  box-sizing: border-box;
}

.contentArea {
  width: 300px;
  height: 500px;
}
</style>
