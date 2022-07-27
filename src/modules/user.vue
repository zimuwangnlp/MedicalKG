<template>
<div class="moduleItemArea">
  <div class="topOptionArea">
    <el-button size="default" type="primary" @click="handleOpenDialog()">新增用户</el-button>
  </div>
  <div class="tableInfoArea">
    <DataTable :dataObj="dataInfo" @button-click="handleButtonClick" @page-change="handlePageChange"></DataTable>
  </div>
</div>
<el-dialog :title="addDialogParam.title" v-model="addDialogParam.visible" :width="addDialogParam.width">
  <FormInfo ref="dialogForm" :dataObj="addDialogParam.formData"></FormInfo>
  <template #footer v-if="addDialogParam.withFooter">
    <span class="dialog-footer">
      <el-button size="default" @click="addDialogParam.visible = false">取 消</el-button>
      <el-button size="default" type="primary" @click="addDialogParam.visible = confirmUserDialog() ">确 定</el-button>
    </span>
  </template>
</el-dialog>
</template>

<script>
import DataTable from "./../components/dataTable";
import FormInfo from "./../components/formInfo";
import constant from './../assets/js/constant';
export default {
  name: '',
  components: {
    DataTable,
    FormInfo
  },
  data() {
    return {
      appId: constant.appId,
      token: sessionStorage.getItem('token'),
      roles: [],
      addDialogParam: {
        title: "新增用户",
        visible: false,
        width: "600px",
        withFooter: true,
        formData: {
          labelWidth: "80px",
          result: {
            name: "",
            password: "",
            realName: "",
            roles: []
          },
          data: [{
            key: 'name',
            name: '用户名',
            value: '',
            type: 'text',
            size: 'default',
            items: [{
              placeholder: '请输入用户名',
            }, ],
          }, {
            key: 'password',
            name: '登录密码',
            value: '',
            type: 'text',
            showPassword: true,
            size: 'default',
            items: [{
              placeholder: '请输入密码',
            }, ],
          }, {
            key: 'realName',
            name: '姓名',
            value: '',
            type: 'text',
            size: 'default',
            items: [{
              placeholder: '请输入姓名',
            }, ],
          }, {
            key: 'roles',
            name: '所属角色',
            value: '',
            type: 'select',
            multiple: true,
            size: 'default',
            items: [{
              type: "select",
              multiple: true,
              placeholder: '请输入角色',
              options: []
            }, ],
          }]
        }
      },
      dataInfo: {
        withIndex: true,
        maxHeight: document.body.clientHeight - 200,
        map: {
          createTime: function (v) {
            return util.transformPHPTime(v);
          }
        },
        header: [{
          //prop标识该元素所代表的数据列与data数组元素的哪个属性绑定
          prop: 'name',
          //label标识该元素所代表的数据列头名称标签
          label: '用户名',
        }, {
          prop: 'realName',
          label: '姓名',
          width: '150',
        }, {
          prop: 'roleName',
          label: '所属角色',
          width: '150',
        }, {
          prop: 'createTime',
          label: '创建时间',
          width: '180',
        }, {
          prop: 'user',
          label: '操作',
          width: '220',
          buttons: [{
              label: '删除',
              eventName: 'deleteItem',
              size: 'default',
            }, {
              label: '重置密码',
              eventName: 'resetPassword',
              size: 'default',
            },
            {
              label: '编辑',
              eventName: 'editItem',
              size: 'default',
            }
          ],
        }],
        data: [],
        page: {
           //background标识分页条是否有背景，有的话背景是什么
          background: false,
          //sizes标识当前分页条支持每页最多显示记录数可以切换的数值
          sizes: [15, 30, 45, 60],
          //pageSize标识当前分页条每页最多显示条数
          pageSize: 15,
          //layout标识当前分页条包含的操作元素
          layout: 'total, sizes, prev, pager, next, jumper',
          //total标识当前分页条对应数据总量总条数
          total: 10,
          currentPage: 1
        }
      }
    };
  },
  watch: {
    $route(to, from) {

    },
  },
  computed: {

  },
  created() {
    this.updateTabeInfo();
    this.updateRoleSelector();
  },
  methods: {
    confirmUserDialog() {
      var _self = this;
      var param = this.$refs.dialogForm.getFormValue();
      var data = this.addDialogParam.current || {};
      var d = {
        "appId": this.appId,
        "name": param.name,
        "realName": param.realName,
        "password": data.password || param.password,
        "id": data.id || "-1",
        "idleTime": data.idleTime || 86400,
        "expirTime": data.expirTime || 86400,
        "loginFlag": data.loginFlag || "0",
        "phone": data.phone || "",
        "remarks":  data.remarks || ""
      }
      if(!this.addDialogParam.flag) {
         adapter.addUserItem(d, function (tData) {
          if (tData.data.code === 200) {
            var d = tData.data.data;
            _self.setUserInfo(d.id, param.roles);
          }
        }, {
          token: this.token
        })
      }
      else {
        adapter.updateUserItem(d, function (tData) {
          if (tData.data.code === 200) {
            _self.setUserInfo(d.id, param.roles, _self.addDialogParam.flag);
          }
        }, {
          token: this.token
        })
      }
     
      return false;
    },
    setUserInfo(user, roles, flag) {
      console.log(user, roles);
      var _self = this;
      if(!flag) {
        adapter.setUserApplication([this.appId], function (tData) {
          if (tData.data.code === 200) {
            adapter.setUserRole(roles, function (tData) {
              if (tData.data.code === 200) {
                _self.$message({
                  type: "success",
                  message: "添加用户成功。"
                });
                _self.updateTabeInfo();
              }
            }, {
              token: _self.token,
              userId: user,
              appId: _self.appId
            })
          }
        }, {
          token: this.token,
          userId: user,
        })
      }
      else {
        adapter.setUserRole(roles, function (tData) {
              if (tData.data.code === 200) {
                _self.$message({
                  type: "success",
                  message: "编辑用户成功。"
                });
                _self.updateTabeInfo();
              }
            }, {
              token: _self.token,
              userId: user,
              appId: _self.appId
            })
      }
      

    },
    handleOpenDialog(data, flag) {
      var result = {
        name: "",
        password: "",
        realName: "",
        roles: []
      };
      var item = this.addDialogParam.formData.data[0];
      var tItem = this.addDialogParam.formData.data[1];
      this.addDialogParam.flag = flag;
      if (!flag) {
        item.type = "text";
        tItem.hide = false;
        this.addDialogParam.title = "新增用户";
      } else {
        item.type = '';
        // tItem.hide = true;
        this.addDialogParam.title = "编辑用户";
        this.addDialogParam.current = data;
        result = {
          name: data.name,
          realName: data.realName,
          roles: data.roleData.map(item => {
            return item.id;
          })
        }
      }

      this.addDialogParam.formData.result = result;
      if (this.$refs.dialogForm) {
        this.$refs.dialogForm.updateFormValue(result);
      }
      this.addDialogParam.visible = true;
    },
    handleButtonClick(name, d) {
      if (typeof this[name] === "function") {
        this[name](d);
      }
    },
    editItem(d) {
      this.handleOpenDialog(d, true);
    },
    updateRoleSelector() {
      var _self = this;
      adapter.getAllRoles({
        access_token: this.token,
        offset: 0,
      }, function (d) {
        console.log(d.data.data);
        _self.roles = d.data.data;
        _self.addDialogParam.formData.data[3].items[0].options = _self.roles.map(item => {
          item.label = item.name;
          item.value = item.id;
          return item;
        });
        // _self.roles[0] && (_self.appId = _self.roles[0].appId);
      })
    },
    resetPassword(d) {
      var _self = this;
      this.$confirm('确定重置密码为: 123qwe吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        adapter.resetPassword(d, function (tData) {
          if (tData.data.code === 200) {
            _self.$message({
              type: "success",
              message: "重置密码成功(123qwe)!"
            })
          }
        }, {
          token: this.token,
          userId: d.id,
          password: "123qwe"
        });
      })
    },
    deleteItem(d) {
      var _self = this;
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        adapter.deleteUserItem([d.id], function (tData) {
          if (tData.data.code === 200) {
            _self.$message({
              type: "success",
              message: "删除用户成功!"
            });
            _self.updateTabeInfo();
          }

        }, {
          token: this.token,
          appId: d.appId
        });
      })
    },
    handlePageChange(current, size) {
      this.dataInfo.page.currentPage = current;
      this.dataInfo.page.pageSize =  size;
      this.updateTabeInfo();
    },
    updateTabeInfo() {
      var _self = this;
      adapter.getUserList({
        access_token: this.token,
        offset: (this.dataInfo.page.currentPage - 1) * this.dataInfo.page.pageSize,
        count: this.dataInfo.page.pageSize
      }, function (tData) {
        _self.dataInfo.data = tData.data.data;
        _self.dataInfo.page.total = tData.data.total;
        _self.updateRoleInfo(_self.dataInfo.data);
      })
    },
    updateRoleInfo(arr) {
      for (let i = 0; i < arr.length; i++) {
        this.getUserRole(arr[i]);
      }
    },
    getUserRole(user) {
      var _self = this;
      adapter.getUserRole({
        access_token: this.token,
        offset: -1
      }, function (tData) {
        var roleData = tData.data.data;
        var d = roleData.map(item => {
          return item.name;
        });
        user.roleName = d.join(",");
        user.roleData = roleData;
      }, {
        userId: user.id
      })
    }
  },
};
</script>

<style>
.moduleItemArea {
  float: left;
  width: 100%;
  height: 100%;
  filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
  -moz-background-size: 100% 100%;
  background-size: 100vw 100%;
  display: block;
  position: relative;
}

.topOptionArea {
  padding: 15px 10px;
  text-align: left;
}

.tableInfoArea {
  width: 100%;
  height: calc(100% - 65px);
}
</style>
