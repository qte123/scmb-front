<template>
  <div>
    <h1 class="title">图片分类:</h1>
    <common-tag :tags="tags" @clickMenu="clickMenu"></common-tag>
    <el-dialog title="图片信息" :visible.sync="isShow" class="dialog">
      <div class="webpath">图片名：{{ imgItem.filename }}</div>
      <div class="webpath">图片分类:{{ imgItem.classify }}</div>
      <div class="webpath">网络地址：{{ imgItem.webpath }}</div>
      <div class="webpath">上传日期：{{ imgItem.create_date }}</div>
      <div class="webpath">上传者：{{ imgItem.upload_user }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- <div class="manage-header" style="text-align: center">
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
    <el-row class="home" :gutter="20" style="margin-left: 100px">
      <not-found v-if="length === 0" />
      <el-col
        v-if="length !== 0"
        :span="25"
        style="margin-top: 20px; margin-left: 100px"
      >
        <div class="num">
          <el-card
            v-for="(item, index) in countData"
            :key="index"
            :body-style="{ display: 'flex', padding: 0 }"
          >
            <div>
              <img class="userImg" :src="item.webpath" />
              <div>
                <span
                  >查看详细：<a
                    href="javascript:void(0)"
                    @click="handleDialog(item)"
                    >点击显示</a
                  ></span
                ><br />
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
import { getImages } from "../../api/data.js";

export default {
  name: "Search",
  components: {
    CommonTag,
    CommonForm,
    NotFound,
  },
  data() {
    return {
      isShow: false,
      formLabel: [
        {
          model: "keyword",
          label: "",
          type: "input",
        },
      ],
      searchForm: { keyword: "" },
      countData: [],
      tags: [],
      imgItem: {},
      user: {},
    };
  },
  methods: {
    handleDialog(item) {
      this.isShow = true;
      this.imgItem = item;
    },
    getTagsList() {
      let param = new URLSearchParams();
      param.append("action", "get_classify_list");
      getImages(param).then((res) => {
        this.tags = res.data.retlist;
      });
    },
    getImagesList() {
      let param = new URLSearchParams();
      param.append("action", "get_image_list");
      param.append("username", "");
      param.append("classify", "");
      getImages(param).then((res) => {
        this.countData = res.data.retlist;
      });
    },
    getTokenUser() {
      this.$store.commit("getUser");
      this.user = JSON.parse(this.$store.state.user.user);
    },
    clickMenu(item) {
      let param = new URLSearchParams();
      param.append("action", "get_image_list");
      param.append("username", "");
      param.append("classify", item.value);
      getImages(param).then((res) => {
        this.countData = res.data.retlist;
      });
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
  },
};
</script>
<style lang="less" scoped>
@import "../../src/assets/less/index.less";
.dialog {
  margin-left: 100px;
  text-align: center;
  .webpath {
    font-size: 20px;
  }
}
.el-card {
  float: left;
  margin-right: 50px;
  // width: 12%;
  margin-bottom: 20px;
  text-align: center;
}
</style>
