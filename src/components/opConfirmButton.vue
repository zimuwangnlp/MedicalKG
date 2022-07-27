<template>
<div class="buttonContainer" v-if="roleFlag">
  <div class="buttonItemArea">
    <el-popconfirm title="确定要删除这条记录吗？" @confirm="handleConfirm">
      <template #reference>
        <el-button circle type="danger" size="small" title="删除">
          <el-icon>
            <CloseBold />
          </el-icon>
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</div>
</template>

<script>
export default {
  beforeMount() {

  },
  data() {
    var roles = sessionStorage.getItem('roles') || "[]";
    roles = JSON.parse(roles);
    var tArr = roles.map(item => {
      return item.name
    });
    return {
      roleFlag: tArr.indexOf("管理员") !== -1
    };
  },
  methods: {
    handleConfirm() {
      var type = this.type || this.data.type || "Report";
      var id = this.data.id || this.data._id;
      var param = {
        type: type,
        id: id
      }
      debugger
      var _self = this;
      adapter.delete(param, function (tData) {
        _self.$message({
          type: "success",
          message: "删除成功"
        });
        _self.$emit("deleteSuccess", tData);
      }, param);

    },
  },
  created() {},
  props: {
    data: Object,
    type: String
  },
};
</script>

<style scoped>
.buttonContainer {
  left: 0px;
  position: absolute;
  z-index: 2;
  display: none;
}

.buttonItemArea {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
}
</style>
