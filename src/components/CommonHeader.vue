<template>
  <header>
    <div class="l-content">
      <el-button
        @click="handleMenu"
        plain
        icon="el-icon-menu"
        size="mini"
      ></el-button>
      <!-- <h3 style="color: #fff">首页</h3> -->
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="item in tags"
          :key="item.path"
          :to="{ path: item.path }"
          >{{ item.label }}</el-breadcrumb-item
        >
      </el-breadcrumb> -->
    </div>
    <div class="r-content">
      <el-dropdown trigger="click" szie="mini">
        <span>
          <img class="user" :src="user.webpath" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="goHome">个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import { logout } from "../../api/data.js";

export default {
  name: "CommonHeader",
  data() {
    return {
      user: {},
    };
  },
  methods: {
    handleMenu() {
      this.$store.commit("collapseMenu");
    },
    goHome() {
      this.$router.push({ name: "Home" });
    },
    logout() {
      let param = new URLSearchParams();
      param.append("username", this.user.username);
      logout(param).then((res) => {
        var ret = res.data["ret"];
        var msg = res.data["msg"];
        if (ret === 0) {
          this.$message.success(msg);
          this.$store.commit("clearToken");
          this.$store.commit("clearMenu");
          this.$store.commit("clearUser");
          this.$router.push({ name: "Login" });
        }
      });
    },
    getTokenUser() {
      this.$store.commit("getUser");
      this.user = JSON.parse(this.$store.state.user.user);
    },
  },
  created() {
    this.getTokenUser();
  },
};
</script>
<style lang="less" scoped>
header {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>
