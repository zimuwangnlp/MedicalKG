<template>
<div class="listArea">
  <ul>
    <li v-for="(item, index) in items" :key="index">
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  beforeMount() {
    
  },
  data() {
    return {
      show: true,
      items: [{
        title: "测试标题001",
        description: "描述内容...."
      }]
    };
  },
  methods: {
    updateData(menuInfo) {

    },

  },
  created() {},
  props: {
    menuInfo: Object,
  },
};
</script>

<style scoped>
.listArea {
  width: 100%;
  height: 100%;
}
</style>
