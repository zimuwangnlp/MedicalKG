<template>
  <div class="secondMenuArea browse">
    <div
      v-for="(item, index) in dataInfo.data"
      :key="index"
      class="tap"
      :class="{ active: index == dataInfo.current }"
      @click="handleClick(item, index)"
    >
      <router-link :to="item.path">
        <div class="link_href">{{ item.label }}</div>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.secondMenuArea {
  width: 100%;
  height: 100%;
}

.browse {
  display: flex;
  border-bottom: 1px solid #e8e8e8;
  height: 40px;
  line-height: 40px;
  color: #fff;

  .tap {
    margin-left: 50px;
    cursor: pointer;
    text-align: center;
  }
}

.active {
  border-bottom: 4px solid #1890ff;
}

.secondMenuArea a {
  text-decoration: none;
}

.link_href {
  width: 70px;
  height: 40px;
}
</style>

<script>
export default {
  name: '',
  props: {
    dataObj: Object,
  },
  data() {
    return {
      dataInfo: {
        current: 1,
        pathMap: {},
        data: [
          {
            label: '任务浏览',
            path: '/implement/taskList',
          },
          {
            label: '报告审批',
            path: '/implement/reportApproval',
          },
          {
            label: '报告浏览',
            path: '/implement/reportBrowse',
          },
        ],
      },
    };
  },
  computed: {},
  watch: {
    '$route.path'(value) {
      // console.log(value);
      this.dataInfo.current = this.pathMap[value] || 0;
    },
  },
  created() {},
  mounted() {
    this.updateData(this.dataObj);
    this.dataInfo.current = this.pathMap[this.$route.path] || 0;
  },
  methods: {
    updateData(dataObj) {
      for (var k in dataObj) {
        this.dataInfo[k] = dataObj[k];
      }
      this.pathMap = {};
      let arr = this.dataInfo.data || [];
      for (let i = 0; i < arr.length; i++) {
        let path = arr[i].path;
        this.pathMap[path] = i;
      }
    },
    handleClick(item, index) {
      this.dataInfo.current = index;
      this.$emit('click', item, index);
    },
  },
};
</script>
