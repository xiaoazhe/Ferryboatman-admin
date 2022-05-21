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
      <el-form-item>
        <el-button @click="handleAdd"
                   type="primary"
                   style="margin-left: 16px;">
          添加
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <el-table :data="dataForm.content" border style="width: 100%">
      <el-table-column prop="id" label="编号" />
      <el-table-column
        prop="labelname"
        label="名称"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column label="状态" prop="state" align="center" width="">
        <template slot-scope="scope">
          <el-switch
            class="tableScopeSwitch"
            active-value="1"
            inactive-value="0"
            @change="changeSwitch(scope.row)"
            active-text="启用"
            inactive-text="禁用"
            v-model="scope.row.state">
          </el-switch>

        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" sortable="custom" />

      <el-table-column
        prop="count"
        label="使用数量"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="fans"
        label="关注数"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column prop="recommend"
                       label="推荐"
                       sortable="custom">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isOriginal === 1">推荐</el-tag>
          <el-tag v-else
                  type="info">不推荐</el-tag>
        </template>
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
                <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
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
    <el-dialog :title="operation?'新增':'编辑'"
               width="90%"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false">
      <el-form :model="dataForm"
               label-width="80px"
               :rules="dataFormRules"
               ref="dataForm"
               :size="size"
               label-position="right">
        <el-form-item label="ID"
                      prop="id"
                      v-if="false">
          <el-input v-model="dataForm.uid"
                    :disabled="true"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称"
                      prop="labelname">
          <el-input v-model="dataForm.labelname"
                    auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button :size="size"
                   @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"
                   type="primary"
                   @click.native="submitForm"
                   :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import {
    LABEL_SAVE,
    LABEL_PAGE,
    LABEL_GET_BY_ID,
    LABEL_DELETE_BY_ID,
    LABEL_UPDATE_BY_ID
  } from "@/api/modules/blog.js";

  export default {
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
          totalSize: 0,
          delivery: 1
        },
        operation: false, // true:新增, false:编辑
        dialogVisible: false, // 新增编辑界面是否显示
        editLoading: false,
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
        LABEL_PAGE(this.page).then(res => {
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
      changeSwitch (data) {
        LABEL_UPDATE_BY_ID(data).then((res) => {
          this.getByPage(null)
        })
      },
      handleDelete (id) {
        // 删除
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          LABEL_DELETE_BY_ID(id).then(res => {
            this.$message.success("已删除！")
            this.getByPage()
          })
        })
      },
      // 显示新增界面
      handleAdd: function () {
        this.dialogVisible = true
        this.operation = true
        this.dataForm = {
          uid: 0,
          labelname: '',
          summary: '',
          content: ""
        }
      },
      // 修改
      handleEdit (id) {
        this.dialogVisible = true
        this.operation = false
        LABEL_GET_BY_ID(id).then((res) => {
          this.dataForm = res.data
        })
      },
      // 编辑
      submitForm: function () {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true
              let params = Object.assign({}, this.dataForm)
              LABEL_SAVE(params).then((res) => {
                this.editLoading = false
                if (res.code == 200) {
                  this.$message({ message: '操作成功', type: 'success' })
                  this.dialogVisible = false
                  this.$refs['dataForm'].resetFields()
                } else {
                  this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
                }
                this.getByPage(null)
              })
            })
          }
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
<style>
  .tableScopeSwitch .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
  }
  /*打开时文字位置设置*/
  .tableScopeSwitch .el-switch__label--right {
    z-index: 1;
    right: 6px;    /*不同场景下可能不同，自行调整*/
  }
  /*关闭时文字位置设置*/
  .tableScopeSwitch .el-switch__label--left {
    z-index: 1;
    left: 6px;    /*不同场景下可能不同，自行调整*/
  }
  /*显示文字*/
  .tableScopeSwitch .el-switch__label.is-active {
    display: block;
  }
  .tableScopeSwitch.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 75px !important;    /*开关按钮的宽度大小*/
  }
</style>
