<template>
  <el-dropdown size="small" class="d2-mr">
    <span class="btn-text">{{info.name ? `你好 ${info.name}` : '未登录'}}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="logOff">
        <d2-icon name="power-off" class="d2-mr-5"/>
        注销
      </el-dropdown-item>
      <el-dropdown-item @click.native="clearCache">
        <d2-icon name="power-off" class="fa fa-undo"/>
        清除缓存
      </el-dropdown-item>
      <el-dropdown-item @click.native="showBackupDialog">
        <d2-icon name="power-off" class="fa fa-undo"/>
        备份还原
      </el-dropdown-item>
    </el-dropdown-menu>
    <!--备份还原界面-->
    <el-dialog :title="$t('common.backupRestore')" width="40%" :visible.sync="backupVisible" :close-on-click-modal="false" :modal=false>
      <el-table :data="tableData" style="width: 100%;font-size:16px;" height="330px" :show-header="showHeader"
                size="mini" v-loading="tableLoading" :element-tableLoading-text="$t('action.loading')">
        <el-table-column prop="title" :label="$t('common.versionName')" header-align="center" align="center">
        </el-table-column>
        <el-table-column fixed="right" :label="$t('action.operation')" width="180">
          <template slot-scope="scope">
            <el-button @click="handleRestore(scope.row)" type="primary" size="mini">{{$t('common.restore')}}</el-button>
            <el-button @click="handleDelete(scope.row)" type="danger" :disabled="scope.row.name=='backup'?true:false" size="mini">{{$t('action.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
            <el-button size="small"  @click="backupVisible = false">{{$t('action.cancel')}}</el-button>
            <el-button size="small"  type="primary" @click="handleBackup">{{$t('common.backup')}}</el-button>
        </span>
    </el-dialog>
  </el-dropdown>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios';
import { BACKUP_FIND, BACKUP_RESTORE, BACKUP_DELETE, BACK_UP } from '../../../../api/modules/backup.js';

export default {
  data() {
    return {
      tableData: [],   // 备份记录
      showHeader: false,
      backupVisible: false,
      tableLoading: false,
      baseUrl: "http://localhost:8001"
    }
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },

  mounted() {
    this.findRecords()
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    },
    // 清除缓存并退出登录
    clearCache() {
      this.$confirm("确认清除缓存并退出登录吗?", "提示", {
        type: "warning"
      }).then(() => {
          this.deleteCookie('token')// 清空Cookie里的token
          this.logoutApi()
        })
        .catch(() => {})
    },
    logoutApi() {
      sessionStorage.removeItem("user")
      this.logOff()
    },
    // 清除Cookie
    deleteCookie(name){
      var myDate = new Date()
      myDate.setTime(-1000) // 设置过期时间
      document.cookie = name+"=''; expires="+myDate.toGMTString();
    },
    // 打开备份还原界面
    showBackupDialog: function() {
      this.backupVisible = true
    },
    // 查询备份记录
    findRecords: function () {
      this.tableLoading = true
      BACKUP_FIND().then((res) => {
        if(res) {
          this.tableData = res
        }
        this.tableLoading = false
      })
    },
    // 数据备份
    handleBackup: function () {
      this.tableLoading = true
      BACK_UP().then((res) => {
        if(res) {
          this.$message({ message: '操作成功', type: 'success' })
        }
        this.tableLoading = false
        this.findRecords()
      })
    },
    // 数据还原
    handleRestore: function (data) {
      this.tableLoading = true
      BACKUP_RESTORE().then((res) => {
        if(res) {
          this.$message({ message: '操作成功', type: 'success' })
          this.$emit('afterRestore', {})
        }
        this.tableLoading = false
      })
    },
    // 删除备份
    handleDelete: function (data) {
      this.tableLoading = true
      BACKUP_DELETE({name : data.name }).then((res) => {
        if(res) {
          this.$message({ message: '操作成功', type: 'success' })
        }
        this.findRecords()
        this.tableLoading = false
      })
    }
  }
}
</script>
