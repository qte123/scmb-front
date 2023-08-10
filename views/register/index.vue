<template>
  <el-form
    :model="form"
    status-icon
    :rules="rules"
    ref="form"
    label-width="100px"
    class="login-container"
  >
    <h3 class="login-title">用户注册</h3>
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
    <el-form-item label="确认密码" label-width="80px" prop="password">
      <el-input
        type="password"
        v-model="form.againPassword"
        autocomplete="off"
        placeholder="请再次输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item label="用户类型">
      <el-radio-group v-model="form.userType" @change="agreeChange">
        <el-radio label="0" name="userType">普通用户</el-radio>
        <el-radio label="1" name="userType">管理员</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="邀请码"
      label-width="80px"
      class="username"
      v-if="isShow"
      prop="code"
    >
      <el-input
        type="input"
        v-model="form.code"
        autocomplete="off"
        placeholder="请输入邀请码"
      ></el-input>
    </el-form-item>
    <el-form-item class="register-submit">
      <el-button type="primary" @click="register">注册</el-button
      ><el-button type="primary" @click="pre" class="register-submit"
        >返回</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { register } from "../../api/data.js";

export default {
  name: "Register",
  data() {
    return {
      isShow: false,
      form: {
        username: "",
        password: "",
        againPassword: "",
        userType: "0",
        code: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 9,
            message: "用户名长度在3-9个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 18,
            message: "密码长度在6-18个字符之间",
            trigger: "blur",
          },
        ],
        againPassword: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 18,
            message: "密码长度在6-18个字符之间",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "请再次输入邀请码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    agreeChange(val) {
      if (val === "0") {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    isUsername(username) {
      //判断用户名是否正确格式
      var reg = /^[a-zA-Z0-9_-]{3,9}$/;
      return reg.test(username);
    },
    isPassword(password) {
      //判断密码是否是正确格式
      var reg = /^[\w]{6,18}$/;
      return reg.test(password);
    },
    register() {
      var username = this.form.username;
      var password = this.form.password;
      var againPassword = this.form.againPassword;
      var userType = this.form.userType;
      var code = this.form.code;
      if (username !== "" && password !== "" && againPassword !== "") {
        if (password !== againPassword) {
          this.$message.error("两次密码不相同");
        } else if (!this.isUsername(username)) {
          this.$message.error("用户名格式不正确！");
        } else if (!this.isPassword(password)) {
          this.$message.error("密码格式不正确！");
        } else {
          let param = new URLSearchParams();
          param.append("username", username);
          param.append("password", password);
          param.append("userType", userType);
          param.append("code", code);
          register(param).then((res) => {
            var ret = res.data["ret"];
            var msg = res.data["msg"];
            if (ret === 0) {
              this.$message.success(msg);
              this.$router.push({ name: "Login" });
            } else {
              this.$message.error(msg);
            }
          });
        }
      } else {
        this.$message.error("用户名或密码为空");
      }
    },
    pre() {
      this.$router.push({ name: "Login" });
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