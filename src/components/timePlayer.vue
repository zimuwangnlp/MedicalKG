<template>
<div class="tiemPlayerArea">
  <el-timeline>
    <el-timeline-item v-for="(activity, index) in activities" :key="index" :icon="activity.icon" :type="activity.type" :color="activity.color" :size="activity.size" :hollow="activity.hollow" :timestamp="activity.timestamp">
      {{ activity.content }}
    </el-timeline-item>
  </el-timeline>
  <el-button link type="primary" @click="handleButtonClick">
    <el-icon v-if="playFlag">
      <VideoPause />
    </el-icon>
    <el-icon v-else>
      <VideoPlay />
    </el-icon>
  </el-button>

</div>
</template>

<style lang="scss" scoped>
.tiemPlayerArea {
  width: 100%;
  height: 100%;
  transform: scale(0.8);
  transform-origin: top left;

}

.el-timeline-item {
  padding-bottom: 5px;
}

.el-button {
  font-size: 30px;
  text-align: center;
  width: 90px;
}
</style>

<script>
import {
  MoreFilled
} from '@element-plus/icons-vue'

export default {
  name: '',
  props: {
    dataObj: Object,
  },
  data() {
    return {
      highlightColor: "rgb(1, 13, 69)",
      normalColor: "#ddd",
      current: 0,
      playFlag: true,
      gap: 1000,
      activities: []
    };
  },
  props: {
    min: Number,
    max: Number,
  },
  computed: {},
  watch: {

  },
  created() {
    this.initActivities(this.min, this.max);
  },
  mounted() {
    this.play();
  },
  methods: {
    initActivities(min, max) {
      this.activities = [];
      for (var i = max; i > min - 1; i--) {
        this.activities.push({
          content: i,
          size: 'large',
          color: "#ddd"
        })
      }
      this.current = 0;
    },
    updateData(dataObj) {

    },
    handleButtonClick() {
      this.playFlag = !this.playFlag;
    },
    pause() {
      this.playFlag = false;
    },
    continue () {
      this.playFlag = true;
      this.play();
    },
    play() {
      if (this.playFlag) {
        this.current += 1;
        if (this.current === this.activities.length) {
          this.current = 0;
        }
        if (this.activities[this.current]) {
          this.$emit("change", this.activities[this.current].content);
          this.setColor();
        }
      }
      var _self = this;
      setTimeout(function () {
        _self.play();
      }, this.gap);
    },
    setColor() {
      var arr = this.activities;
      for (var i = 0; i < arr.length; i++) {
        if (i === this.current) {
          arr[i].color = this.highlightColor;
        } else {
          arr[i].color = this.normalColor;
        }
      }
    },
  },
};
</script>
