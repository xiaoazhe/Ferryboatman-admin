<template>
  <div style="height: 80%">
    <!-- 搜索栏-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="名称">
        <el-input v-model="page.name" placeholder="内容" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" sizi="mini" @click="getByPage">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table :data="commentData.content" border style="width: 100%" height="100%">
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="blogName" label="博客名称" />
      <el-table-column  prop="content" label="评论内容" >
        <template slot-scope="scope">
          <div v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="评论人" />
      <el-table-column prop="toUserName" label="被回复的人" />
      <el-table-column prop="source" label="评论来源：" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="createTime" label="评论时间" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-button icon="fa fa-edit" :label="$t('action.view')" @click="handleEdit(scope.row.id)" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="handleDeleteAll(scope.row.id)">删除父子评论</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
                     :current-page="page.pageNum"
                     :page-size="page.pageSize"
                     :total="commentData.totalSize" style="float:right;">
      </el-pagination>
    </div>

    <!--右侧栏-->
    <el-drawer
      title="评论内容"
      :visible.sync="drawer"
      :before-close="handleClose">
      <!-- 列表 -->
      <el-input v-model="commentChildData[0].blogName" placeholder="歌曲名" clearable disabled=disabled />

      <el-tree :data="commentChildData" :props="defaultProps"></el-tree>

    </el-drawer>
  </div>
</template>

<script>
  import {
    COMMENT_PAGE,
    COMMENT_DELETE,
    COMMENT_DELETE_ALL,
    COMMENT_FIND_ID
  } from "@/api/modules/comment.js";
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
        drawer: false, //右侧栏
        commentData: {
          content: [],
          pageNum: "",
          pageSize: "",
          totalPages: "",
          totalSize: 0
        },
        commentChildData: [{
          blogId: "",
          blogName: "",
          commentList: [],
          content: "",
          createBy: null,
          createTime: "",
          firstCommentId: null,
          id: "",
          lastUpdateBy: null,
          source: "",
          status: "",
          toCommentId: "",
          toCommentName: "",
          toUserId: "",
          toUserName: "",
          type: "",
          updateTime: "",
          userId: "",
          userName: ""
        }],
        defaultProps: {
          children: 'commentList',
          label: 'content'
        }

      }
    },
    created () {
      this.getByPage()
    },
    methods: {
      getByPage () {
        COMMENT_PAGE(this.page).then(res => {
          this.commentData = res
          this.page.pageNum = res.pageNum
          this.page.pageSize = res.pageSize
        })
      },
      // 换页刷新
      refreshPageRequest: function (pageNum) {
        this.page.pageNum = pageNum
        this.getByPage()
      },
      // 右侧栏
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => { });
      },
      handleDelete (id) {
        // 删除
        this.$confirm('是否删除该评论?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          COMMENT_DELETE(id).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
      },
      handleDeleteAll (id) {
        // 删除
        this.$confirm('是否删除该评论和子评论?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          COMMENT_DELETE_ALL(id).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
      },
      // 右侧栏信息
      handleEdit (id) {
        COMMENT_FIND_ID(id).then(res => {
          this.drawer = true;
          this.commentChildData[0] = res
        })
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

