<template>
  <div style="height: 80%">
    <!-- 搜索栏-->
    <el-form :inline="true"
             :model="page"
             class="demo-form-inline"
             size="mini">
      <el-form-item label="标题名">
        <el-input v-model="page.name"
                  placeholder="标题名"
                  clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   sizi="mini"
                   @click="getByPage">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table :data="dataForm.content"
              border
              style="width: 100%" height="100%">
      <el-table-column prop="id"
                       label="编号" />
      <el-table-column prop="mobile"
                       label="手机号"
                       width="200"
                       show-overflow-tooltip />
      <el-table-column prop="nickname"
                       label="昵称"
                       sortable="custom" />
      <el-table-column prop="avatar"
                       label="图片"
                       width="120">
        <template slot-scope="scope">
          <el-image style="width: 100%;height: 100px"
                    :src="scope.row.avatar"
                    :preview-src-list="[scope.row.avatar]" />
        </template>
      </el-table-column>
      <el-table-column prop="regdate"
                       label="创建时间"
                       sortable="custom" />

      <el-table-column prop="email"
                       label="email"
                       width="200"
                       show-overflow-tooltip />
      <el-table-column prop="interest"
                       label="兴趣"
                       width="200"
                       show-overflow-tooltip />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary"
                       size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini"
                           type="danger"
                           @click="handleDelete(scope.row.id)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="toolbar"
         style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper"
                     @current-change="refreshPageRequest"
                     :current-page="page.pageNum"
                     :page-size="page.pageSize"
                     :total="dataForm.totalSize"
                     style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {
    BLOG_USER_PAGE,
    BLOG_USER_DELETE_ID
  } from "@/api/modules/blog.js";
  export default {
    components: {

    },
    data () {
      return {
        page: {
          pageNum: 1, // 当前页
          pageSize: 10, // 每页显示条数
          name: ''
        },
        dataForm: {
          content: [],
          pageNum: "",
          pageSize: "",
          totalPages: "",
          totalSize: 0
        },
        dataFormRules: {
        },
        typeName: {
          id: 0,
          name: '',
          description: '',
          sort: "",
          icon: '',
          available: ""
        },
        size: 'small'
      }
    },
    created () {
      this.getByPage()
    },
    methods: {
      getByPage () {
        BLOG_USER_PAGE(this.page).then(res => {
          this.dataForm = res
          this.page.pageNum = res.pageNum
          this.page.pageSize = res.pageSize
        })
      },
      // 换页刷新
      refreshPageRequest: function (pageNum) {
        this.page.pageNum = pageNum
        this.getByPage()
      },
      handleDelete (id) {
        // 删除
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          BLOG_USER_DELETE_ID(id).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
      },
      // 时间格式化
      dateFormat: function (row, column, cellValue, index) {
        return format(row[column.property])
      },
      uploadCover (response) {
        this.dataForm.fileUid = response.data;
      },
    }
  }
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

