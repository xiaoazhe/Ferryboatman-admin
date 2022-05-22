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
            perms="sys:friend:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
        <el-form-item>
          <fm-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            perms="sys:blog:add"
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
      permsEdit="sys:friend:edit"
      permsDelete="sys:friend:delete"
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

        <el-form-item label="友情链接标题" prop="title">
          <el-input v-model="dataForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="友情链接介绍" prop="summary">
          <el-input
            type="textarea"
            v-model="dataForm.summary"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="友情链接URL" prop="url">
          <el-input
            type="textarea"
            v-model="dataForm.url"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="站长邮箱" prop="email">
          <el-input
            type="textarea"
            v-model="dataForm.email"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            type="textarea"
            v-model="dataForm.sort"
            auto-complete="off"
          ></el-input>
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
  import FmButton from "@/views/core/FMButton";
  import TableColumnFilterDialog from "@/views/core/TableColumnFilterDialog"
  import { format } from "@/libs/datetime"
  import {
    FRIEND_SAVE,
    FRIEND_PAGE,
    FRIEND_BATCH_DELETE
  } from "@/api/modules/friend.js";
  export default {
    components: {
      PopupTreeInput,
      FmButton,
      FmTable,
      TableColumnFilterDialog
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
          adminUid: null,
          clickCount: null,
          createBy: null,
          createTime: null,
          email: null,
          fileUid: null,
          lastUpdateBy: null,
          linkStatus: null,
          sort: null,
          status: null,
          summary: null,
          title: null,
          uid: null,
          updateTime: null,
          url: null,
          userUid: null
        },

        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入摘要', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 获取分页数据
      findPage: function (data) {
        if (data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.params = [{ name: 'name', value: this.filters.name }]
        FRIEND_PAGE(this.pageRequest).then((res) => {
          this.pageResult = res
        }).then(data != null ? data.callback : '')
      },
      // 批量删除
      handleDelete: function (data) {
        FRIEND_BATCH_DELETE(data.params).then(data != null ? data.callback : '')
      },

      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true
        this.operation = true
        this.dataForm = {
          uid: '',
          title: '',
          summary: '',
          content: ""
        }
      },
      // 显示编辑界面
      handleEdit: function (params) {
        this.dialogVisible = true
        this.operation = false
        this.dataForm = Object.assign({}, params.row)

      },
      // 编辑
      submitForm: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              FRIEND_SAVE(params).then((res) => {
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

      uploadCover (response) {
        this.dataForm.fileUid = response.data;
      },
      // 处理表格列过滤显示
      initColumns: function () {
        this.columns = [
          { prop: "uid", label: "ID", minWidth: 120 },
          { prop: "title", label: "标题", minWidth: 120 },
          { prop: "summary", label: "简介", minWidth: 120 },
          { prop: "url", label: "友情链接URL", minWidth: 100 },
          { prop: "clickCount", label: "点击数", minWidth: 120 },
          { prop: "sort", label: "排序", minWidth: 120 },
          { prop: "linkStatus", label: "友链状态", minWidth: 120 },
          { prop: "email", label: "邮箱", minWidth: 120 },
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
