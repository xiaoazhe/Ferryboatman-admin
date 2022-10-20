<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.label" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <fm-button icon="fa fa-search" :label="$t('action.search')" perms="sys:dict:view" type="primary" @click="findPage(null)"/>
        </el-form-item>
        <el-form-item>
          <fm-button icon="fa fa-plus" :label="$t('action.addNavType')" perms="sys:dict:add" type="primary" @click="handleAdd" />
        </el-form-item>
        <el-form-item>
          <fm-button icon="fa fa-plus" :label="$t('action.addNavInfo')" perms="sys:dict:add" type="primary" @click="handleAddNavInfo" />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
<!--    <fm-table permsEdit="sys:dict:edit" permsDelete="sys:dict:delete"-->
<!--              :data="pageResult" :columns="columns"-->
<!--              @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete">-->
<!--    </fm-table>-->


    <el-table :data="pageResult.content" stripe size="mini" style="width: 100%;" rowKey="id" element-loading-text="$t('action.loading')">
      <el-table-column
        prop="id" header-align="center" align="center" width="80" label="ID">
      </el-table-column>
      <el-table-column
        prop="navTypeName" header-align="center" align="center" treeKey="id" width="150" label="名称">
      </el-table-column>
      <el-table-column
        prop="createTime" header-align="center" align="center" width="120" label="创建时间">
      </el-table-column>
      <el-table-column
        header-align="center" align="center" width="485" :label="$t('action.operation')">
        <template slot-scope="scope">
          <fm-button icon="fa fa-view" :label="$t('action.view')" perms="sys:menu:edit" @click="handleView(scope)"/>
          <fm-button icon="fa fa-edit" :label="$t('action.edit')" perms="sys:menu:edit" @click="handleEdit(scope)"/>
          <fm-button icon="fa fa-trash" :label="$t('action.delete')" perms="sys:menu:delete" type="danger" @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="toolbar" style="padding: 10px">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        @current-change="findPage"
        :current-page="pageRequest.pageNum"
        :page-size="pageRequest.pageSize"
        :total="pageResult.totalSize"
        style="float: right"
      >
      </el-pagination>
    </div>

    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="editDialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input v-model="dataForm.navTypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父分类" prop="typeName">
          <el-select
            v-model="dataForm.navParentTypeId"
            size="small"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in typeList"
              v-if="item.navParentTypeId === null"
              :key="item.id"
              :label="item.navTypeName"
              :value="item.id"
            >{{ item.navTypeName }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="value">
          <el-input v-model="dataForm.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <!-- <el-popover
                ref="iconListPopover"
                placement="bottom-start"
                trigger="click"
                popper-class="mod-menu__icon-popover">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in dataForm.iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </el-popover> -->
              <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="false" placeholder="菜单图标名称（如：fa fa-home fa-lg）" class="icon-list__input"></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
              <fa-icon-tooltip />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>



<!--    导航管理-->
    <el-drawer
      title="标题"
      :visible.sync="drawer"
      :before-close="handleClose" size="80%">

      <el-table :data="navPageResult.content" stripe size="mini" style="width: 100%;" rowKey="id" element-loading-text="$t('action.loading')">
        <el-table-column
          prop="id" header-align="center" align="center" width="80" label="ID">
        </el-table-column>
        <el-table-column
          prop="navName" header-align="center" align="center" treeKey="id" width="150" label="名称">
        </el-table-column>
        <el-table-column
          prop="navDesc" header-align="center" align="center" treeKey="id" width="150" label="描述">
        </el-table-column>
        <el-table-column
          prop="navUrl" header-align="center" align="center" treeKey="id" width="150" label="跳转url">
        </el-table-column>
        <el-table-column
          header-align="center" align="center" treeKey="id" width="150" label="logo链接">
          <template slot-scope="scope">
            <el-image
              style="width: 100%; height: 100px"
              :src="scope.row.navLogo"
              :preview-src-list="[scope.row.navLogo]"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime" header-align="center" align="center" width="120" label="创建时间">
        </el-table-column>
        <el-table-column
          prop="updateTime" header-align="center" align="center" width="120" label="修改时间">
        </el-table-column>
        <el-table-column
          fixed="right" header-align="center" align="center" width="185" :label="$t('action.operation')">
          <template slot-scope="scope">
            <fm-button icon="fa fa-edit" :label="$t('action.edit')" perms="sys:menu:edit" @click="handleEditNavInfo(scope)"/>
            <fm-button icon="fa fa-trash" :label="$t('action.delete')" perms="sys:menu:delete" type="danger" @click="handleDeleteNavInfo(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="toolbar" style="padding: 10px">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          @current-change="findNavPage"
          :current-page="navPageRequest.pageNum"
          :page-size="navPageRequest.pageSize"
          :total="navPageResult.totalSize"
          style="float: right"
        >
        </el-pagination>
      </div>

    </el-drawer>

    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="navInfoEditDialogVisible" :close-on-click-modal="false">
      <el-form :model="navInfoDataForm" label-width="80px" ref="navInfoDataForm" :size="size">
        <el-form-item label="ID" prop="id"  v-if="false">
          <el-input v-model="navInfoDataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="分类" prop="typeName">
          <el-select
            v-model="navInfoDataForm.navTypeId"
            size="small"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.navTypeName"
              :value="item.id"
            >{{ item.navTypeName }}</el-option
            >
          </el-select>
        </el-form-item>

<!--        <el-form-item label="标签id" prop="label">-->
<!--          <el-input v-model="navInfoDataForm.navTypeId" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="导航名称" prop="value">
          <el-input v-model="navInfoDataForm.navName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="导航描述" prop="value">
          <el-input v-model="navInfoDataForm.navDesc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="value">
          <el-input v-model="navInfoDataForm.navUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="logoUrl" prop="value">
          <el-input v-model="navInfoDataForm.navLogo" auto-complete="off"></el-input>
        </el-form-item>
<!--        <el-form-item label="logo" prop="value">-->
<!--          <el-input v-model="navInfoDataForm.navLogo" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="上传logo">
          <el-upload
            class="upload-cover"
            drag
            action="http://121.5.129.126:8001/file/images"
            multipartFile
            :on-success="uploadCover"
          >
            <i class="el-icon-upload" v-if="navInfoDataForm.navLogo == ''" />
            <div class="el-upload__text" v-if="navInfoDataForm.navLogo == ''">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <img v-else :src="navInfoDataForm.navLogo" width="360px" height="180px" />
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitFormNavInfo" :loading="editLoading">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FmTable from "@/views/core/FMTable"
import FmButton from "@/views/core/FMButton"
import { format } from "@/libs/datetime"
import TableTreeColumn from "@/views/core/TableTreeColumn";
import FaIconTooltip from "@/components/fa-icon-tool-tip";
import { NAV_TYPE_PAGE, NAV_TYPE_FIND_BY_ID, NAV_TYPE_DELETE_BY_ID, NAV_TYPE_SAVE, NAV_TYPE_UPDATE, NAV_TYPE_LIST
  , NAV_INFO_PAGE, NAV_INFO_SAVE, NAV_INFO_UPDATE, NAV_INFO_DELETE_BY_ID} from '@/api/modules/nav.js'
export default {
  components: {
    FmTable,
    TableTreeColumn,
    FmButton,
    FaIconTooltip
  },
  data () {
    return {
      size: 'small',
      filters: {
        label: ''
      },
      drawer: false, //右侧栏
      columns: [
        { prop: "id", label: "ID", minWidth: 50 },
        { prop: "navTypeName", label: "标签名称", minWidth: 100 },
        { prop: "createTime", label: "创建时间", minWidth: 120, formatter: this.dateFormat }
      ],
      pageRequest: { pageNum: 1, pageSize: 10 },
      navPageRequest: {
        pageNum: 1,
        pageSize: 10,
      },
      pageResult: {},
      navPageResult: {
        content: [],
        pageNum: "",
        pageSize: "",
        totalPages: "",
        totalSize: 0,
      },

      operation: false, // true:新增, false:编辑
      editDialogVisible: false, // 新增编辑界面是否显示
      navInfoEditDialogVisible: false,
      editLoading: false,
      dataFormRules: {
        navTypeName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        navTypeName: '',
        navParentTypeId: ''
      },
      // 新增编辑界面数据
      navInfoDataForm: {
        id: 0,
        navTypeId: '',
        navName: '',
        navDesc: '',
        navUrl: '',
        navLogo: ''
      },
      typeList: []
    }
  },
  mounted() {
    this.findPage()
  },
  methods: {
    // 获取分页数据
    findPage: function (pageNum) {
      if (pageNum !== null) {
        this.pageRequest.pageNum = pageNum
      }
      NAV_TYPE_PAGE(this.pageRequest).then((res) => {
        this.pageResult = res
        this.pageRequest.pageNum = res.pageNum;
        this.pageRequest.pageSize = res.pageSize;
      })
    },

    findNavPage: function (pageNum) {
      if (pageNum !== null) {
        this.navPageRequest.pageNum = pageNum
      }
      if (this.dataForm) {
        this.navPageRequest.filterId = this.dataForm.id
      }
      NAV_INFO_PAGE(this.navPageRequest).then((res) => {
        this.navPageResult = res
        this.navPageRequest.pageNum = res.pageNum;
        this.navPageRequest.pageSize = res.pageSize;
      })
    },
    // 删除
    handleDelete: function (data) {
      NAV_TYPE_DELETE_BY_ID(data.id).then(data != null ? this.$message({ message: '操作成功', type: 'success' }) : '')
      this.findPage(null)
    },
    // 删除
    handleDeleteNavInfo: function (data) {
      NAV_INFO_DELETE_BY_ID(data.id).then(data != null ? this.$message({ message: '操作成功', type: 'success' }) : '')
      this.findNavPage(null)
    },
    // 显示新增界面
    handleAdd: function () {
      this.editDialogVisible = true
      this.operation = true
      this.dataForm = {
        navTypeName: '',
        navParentTypeId: ''
      }
      this.queryTypeList()
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.editDialogVisible = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
      this.queryTypeList()
    },

    // 显示编辑界面
    handleEditNavInfo: function (params) {
      this.navInfoEditDialogVisible = true
      this.operation = false
      this.navInfoDataForm = Object.assign({}, params.row)
      this.queryTypeList()
    },
    // 显示新增界面
    handleAddNavInfo: function () {
      this.navInfoEditDialogVisible = true
      this.operation = true
      this.navInfoDataForm = {
        navTypeId: '',
        navName: '',
        navDesc: '',
        navUrl: '',
        navLogo: ''
      }
      this.queryTypeList()
    },

    // 显示导航页
    handleView: function (params) {
      this.drawer = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
      this.findNavPage();
    },

    queryTypeList: function () {
      NAV_TYPE_LIST().then((res) => {
        this.typeList = res
      })
    },

    // 右侧栏
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    uploadCover(response) {
      this.navInfoDataForm.navLogo = response.data;
    },
    // 编辑
    submitForm: function () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let params = Object.assign({}, this.dataForm)
            if (params.id) {
              NAV_TYPE_UPDATE(params).then((res) => {
                if (res) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
                }
                this.editLoading = false
                this.$refs['dataForm'].resetFields()
                this.editDialogVisible = false
                this.findPage(null)
              })
            } else {
              NAV_TYPE_SAVE(params).then((res) => {
                if (res) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
                }
                this.editLoading = false
                this.$refs['dataForm'].resetFields()
                this.editDialogVisible = false
                this.findPage(null)
              })
            }

          })
        }
      })
    },
    submitFormNavInfo: function () {
      this.$refs.navInfoDataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let params = Object.assign({}, this.navInfoDataForm)
            if (params.id) {
              NAV_INFO_UPDATE(params).then((res) => {
                if (res) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
                }
                this.editLoading = false
                this.$refs['navInfoDataForm'].resetFields()
                this.navInfoEditDialogVisible = false
                this.findNavPage()
              })
            } else {
              NAV_INFO_SAVE(params).then((res) => {
                if (res) {
                  this.$message({ message: '操作成功', type: 'success' })
                } else {
                  this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
                }
                this.editLoading = false
                this.$refs['navInfoDataForm'].resetFields()
                this.navInfoEditDialogVisible = false
                this.findPage()
              })
            }

          })
        }
      })
    },
    // 时间格式化
    dateFormat: function (row, column, cellValue, index) {
      return format(row[column.property])
    }
  },
}
</script>

<style scoped>
</style>
