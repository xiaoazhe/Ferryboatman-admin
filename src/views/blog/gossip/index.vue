<template>
  <div>
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
    </el-form>
    <el-table
      :data="gossipData.rows"
      style="width: 100%;margin-bottom: 20px;"
      row-key="_id"
      border
      default-expand-all
      :tree-props="{children: 'gossipList', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="_id"
        label="ID"
        sortable
        width="180">
      </el-table-column>

      <el-table-column
        prop="nickname"
        label="发布人"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="visits"
        label="浏览量">
      </el-table-column>
      <el-table-column
        prop="thumbup"
        label="点赞数">
      </el-table-column>
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
                  @click="findById(scope.row._id)"
                >查看内容</el-button
                >
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row._id)"
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
        :total="gossipData.total"
        style="float: right"
      >
      </el-pagination>
    </div>
    <el-dialog title="内容" :visible.sync="lrcDialog">
      <div v-html="gossip.content" />
    </el-dialog>
  </div>
</template>
<script>
  import {
    GOSSIP_DELETE,
    GOSSIP_FIND_ID,
    GOSSIP_PAGE
  } from "@/api/modules/gossip.js";
  export default {
    data() {
      return {
        page: {
          pageNum: 1, // 当前页
          pageSize: 10, // 每页显示条数
          name: ''
        },
        gossipData: {
          rows: [],
          pageNum: "",
          pageSize: "",
          totalPages: "",
          total: 0
        },
        lrcDialog: false, // 控制修改弹窗显示
        gossip: {}
      }
    },
    created () {
      this.getByPage()
    },
    methods: {
      getByPage () {
        GOSSIP_PAGE(this.page.pageNum, this.page.pageSize, this.page.name).then(res => {
          this.gossipData = res
        })
      },
      // 换页刷新
      refreshPageRequest: function (pageNum) {
        this.page.pageNum = pageNum
        this.getByPage()
      },
      findById (id) {
        // 阅读歌词
        GOSSIP_FIND_ID(id).then(res => {
          this.gossip = res
          this.lrcDialog = true
        })
      },
      handleDelete (id) {
        // 删除
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          GOSSIP_DELETE(id).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
      },
    },
  }
</script>
