<template>
  <div class="tabs">
    <el-tag v-for="tag in tags" :key="tag.name" @click="click(tag)">
      {{ tag.label }}
    </el-tag>
  </div>
</template>
<script>
export default {
  name: "CommonTag",
  props:{
    tags:Array
  },
  data() {
    return {
    };
  },
  methods: {
    click(item){
      this.$emit('clickMenu',item)
    },
  },
  computed: {},
};
</script>
<style lang="less" scoped>
.tabs {
  padding: 20px;
  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>