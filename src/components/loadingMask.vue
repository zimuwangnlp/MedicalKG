<template>
<div v-if="!!isLoading" class="loading-wrap">
  <div class="loading-container">
    <div class="loading-show">
      <div class="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <h2 class="loading-text">数据加载中，请稍后...</h2>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  components: {

  },
  name: 'Loading',
  data() {
    return {

    };
  },
  computed: {
    isLoading() {
      return window.store.state.loadingCount;
    },
  },
};
</script>

<style scoped>
.loading-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.3);
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-show {
  flex: 0 0 400px;
  text-align: center;
}

.loading-icon {
  /* width: 120px;
  height: 120px; */
  vertical-align: middle;
  margin-bottom: 26px;
  font-size: 60px;
  text-align: center;
  color: rgb(74, 144, 226);
}

.loading-text {
  font-size: 16px;
  color: #fff;
  text-align: center;
}

/*
 * Loading Dots
 * Can we use pseudo elements here instead :after?
 */
.loading span {
  display: inline-block;
  vertical-align: middle;
  width: 1.15em;
  height: 1.15em;
  margin: .15em;
  background: #007DB6;
  border-radius: 1.15em;
  animation: loading 1s infinite alternate;
}

/*
 * Dots Colors
 * Smarter targeting vs nth-of-type?
 */
.loading span:nth-of-type(2) {
  background: #008FB2;
  animation-delay: 0.2s;
}

.loading span:nth-of-type(3) {
  background: #009B9E;
  animation-delay: 0.4s;
}

.loading span:nth-of-type(4) {
  background: #00A77D;
  animation-delay: 0.6s;
}

.loading span:nth-of-type(5) {
  background: #00B247;
  animation-delay: 0.8s;
}

.loading span:nth-of-type(6) {
  background: #5AB027;
  animation-delay: 1.0s;
}

.loading span:nth-of-type(7) {
  background: #A0B61E;
  animation-delay: 1.2s;
}

/*
 * Animation keyframes
 * Use transition opacity instead of keyframes?
 */
@keyframes loading {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
