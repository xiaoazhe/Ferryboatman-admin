<template>
  <div style="height: 80%">
    <!-- 搜索栏-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="标题名">
        <el-input v-model="page.name" placeholder="标题名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" sizi="mini" @click="getByPage"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button @click="handleAdd" type="primary" style="margin-left: 16px">
          添加
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table :data="dataForm.content" border style="width: 100%" height="100%">
      <el-table-column prop="id" label="编号" />
      <el-table-column
        prop="title"
        label="标题"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column prop="summary" label="简介" sortable="custom" />
      <el-table-column prop="fileUid" label="图片" width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 100%; height: 100px"
            :src="scope.row.fileUid"
            :preview-src-list="[scope.row.fileUid]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable="custom" />
      <el-table-column prop="isOriginal" label="原创" sortable="custom">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isOriginal === 1">是</el-tag>
          <el-tag v-else type="info">不是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isPublish" label="发布" sortable="custom">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isOriginal === 1">是</el-tag>
          <el-tag v-else type="info">不是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="articlesPart"
        label="出处"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.row.id)"
                  >编辑</el-button
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                  >删除</el-button
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="toolbar" style="padding: 10px">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        @current-change="refreshPageRequest"
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        :total="dataForm.totalSize"
        style="float: right"
      >
      </el-pagination>
    </div>

    <!--新增编辑界面-->
    <el-dialog
      :title="operation ? '新增' : '编辑'"
      width="90%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input
            v-model="dataForm.uid"
            :disabled="true"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传封面">
          <el-upload
            class="upload-cover"
            drag
            action="http://121.5.129.126:8001/file/images"
            multipartFile
            :on-success="uploadCover"
          >
            <i class="el-icon-upload" v-if="dataForm.fileUid == ''" />
            <div class="el-upload__text" v-if="dataForm.fileUid == ''">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <img v-else :src="dataForm.fileUid" width="360px" height="180px" />
          </el-upload>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="dataForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input
            type="textarea"
            v-model="dataForm.summary"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="typeName">
          <el-select
            v-model="dataForm.typeName"
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

        <el-form-item label="作者" prop="author">
          <el-input v-model="dataForm.author"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <mavon-editor
            v-model="dataForm.content"
            ref="md"
            @imgAdd="imgAdd"
            @imgDel="imgDel"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{
          $t("action.cancel")
        }}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
          >{{ $t("action.submit") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  BLOG_SAVE,
  BLOG_PAGE,
  BLOG_DELETE_BATCH,
  BLOG_DELETE_ID,
  BLOG_GET_BY_ID,
  BLOG_USER_PAGE,
  BLOG_USER_DELETE_ID,
} from "@/api/modules/blog.js";
import {
  GET_FILE_CONFIG,
  FDFS_UPLOAD,
  FDFS_DELETE,
  FILE_CONFIG,
} from "@/api/modules/file.js";
import {
  TYPE_DELETE,
  TYPE_SAVE,
  TYPE_BY_ID,
  TYPE_FIND_ALL,
  TYPE_PAGE,
} from "@/api/modules/type.js";
export default {
  components: {},
  data() {
    return {
      page: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示条数
        name: "",
      },
      dataForm: {
        content: [],
        pageNum: "",
        pageSize: "",
        totalPages: "",
        totalSize: 0,
      },
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {},
      // 类型列表
      typeData: [],
      typeName: {
        id: 0,
        name: "",
        description: "",
        sort: "",
        icon: "",
        available: "",
      },
      size: "small",
    };
  },
  created() {
    this.getByPage();
  },
  methods: {
    getByPage() {
      BLOG_PAGE(this.page).then((res) => {
        this.dataForm = res;
        this.page.pageNum = res.pageNum;
        this.page.pageSize = res.pageSize;
      });
    },
    imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("file", $file);
      FDFS_UPLOAD(formdata).then((res) => {
        let _res = res;
        // 第二步.将返回的url替换到文本原位置[外链图片转存失败(img-v2eG7egk-1562220599730)(0)] -> [外链图片转存失败(img-RmlJ1kIp-1562220599733)(url)]
        this.$refs.md.$img2Url(pos, _res);
      });
    },
    imgDel(pos) {
      var formdata = new FormData();
      formdata.append("url", pos[0]);
      FDFS_DELETE(formdata).then((res) => {
        Message.success("删除成功");
      });
      delete this.imgFile[pos];
    },
    // 换页刷新
    refreshPageRequest: function (pageNum) {
      this.page.pageNum = pageNum;
      this.getByPage();
    },
    // 修改
    handleEdit(id) {
      this.dialogVisible = true;
      this.operation = false;
      TYPE_BY_ID(id).then((res) => {
        this.typeName = res;
      });
      BLOG_GET_BY_ID(id).then((res) => {
        this.dataForm = res;
      });
    },
    handleDelete(id) {
      // 删除
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        BLOG_DELETE_ID(id).then((res) => {
          this.$message.success(res.msg);
          this.getByPage();
        });
      });
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm = {
        uid: 0,
        title: "",
        summary: "",
        content: "",
        fileUid: "",
      };
    },
    // 编辑
    submitForm: function () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            BLOG_SAVE(params).then((res) => {
              this.editLoading = false;
              if (res) {
                this.$message({ message: "操作成功", type: "success" });
                this.dialogVisible = false;
                this.$refs["dataForm"].resetFields();
              } else {
                this.$message({
                  message: "操作失败, " + res.msg,
                  type: "error",
                });
              }
              this.getByPage(null);
            });
          });
        }
      });
    },
    // 时间格式化
    dateFormat: function (row, column, cellValue, index) {
      return format(row[column.property]);
    },
    // 获取类型列表
    findTypeList: function () {
      TYPE_FIND_ALL().then((res) => {
        this.typeData = res;
      });
    },
    uploadCover(response) {
      this.dataForm.fileUid = response.msg;
    },
  },
  mounted() {
    this.findTypeList();
  },
};
</script>
<style scoped>
.add-container {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.add-button {
  margin-top: 5px;
  margin-right: 10px;
}
</style>

