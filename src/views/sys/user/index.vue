<template>
  <div class="page-container">
    <!--工具栏-->
    <div
      class="toolbar"
      style="float: left; padding-top: 10px; padding-left: 15px"
    >
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <fm-button
            icon="fa fa-search"
            :label="$t('action.search')"
            perms="sys:role:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <fm-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="sys:user:add"
            type="primary"
            @click="handleAdd"
          />
        </el-form-item>
      </el-form>
    </div>
    <div
      class="toolbar"
      style="float: right; padding-top: 10px; padding-right: 15px"
    >
      <el-form :inline="true" :size="size">
        <el-form-item>
          <el-button-group>
            <el-tooltip content="刷新" placement="top">
              <el-button
                icon="fa fa-refresh"
                @click="findPage(null)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="列显示" placement="top">
              <el-button
                icon="fa fa-filter"
                @click="displayFilterColumnsDialog"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="导出" placement="top">
              <el-button
                icon="fa fa-file-excel-o"
                @click="exportUserExcelFile"
              ></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
      <!--表格显示列界面-->
      <table-column-filter-dialog
        ref="tableColumnFilterDialog"
        :columns="columns"
        @handleFilterColumns="handleFilterColumns"
      >
      </table-column-filter-dialog>
    </div>
    <!--表格内容栏-->
    <fm-table
      permsEdit="sys:user:edit"
      permsDelete="sys:user:delete"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    >
    </fm-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation ? '新增' : '编辑'"
      width="40%"
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
            v-model="dataForm.id"
            :disabled="true"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传封面">
          <el-upload class="upload-cover"
                     drag
                     action="http://121.5.129.126:8001/file/images"
                     multipartFile
                     :on-success="uploadCover">
            <i class="el-icon-upload"
               v-if="dataForm.avatar == ''" />
            <div class="el-upload__text"
                 v-if="dataForm.avatar == ''">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <img v-else
                 :src="dataForm.avatar"
                 width="360px"
                 height="180px" />
          </el-upload>

        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="dataForm.nickName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="dataForm.password"
            type="password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="deptName">
          <popup-tree-input
            :data="deptData"
            :props="deptTreeProps"
            :prop="dataForm.deptName"
            :nodeKey="'' + dataForm.deptId"
            :currentChangeHandle="deptTreeCurrentChangeHandle"
          >
          </popup-tree-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="userRoles" v-if="!operation">
          <el-select
            v-model="dataForm.userRoles"
            multiple
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.remark"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
import { USER_FIND_PAGE, EXPORT_USER_EXCEL, BATCH_DELETE, USER_SAVE } from '@/api/modules/user.js';
import { ROLE_FIN_ALL } from '@/api/modules/role.js';
import { DEPT_FIND_TREE } from '@/api/modules/dept.js';
import PopupTreeInput from "@/components/popup-tree-input";
import FmTable from "@/views/core/FMTable"
import FmButton from "@/views/core/FMButton";
import TableTreeColumn from "@/views/core/TableTreeColumn";
import { format } from "@/libs/datetime"
export default {
  components: {
    PopupTreeInput,
    FmTable,
    FmButton,
    TableTreeColumn
  },
  data () {
    return {
      size: 'small',
      filters: {
        name: ''
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 8 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        name: '',
        password: '123456',
        deptId: 1,
        deptName: '',
        email: '@qq.com',
        mobile: '',
        status: 1,
        userRoles: [],
        avatar: ""
      },
      deptData: [],
      deptTreeProps: {
        label: 'name',
        children: 'children'
      },
      roles: [],
      ids: []
    }
  },
  methods: {
    // 获取分页数据
    findPage: function (data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest
      }
      // this.pageRequest.params = [{ name: 'name', value: this.filters.name }]
      USER_FIND_PAGE(this.pageRequest).then((res) => {
        this.pageResult = res
        this.findUserRoles()
      }).then(data != null ? data.callback : '')
    },
    // 导出Excel用户信息
    exportUserExcelFile: function () {
      this.pageRequest.pageSize = 100000
      this.pageRequest.params = [{ name: 'name', value: this.filters.name }]
      EXPORT_USER_EXCEL(this.pageRequest).then((res) => {
        this.$alert(res, '导出成功', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      })
    },
    uploadCover (response) {
      this.dataForm.avatar = response.msg;
    },
    // 加载用户角色信息
    findUserRoles: function () {
      ROLE_FIN_ALL().then((res) => {
        // 加载角色集合
        this.roles = res.data
      })
    },
    // 批量删除
    handleDelete: function (data) {
      BATCH_DELETE(data.params).then(data != null ? data.callback : '')
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        id: 0,
        name: '',
        password: '',
        deptId: 1,
        deptName: '',
        email: '',
        mobile: '',
        status: 1,
        userRoles: []
      }
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.dialogVisible = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
      let userRoles = []
      for (let i = 0, len = params.row.userRoles.length; i < len; i++) {
        userRoles.push(params.row.userRoles[i].roleId)
      }
      this.dataForm.userRoles = userRoles
    },
    // 编辑
    submitForm: function () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let params = Object.assign({}, this.dataForm)
            let userRoles = []
            for (let i = 0, len = params.userRoles.length; i < len; i++) {
              let userRole = {
                userId: params.id,
                roleId: params.userRoles[i]
              }
              userRoles.push(userRole)
            }
            params.userRoles = userRoles
            USER_SAVE(params).then((res) => {
              this.editLoading = false
              if (res) {
                this.$message({ message: '操作成功', type: 'success' })
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
              this.findPage(null)
            })
          })
        }
      })
    },
    // 获取部门列表
    findDeptTree: function () {
      DEPT_FIND_TREE().then((res) => {
        this.deptData = res
      })
    },
    // 菜单树选中
    deptTreeCurrentChangeHandle (data, node) {
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.name
    },
    // 时间格式化
    dateFormat: function (row, column, cellValue, index) {
      return format(row[column.property])
    },
    // 处理表格列过滤显示
    displayFilterColumnsDialog: function () {
      this.$refs.tableColumnFilterDialog.setDialogVisible(true)
    },
    // 处理表格列过滤显示
    handleFilterColumns: function (data) {
      this.filterColumns = data.filterColumns
      this.$refs.tableColumnFilterDialog.setDialogVisible(false)
    },
    // 处理表格列过滤显示
    initColumns: function () {
      this.columns = [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "name", label: "用户名", minWidth: 120 },
        { prop: "nickName", label: "昵称", minWidth: 120 },
        { prop: "deptName", label: "机构", minWidth: 120 },
        { prop: "roleNames", label: "角色", minWidth: 100 },
        { prop: "email", label: "邮箱", minWidth: 120 },
        { prop: "mobile", label: "手机", minWidth: 100 },
        { prop: "status", label: "状态", minWidth: 70 },
        // {prop:"createBy", label:"创建人", minWidth:120},
        // {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ]
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
    }
  },
  mounted () {
    this.findDeptTree()
    this.initColumns()
  }
}
</script>

<style scoped>
</style>
