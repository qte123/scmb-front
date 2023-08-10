<template>
  <div>
    <h1 class="title">用户类别:</h1>
    <common-tag :tags="tags" @clickMenu="clickMenu"></common-tag>
    <el-dialog title="修改用户信息" :visible.sync="isShow">
      <common-form
        :formLabel="operateFormLabel"
        :form="operateForm"
        :inline="true"
        ref="form"
      />
      <div slot="footer" class="dialog-footer">
         <el-button type="danger" @click="reset">重置密码</el-button>
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
    <div class="manage-header">
      <common-form
        :formLabel="formLabel"
        :form="searchForm"
        :inline="true"
        ref="form"
      >
        <el-button type="primary" @click="getList(searchForm.keyword)"
          >搜索</el-button
        >
      </common-form>
    </div>
    <common-table
      :tableData="tableData"
      :tableLabel="tableLabel"
      @edit="editUser"
      @delete="delUser"
    ></common-table>
  </div>
</template>

<script>
import CommonTag from "../../src/components/CommonTag.vue";
import CommonTable from "../../src/components/CommonTable.vue";
import CommonForm from "../../src/components/CommonForm.vue";
import { getUser } from "../../api/data.js";

export default {
  name: "User",
  components: { CommonTag, CommonTable, CommonForm },
  data() {
    return {
      isShow: false,
      tags: [],
      tableData: [],
      tableLabel: [
        {
          prop: "username",
          label: "用户名",
        },
        {
          prop: "imgTotal",
          label: "图片上传总数",
        },
        {
          prop: "type",
          label: "用户类型",
        },
        {
          prop: "last_login",
          label: "最近登录时间",
          width: 200,
        },
        {
          prop: "add_date",
          label: "用户注册时间",
          width: 200,
        },
        {
          prop: "modify_date",
          label: "用户信息修改时间",
          width: 200,
        },
        {
          prop: "status",
          label: "账号状态",
        },
        {
          prop: "line",
          label: "用户状态",
        },
      ],
      formLabel: [
        {
          model: "keyword",
          label: "",
          type: "input",
        },
      ],
      operateForm: {
        type: "",
        status: "",
      },
      username: "",
      operateFormLabel: [
        {
          model: "type",
          label: "用户类型",
          type: "select",
          opts: [
            {
              label: "普通用户",
              value: "普通用户",
            },
            {
              label: "管理员",
              value: "管理员",
            },
          ],
        },
        {
          model: "status",
          label: "账号状态",
          type: "select",
          opts: [
            {
              label: "启用",
              value: "启用",
            },
            {
              label: "停用",
              value: "停用",
            },
          ],
        },
      ],
      searchForm: { keyword: "" },
    };
  },
  methods: {
    editUser(row) {
      this.isShow = true;
      this.username = row.username;
      this.operateForm.type = row.type;
      this.operateForm.status = row.status;
    },
    delUser(row) {
      let param = new URLSearchParams();
      param.append("action", "delete_user");
      param.append("username", row.username);
      this.$confirm("此操作将永久删除该用户以及该用户所有的图片,是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        getUser(param).then((res) => {
          var ret = res.data["ret"];
          var msg = res.data["msg"];
          if (ret === 0) {
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
          this.getUserList();
        });
      }).catch(()=>{});//注意这里，这里是重点！！！;
    },
    getTagsList() {
      let param = new URLSearchParams();
      param.append("action", "get_user_type");
      getUser(param).then((res) => {
        this.tags = res.data.retlist;
      });
    },
    getUserList() {
      let param = new URLSearchParams();
      param.append("action", "get_user_list");
      param.append("user_type", "");
      param.append("username", "");
      getUser(param).then((res) => {
        this.tableData = res.data.retlist;
      });
    },
    clickMenu(item) {
      let param = new URLSearchParams();
      param.append("action", "get_user_list");
      param.append("user_type", item.value);
      param.append("username", "");
      getUser(param).then((res) => {
        this.tableData = res.data.retlist;
      });
    },
    getList(username) {
      let param = new URLSearchParams();
      param.append("action", "get_user_list");
      param.append("user_type", "");
      param.append("username", username);
      getUser(param).then((res) => {
        this.tableData = res.data.retlist;
      });
    },
    confirm() {
      let param = new URLSearchParams();
      param.append("action", "modify_user");
      param.append("username", this.username);
      param.append("type", this.operateForm.type);
      param.append("status", this.operateForm.status);
      getUser(param).then((res) => {
        var ret = res.data["ret"];
        var msg = res.data["msg"];
        if (ret === 0) {
          this.$message.success(msg);
           this.isShow = false;
        } else {
          this.$message.error(msg);
        }
        this.getUserList();
      });
    },
    reset(){
      let param = new URLSearchParams();
      param.append("action", "reset_password");
      param.append("username", this.username);
      param.append("address", 'user');
      param.append("code", '');
      getUser(param).then((res) => {
        var ret = res.data["ret"];
        var msg = res.data["msg"];
        if (ret === 0) {
          this.$message.success(msg);
          this.isShow=false
        } else {
          this.$message.error(msg);
        }
        this.getUserList();
      });
    }
  },
  created() {
    this.getTagsList();
    this.getUserList();
  },
};
</script>
<style lang="less" scoped>
@import "../../src/assets/less/index.less";
.manage-header {
  display: flex;
  justify-content: space-between; //左右靠边
  align-items: center; //上下对齐
}
</style>