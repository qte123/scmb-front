<template>
  <div>
    <h1 class="title">图片分类:</h1>
    <common-tag :tags="tags" @clickMenu="clickMenu"></common-tag>
    <!-- <div class="manage-header">
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
    </div> -->
    <el-dialog title="修改图片信息" :visible.sync="isShow">
      <common-form
        :formLabel="operateFormLabel"
        :form="operateForm"
        :inline="true"
        ref="form"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
    <common-table
      :tableData="tableData"
      :tableLabel="tableLabel"
      @edit="editImage"
      @delete="delImage"
    ></common-table>
  </div>
</template>

<script>
import CommonTag from "../../src/components/CommonTag.vue";
import CommonTable from "../../src/components/CommonTable.vue";
import CommonForm from "../../src/components/CommonForm.vue";
import { getImages } from "../../api/data.js";

export default {
  name: "Images",
  components: {
    CommonTag,
    CommonTable,
    CommonForm,
  },
  data() {
    return {
      isShow: false,
      tags: [],
      tableData: [],
      tableLabel: [
        {
          prop: "filename",
          label: "图片名",
          width: 240,
        },
        {
          prop: "webpath",
          label: "图片网络地址",
          width: 410,
        },
        {
          prop: "type",
          label: "图片类型",
        },
        {
          prop: "classify",
          label: "图片分类",
        },
        {
          prop: "add_date",
          label: "图片上传时间",
          width: 200,
        },
        {
          prop: "upload_user",
          label: "上传者",
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
      filename: "",
      data: {
        username: "",
      },
      user: {},
    };
  },
  methods: {
    getTagsList() {
      let param = new URLSearchParams();
      param.append("action", "get_classify_list");
      getImages(param).then((res) => {
        this.tags = res.data.retlist;
        this.operateFormLabel[0].opts = res.data.retlist.slice(1);
      });
    },
    getImagesList() {
      let param = new URLSearchParams();
      param.append("action", "get_images_list");
      param.append("classify", "");
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
           this.isShow = false;
        } else {
          this.$message.error(msg);
        }
        this.getImagesList();
      });
    },
    getTokenUser() {
      this.$store.commit("getUser");
      this.user = JSON.parse(this.$store.state.user.user);
      this.data.username = this.user.username;
    },
    editImage(row) {
      if (row.type === "用户图片") {
        this.isShow = true;
        this.operateForm.classify = row.classify;
        this.filename = row.filename;
      } else {
        this.$message.error("用户头像信息不能修改");
      }
    },
    delImage(row) {
      let param = new URLSearchParams();
      param.append("action", "delete_image");
      param.append("username", row.upload_user);
      param.append("filename", row.filename);
      param.append("type", row.type);
      param.append("address", "image");
      this.$confirm("此操作将永久删除该图片,是否继续", "提示", {
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
          });
        })
        .catch(() => {}); //注意这里，这里是重点！！！;
    },
    clickMenu(item) {
      let param = new URLSearchParams();
      param.append("action", "get_images_list");
      param.append("classify", item.value);
      getImages(param).then((res) => {
        this.tableData = res.data.retlist;
      });
    },
  },
  created() {
    this.getTokenUser();
    this.getTagsList();
    this.getImagesList();
  },
};
</script>
<style lang="less" scoped>
@import "../../src/assets/less/index.less";
</style>