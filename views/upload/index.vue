<template>
  <div class="upload">
    <el-upload
      class="upload-demo"
      drag
      :action="action"
      multiple
      :before-upload="before"
      :on-success="success"
      :on-progress="loading"
      :on-error="error"
      :data="data"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        只能上传jpg文件，且不超过500kb
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "Upload",
  data() {
    return {
      action: "/api/upload/upload_image/",
      data: {
        username: "",
      },
    };
  },
  inject: ["reload"],
  methods: {
    before(file){
      var filename=file.name
      var size=file.size
      var suffix=filename.substring(filename.lastIndexOf(".")+1);
      if(suffix!=="jpg"){
        this.$message.error("图片格式有误");
        return false
      }
      if(file > 524288000){
        this.$message.error("图片大小超过限制");
        return false
      }
    },
    success(response, file, fileList) {
      console.log(response);
      var ret = response["ret"];
      var msg = response["msg"];
      if (ret === 0) {
        this.$message.success("图片上传成功");
        console.log("success");
        this.reload();
      } else {
        this.$message.error("图片格式有误");
      }
    },
    loading(event, file, fileList) {
      this.$message.success("图片正在上传，请稍等......");
    },
    error(err, file, fileList) {
      this.$message.error("图片上传失败");
      console.log("error");
    },
    getTokenUser() {
      this.$store.commit("getUser");
      this.user = JSON.parse(this.$store.state.user.user);
      this.data.username = this.user.username;
    },
  },
  created() {
    this.getTokenUser();
  },
};
</script>
<style lang="less" scoped>
.upload {
  height: 1000px;
  text-align: center;
  margin-top: 300px;
  .el-upload__text {
    font-size: 20px;
    color: #ccc;
  }
  .el-upload__tip {
    font-size: 30px;
    color: #ccc;
  }
}
</style>
