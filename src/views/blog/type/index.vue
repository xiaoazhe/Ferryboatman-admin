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
            perms="sys:type:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <fm-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="sys:type:add"
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
      permsEdit="sys:type:edit"
      permsDelete="sys:type:delete"
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
        <el-form-item label="用户名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="dataForm.description"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="dataForm.sort"
            type="password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="dataForm.icon" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="可用" prop="available">
          <el-input v-model="dataForm.available" auto-complete="off"></el-input>
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
  import PopupTreeInput from "@/components/popup-tree-input";
  import FmTable from "@/views/core/FMTable"
  import FmButton from "@/views/core/FMButton"
  import TableTreeColumn from "@/views/core/TableTreeColumn";
  import { format } from "@/libs/datetime"
  import {
    TYPE_PAGE,
    TYPE_SAVE,
    TYPE_DELETE
  } from "@/api/modules/type.js";
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
            { required: true, message: '请输入', trigger: 'blur' }
          ]
        },
        // 新增编辑界面数据
        dataForm: {
          id: 0,
          name: '',
          description: '',
          sort: "",
          icon: '',
          available: ""
        },
        deptData: [],
        deptTreeProps: {
          label: 'name',
          children: 'children'
        },
        roles: []
      }
    },
    methods: {
      // 获取分页数据
      findPage: function (data) {
        if (data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.params = [{ name: 'name', value: this.filters.name }]
        TYPE_PAGE(this.pageRequest).then((res) => {
          this.pageResult = res
        }).then(data != null ? data.callback : '')
      },
      // 批量删除
      handleDelete: function (data) {
        TYPE_DELETE(data.params).then(data != null ? data.callback : '')
      },
      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true
        this.operation = true
        this.dataForm = {
          id: "",
          name: '',
          description: '',
          sort: "",
          icon: '',
          available: ""
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
              TYPE_SAVE(params).then((res) => {
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
          { prop: "name", label: "分类名称", minWidth: 120 },
          { prop: "description", label: "类型描述", minWidth: 120 },
          { prop: "sort", label: "排序", minWidth: 120 },
          { prop: "icon", label: "图标", minWidth: 100 },
          { prop: "createTime", label: "添加时间", minWidth: 120, formatter: this.dateFormat },
          { prop: "updateTime", label: "更新时间", minWidth: 120, formatter: this.dateFormat }
        ]
        this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      }
    },
    mounted () {
      this.initColumns()
    }
  }
</script>
