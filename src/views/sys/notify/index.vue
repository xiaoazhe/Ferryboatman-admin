<template>
  <div>
    <!-- 搜索栏-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="名称">
        <el-input v-model="page.name" placeholder="内容" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" sizi="mini" @click="getByPage">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleAdd" type="primary" style="margin-left: 16px;">
          添加
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table :data="notifyData.content" border style="width: 100%">
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column prop="isRead" label="是否已读" />
      <el-table-column prop="createBy" label="创建者" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown>
            <el-dropdown-menu> </el-dropdown-menu>
              <el-button size="mini" type="primary" @click="view(scope.row.id)">查看内容</el-button>
              <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>

          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
                     :current-page="page.pageNum"
                     :page-size="page.pageSize"
                     :total="notifyData.totalSize" style="float:right;">
      </el-pagination>
    </div>

    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="90%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px"  ref="dataForm"
               label-position="right">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.uid" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="dataForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="summary">
          <el-input type="textarea" v-model="dataForm.remarks" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="接受人" prop="author">
          <el-select multiple v-model="dataForm.userIds" placeholder="请选择" @click="changeUserId($event)">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <mavon-editor v-model="dataForm.content" auto-complete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog width="90%" :visible.sync="viewDialog" :close-on-click-modal="true">
      <div v-html="content"></div>
    </el-dialog>
  </div>
</template>

<script>
  import { NOTIFY_SAVE, NOTIFY_DELETE, NOTIFY_GET_BY_ID, NOTIFY_GET_LIST, NOTIFY_PAGE, NOTIFY_GET_USER_LIST, NOTIFY_UPDATE_READ } from '@/api/modules/notify.js';

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
        dialogVisible: false,
        operation: false,
        editLoading: false,
        viewDialog: false,
        notifyData: {
          content: [],
          pageNum: "",
          pageSize: "",
          totalPages: "",
          totalSize: 0
        },
        dataForm: {},
        content: "",
        userList: "",
        value:""
      }
    },
    mounted () {
      this.getByPage()
    },
    methods: {
      getByPage () {
        NOTIFY_PAGE(this.page).then(res => {
          this.notifyData = res
          this.page.pageNum = res.pageNum
          this.page.pageSize = res.pageSize
        })
      },
      changeUserId(item) {
        this.dataForm.userIds = item.id;
      },
      // 换页刷新
      refreshPageRequest: function (pageNum) {
        this.page.pageNum = pageNum
        this.getByPage()
      },
      handleDelete (id) {
        // 删除
        this.$confirm('是否删除该通知?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          NOTIFY_DELETE(id).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
      },
      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true
        this.operation = true
        this.dataForm = {
          id: "",
          title: '',
          content: '',
          files: "",
          remarks: '',
          notifyId: '',
          userId: ''
        }
        NOTIFY_GET_USER_LIST().then((res) => {
          this.userList = res.data
        })
      },
      // 显示编辑界面
      handleEdit: function (params) {
        this.dialogVisible = true
        this.operation = false
        NOTIFY_GET_BY_ID(params).then((res) => {
          this.dataForm = res
        })
        NOTIFY_GET_USER_LIST().then((res) => {
          this.userList = res
        })
      },
      // 查看
      view: function (params) {
        this.viewDialog = true
        NOTIFY_GET_BY_ID(params).then((res) => {
          this.content = res.notify.content
        })
        NOTIFY_UPDATE_READ(params).then((res) => {
        })
      },
      submitForm: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              NOTIFY_SAVE(params).then((res) => {
                this.editLoading = false
                if(res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.dialogVisible = false
                  this.$refs['dataForm'].resetFields()
                } else {
                  this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
                this.getByPage()
              })
            })
          }
        })
      },
    }
  }
</script>
