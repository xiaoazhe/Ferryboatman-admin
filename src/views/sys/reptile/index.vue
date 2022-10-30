<template>


  <el-tabs class="cont" :tab-position="tabPosition">
    <el-tab-pane label="单篇获取">

      <el-form ref="form" :model="sizeForm" label-width="80px" size="mini" label->
        <el-form-item label="地址获取">
          <el-input v-model="sizeForm.url"></el-input>
        </el-form-item>
        <el-form-item label="转存图片">
          <el-switch v-model="sizeForm.convertImg"></el-switch>
        </el-form-item>
        <el-form-item label="内容分类" prop="typeName">
          <el-select
            v-model="sizeForm.typeId"
            size="small"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in typeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-radio-group v-model="sizeForm.title" size="medium">
            <el-radio border label="csdn">csdn(true)</el-radio>
            <el-radio border label="oschina">(开源中国-true)</el-radio>
            <el-radio border label="cnblogs">(博客园-true)</el-radio>
            <el-radio border label="imooc">imooc(无图片 有查看更多拦截)</el-radio>
            <el-radio border label="iteye">iteye(true)</el-radio>
            <el-radio border label="juejin">juejin(false)</el-radio>
            <el-radio border label="v2ex">v2ex(false)</el-radio>
            <el-radio border label="jianshu">jianshu(滑块拦截)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmitSingle">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>

    </el-tab-pane>
    <el-tab-pane label="批量获取">
      <el-form ref="form" :model="sizeForm" label-width="80px" size="mini" label->
        <el-form-item label="目标用户id">
          <el-input v-model="sizeForm.userId"></el-input>
        </el-form-item>

        <el-form-item label="获取数量" >
          <el-input v-model.number="sizeForm.count" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="内容分类" prop="typeName">
          <el-select
            v-model="sizeForm.typeId"
            size="small"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in typeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="地址">
          <el-radio-group v-model="sizeForm.title" size="medium">
            <el-radio border label="csdn">csdn(true)</el-radio>
            <el-radio border label="oschina">(开源中国-true)</el-radio>
            <el-radio border label="cnblogs">(博客园-true)</el-radio>
            <el-radio border label="imooc">imooc(无图片 有查看更多拦截)</el-radio>
            <el-radio border label="iteye">iteye(true)</el-radio>
            <el-radio border label="juejin">juejin(false)</el-radio>
            <el-radio border label="v2ex">v2ex(false)</el-radio>
            <el-radio border label="jianshu">jianshu(滑块拦截)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmitBringList">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>

    <el-dialog title="日志" :visible.sync="lrcDialog" >
      <div v-html="response" style="white-space:pre-wrap"/>
    </el-dialog>
    <div v-html="desc" style="white-space:pre-wrap"/>
  </el-tabs>
</template>
<script>
import {
  TYPE_FIND_ALL,
} from "@/api/modules/type.js";
import {
  REPTILE_BRING_BACK_LIST,
  REPTILE_SINGLE,
} from "@/api/modules/reptile.js";
export default {
  data() {
    return {
      tabPosition: 'left',
      sizeForm: {},
      // 类型列表
      typeData: [],
      response: "",
      lrcDialog: false,
      desc:"\n" +
        "          csdn cnblogs oschina可以\n" +
        "          imooc 无图片 有查看更多拦截\n" +
        "          iteye 批量不行 单个能解析 貌似有问题\n" +
        "          juejin 批量 单个支持不了了\n" +
        "          v2ex 打不开\n" +
        "          jianshu 滑块拦截\n" +
        "     <a href=\"https://www.imooc.com\">imooc</a>" +
        "     <a href=\"https://blog.csdn.net/\">csdn</a>" +
        "     <a href=\"https://www.cnblogs.com\">csdn</a>" +
        "     <a href=\"https://www.iteye.com\">iteye</a>" +
        "     <a href=\" https://juejin.im\">juejin</a>" +
        "     <a href=\"https://www.v2ex.com\">v2ex</a>" +
        "     <a href=\"https://my.oschina.net\">oschina</a>" +
        "     <a href=\"https://www.jianshu.com\">jianshu</a>"
    };
  },
  mounted() {
    this.findTypeList();
  },
  methods: {
    onSubmitSingle() {
      this.lrcDialog = true
      REPTILE_SINGLE(this.sizeForm).then((res) => {
        this.response = res.replaceAll("<script>parent.printMessage('","\n").replaceAll("\)\;\\<\/script>","\n")
        this.$message({ message: "结束", type: 'success' })
      });
    },

    onSubmitBringList() {
      this.lrcDialog = true
      REPTILE_BRING_BACK_LIST(this.sizeForm).then((res) => {
        this.response = res.replaceAll("<script>parent.printMessage('","\n").replaceAll("\)\;\\<\/script>","\n")
        this.$message({ message: "结束", type: 'success' })
      });
    },

    // 获取类型列表
    findTypeList: function () {
      TYPE_FIND_ALL().then((res) => {
        this.typeData = res;
      });
    },
  }
};
</script>
