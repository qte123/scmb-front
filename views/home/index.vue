<template>
  <div>
    <el-row class="home" :gutter="20">
      <el-dialog :visible.sync="isShow" class="dialog">
        <h1 class="img_title">头像上传</h1>
        <el-upload
          class="avatar-uploader"
          :action="action"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-progress="loading"
          :on-error="error"
          :before-upload="beforeAvatarUpload"
          :data="data"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-dialog>
      <el-dialog title="修改用户密码" :visible.sync="isPassword">
        <common-form
          :formLabel="passwordFormLabel"
          :form="passwordForm"
          :inline="true"
          ref="form"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShow = false">取消</el-button>
          <el-button type="primary" @click="modifyPasword">确定</el-button>
        </div>
      </el-dialog>
      <el-col :span="8" style="margin-top: 20px">
        <el-card shadow="hover">
          <div class="user">
            <img class="userImg" :src="user.webpath" @click="openHead" />
            <div class="userInfo">
              <p class="name">{{ user.username }}</p>
              <p class="access">
                {{ user.user_type === 0 ? "普通用户" : "管理员" }}
              </p>
              <el-button size="mini" type="danger" @click="openPassword"
                >修改密码</el-button
              >
            </div>
          </div>
          <div class="login-info">
            <p>
              上次登录时间：<span>{{ user.last_login }}</span>
            </p>
          </div>
        </el-card>

        <el-card style="margin-top: 20px; height: 460px">
          <el-table :data="tableData">
            <el-table-column
              v-for="(val, key) in tableLabel"
              :key="key"
              :prop="key"
              :label="val"
            >
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="10" style="margin-top: 20px"
        ><h1 class="header-title">历史上传图片</h1>
        <h1 class="title">图片分类:</h1>
        <common-tag :tags="tags" @clickMenu="clickMenu"></common-tag>
        <el-dialog title="修改图片信息" :visible.sync="isModify">
          <common-form
            :formLabel="operateFormLabel"
            :form="operateForm"
            :inline="true"
            ref="form"
          />
          <div slot="footer" class="dialog-footer">
            <el-button @click="isModify = false">取消</el-button>
            <el-button type="primary" @click="confirm">确定</el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="图片信息"
          :visible.sync="isImgShow"
          class="dialog-img"
        >
          <div class="webpath">图片名：{{ imgItem.filename }}</div>
          <div class="webpath">图片分类:{{ imgItem.classify }}</div>
          <div class="webpath">网络地址：{{ imgItem.webpath }}</div>
          <div class="webpath">上传日期：{{ imgItem.create_date }}</div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editImage(imgItem)">编辑</el-button>
            <el-button type="danger" @click="delImage(imgItem)">删除</el-button>
            <el-button @click="isImgShow = false">取消</el-button>
          </div>
        </el-dialog>
        <not-found v-if="length === 0" />
        <div class="num"  v-if="length !== 0">
          <el-card 
            v-for="(item, index) in countData"
            :key="index"
            :body-style="{ display: 'flex', padding: 0 }"
            class="el-card-img"
          >
            <div>
              <img class="userImg" :src="item.webpath" />
              <div>
                <span
                  >查看详细：<a
                    href="javascript:void(0)"
                    @click="openMessage(item)"
                    >点击显示</a
                  ></span
                >
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CommonTag from "../../src/components/CommonTag.vue";
import CommonForm from "../../src/components/CommonForm.vue";
import NotFound from "../../src/components/NotFound.vue";
import { getImages, getUser, logout } from "../../api/data.js";

export default {
  name: "Home",
  components: { CommonTag, CommonForm, NotFound },
  inject: ["reload"],
  data() {
    return {
      isShow: false,
      isImgShow: false,
      isModify: false,
      isPassword: false,
      //使用require引入本地图片
      user: {},
      tableData: [],
      tableLabel: {
        type: "图片类别",
        total: "图片上传总数",
      },
      countData: [],
      tags: [],
      imageUrl: "",
      action: "/api/upload/upload_head/",
      imgItem: {},
      data: {
        username: "",
      },
      userImg: "",
      operateForm: {
        classify: "",
      },
      operateFormLabel: [
        {
          model: "classify",
          label: "图片分类",
          type: "select",
          opts: [],
        },
      ],
      passwordForm: {
        password: "",
      },
      passwordFormLabel: [
        {
          model: "password",
          label: "密码",
          type: "input",
        },
      ],
    };
  },
  methods: {
    openHead() {
      this.isShow = true;
      this.imageUrl = "";
    },
    openMessage(item) {
      this.isImgShow = true;
      this.imgItem = item;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$message.success("上传头像成功");
      this.getHead();
      console.log("success");
      setTimeout(() => {
        this.isShow = false;
      }, 3000);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
        return false
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false
      }
    },
    loading(event, file, fileList) {
      this.$message.success("正在上传头像，请稍等......");
    },
    error(err, file, fileList) {
      this.$message.error("上传头像失败,弹出3秒后自动关闭弹窗");
      setTimeout(() => {
        this.isShow = false;
      }, 3000);
      console.log("error");
    },
    getTagsList() {
      let param = new URLSearchParams();
      param.append("action", "get_classify_list");
      getImages(param).then((res) => {
        this.tags = res.data.retlist;
        console.log(this.tags);
        this.operateFormLabel[0].opts = res.data.retlist.slice(1);
      });
    },
    getImagesList() {
      let param = new URLSearchParams();
      param.append("action", "get_image_list");
      param.append("username", this.user.username);
      param.append("classify", "");
      getImages(param).then((res) => {
        console.log(res.data.retlist);
        this.countData = res.data.retlist;
      });
    },
    getHead() {
      let param = new URLSearchParams();
      param.append("action", "get_head");
      param.append("username", this.user.username);
      getImages(param).then((res) => {
        this.user.webpath = res.data.webpath;
        this.$store.commit("setUser", JSON.stringify(this.user));
        this.getTokenUser();
        this.reload();
      });
    },
    getTokenUser() {
      this.$store.commit("getUser");
      this.user = JSON.parse(this.$store.state.user.user);
      this.data.username = this.user.username;
    },
    clickMenu(item) {
      let param = new URLSearchParams();
      param.append("action", "get_image_list");
      param.append("username", this.user.username);
      param.append("classify", item.value);
      getImages(param).then((res) => {
        this.countData = res.data.retlist;
      });
    },
    getImagesTotal() {
      let param = new URLSearchParams();
      param.append("action", "get_images_num");
      param.append("username", this.user.username);
      getImages(param).then((res) => {
        this.tableData = res.data.retlist;
      });
    },
    confirm() {
      let param = new URLSearchParams();
      param.append("action", "modify_image");
      param.append("classify", this.operateForm.classify);
      param.append("filename", this.filename);
      getImages(param).then((res) => {
        var ret = res.data["ret"];
        var msg = res.data["msg"];
        if (ret === 0) {
          this.$message.success(msg);
          this.isModify = false;
        } else {
          this.$message.error(msg);
        }
        this.getImagesList();
      });
    },
    openPassword() {
      this.isPassword = true;
      this.passwordForm.password = "";
    },
    modifyPasword() {
      let param = new URLSearchParams();
      param.append("action", "modify_password");
      param.append("username", this.user.username);
      param.append("password", this.passwordForm.password);
      getUser(param).then((res) => {
        var ret = res.data["ret"];
        var msg = res.data["msg"];
        if (ret === 0) {
          this.$message.success(msg + "，请重新登录");
          let param = new URLSearchParams();
          param.append("username", this.user.username);
          logout(param).then((res) => {
            var ret = res.data["ret"];
            var msg = res.data["msg"];
            if (ret === 0) {
              this.$store.commit("clearToken");
              this.$store.commit("clearMenu");
              this.$store.commit("clearUser");
              this.$router.push({ name: "Login" });
            }
          });
        } else {
          this.$message.error(msg);
        }
      });
    },
    delImage(item) {
      let param = new URLSearchParams();
      param.append("action", "delete_image");
      param.append("username", this.user.username);
      param.append("filename", item.filename);
      param.append("address", "home");
      this.$confirm("此操作将永久删除该照片,是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          getImages(param).then((res) => {
            var ret = res.data["ret"];
            var msg = res.data["msg"];
            if (ret === 0) {
              this.$message.success(msg);
            } else {
              this.$message.error(msg);
            }
            this.getImagesList();
            this.isImgShow = false;
          });
        })
        .catch(() => {}); //注意这里，这里是重点！！！;
    },
    editImage(item) {
      this.isImgShow = false;
      this.isModify = true;
      this.operateForm.classify = item.classify;
      this.filename = item.filename;
    },
  },
  computed: {
    length() {
      return this.countData.length;
    },
  },
  created() {
    this.getTokenUser();
    this.getTagsList();
    this.getImagesList();
    this.getImagesTotal();
  },
};
</script>
<style lang="less" scoped>
@import "../../src/assets/less/index.less";
.header-title {
  text-align: center;
  font-size: 30px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.dialog {
  text-align: center;
  width: 500px;
  margin-left: 394px;
  margin-top: -116px;
  .img_title {
    font-size: 20px;
    margin-bottom: 20px;
  }
}
.el-card-img {
  float: left;
  margin-right: 50px;
  width: 26%;
  margin-bottom: 20px;
  text-align: center;
}
.dialog-img {
  width: 80%;
  margin-left: 100px;
  text-align: center;
  .webpath {
    font-size: 20px;
  }
}
</style>