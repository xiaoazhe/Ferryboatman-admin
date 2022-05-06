<template>
  <div>
    <!-- 列表 -->
    <el-table :data="userData.content" border style="width: 100%" @sort-change="changeSort">
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="name" label="歌曲名" width="200" show-overflow-tooltip />
      <el-table-column prop="nickName" label="歌曲名" width="200" show-overflow-tooltip />
      <el-table-column prop="roleNames" label="歌手" sortable="custom" />
      <el-table-column prop="avatar" label="图片" width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 100%;height: 100px"
            :src="scope.row.cover"
            :preview-src-list="[scope.row.cover]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" sortable="custom" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
        :total="userData.totalSize" style="float:right;">
      </el-pagination>
    </div>
  </div>
</template>


<script>
import { USER_FIND_PAGE } from '@/api/modules/user.js'
export default {
  name: 'page1',
  data () {
    return {
      page: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示条数
        name: '',
        enabled: ''
      },
      userData: {
        content: [],
        pageNum: "",
        pageSize: "",
        totalPages: "",
        totalSize: 0
      },
    }
  },

  created () {
    this.getByPage()
  },
   methods: {
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getByPage()
    },
    getByPage () {
      USER_FIND_PAGE(this.page).then(res => {
        console.log(res)
        this.userData = res
        this.userData.content = res.content
        this.page.pageNum = res.pageNum
        this.page.pageSize = res.pageSize
      })
    },
    // 换页刷新
    refreshPageRequest: function (pageNum) {
      this.page.pageNum = pageNum
      this.getByPage()
    }
  }
}
</script>
