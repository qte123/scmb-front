<template>
  <div>
    <el-dialog title="重置管理员密码" :visible.sync="isShow">
      <common-form
        :formLabel="usernameFormLabel"
        :form="usernameForm"
        :inline="true"
        ref="form"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="resetPassword">确定</el-button>
      </div>
    </el-dialog>
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="form"
      label-width="100px"
      class="login-container"
    >
      <h3 class="login-title">图床登录</h3>
      <el-form-item
        label="用户名"
        label-width="80px"
        prop="username"
        class="username"
      >
        <el-input
          type="input"
          v-model="form.username"
          autocomplete="off"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="80px" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          autocomplete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item class="login-submit"
        ><el-button type="primary" @click="login" class="login-submit"
          >登录</el-button
        ><el-button type="primary" @click="register" class="login-submit"
          >注册</el-button
        >
      </el-form-item>
      <div style="text-align: center; font-size: 15px">
        <h4>普通用户忘记密码请联系管理员重置密码！</h4>
        <el-button @click="openDialog">管理员重置密码入口</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { login, getUser } from "../../api/data.js";

import CommonForm from "../../src/components/CommonForm.vue";
export default {
  name: "Login",
  components: { CommonForm },
  data() {
    return {
      isShow: false,
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 9,
            message: "用户名长度在3-9个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码长度在6-18个字符之间",
            trigger: "blur",
          },
        ],
      },
      usernameForm: {
        username: "",
        code: "",
      },
      usernameFormLabel: [
        {
          model: "username",
          label: "用户名",
          type: "input",
        },
        {
          model: "code",
          label: "邀请码",
          type: "input",
        },
      ],
    };
  },
  methods: {
    openDialog() {
      this.isShow = true;
    },
    resetPassword() {
      let param = new URLSearchParams();
      param.append("action", "reset_password");
      param.append("username", this.usernameForm.username);
      param.append("address", "login");
      param.append("code", this.usernameForm.code);
      getUser(param).then((res) => {
        var ret = res.data["ret"];
        var msg = res.data["msg"];
        if (ret === 0) {
          this.$message.success(msg);
          this.isShow = false;
        } else {
          this.$message.error(msg);
        }
      });
    },
    login() {
      var username = this.form.username;
      var password = this.form.password;
      if (username !== "" && password !== "") {
        let param = new URLSearchParams();
        param.append("username", username);
        param.append("password", password);
        login(param).then((res) => {
          var ret = res.data["ret"];
          var msg = res.data["msg"];
          if (ret === 0) {
            this.$message.success(msg);
            console.log(res.data.menu);
            this.$store.commit("clearMenu");
            this.$store.commit("setMenu", res.data.menu);
            this.$store.commit("setToken", res.data.token);
            this.$store.commit("setUser", res.data.user);
            this.$store.commit(
              "setUsername",
              JSON.parse(res.data.user).username
            );
            this.$store.commit("addMenu", this.$router);
            this.$router.push({ name: "Home" });
          } else {
            this.$message.error(msg);
          }
        });
      } else {
        this.$message.error("用户名或密码为空");
      }
    },
    register() {
      this.$router.push({ name: "Register" });
    },
  },
};
</script>
<style lang="less" scoped>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login-title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.login-submit {
  margin: 10px 10px 0px auto;
}
</style>