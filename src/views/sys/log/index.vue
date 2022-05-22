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
            perms="sys:log:view"
            type="primary"
            @click="findPage(null)"
          />
        </el-form-item>
      </el-form>
    </div>
    <!--表格内容栏-->
    <fm-table
      :data="pageResult"
      :columns="columns"
      :showOperation="showOperation"
      @findPage="findPage"
    >
    </fm-table>
  </div>
</template>

<script>
  import FmTable from "@/views/core/FMTable"
  import FmButton from "@/views/core/FMButton"
  import { format } from "@/libs/datetime"
  import { LOG_DELETE, LOG_PAGE } from '@/api/modules/log.js';
  export default {
    components: {
      FmTable,
      FmButton
    },
    data () {
      return {
        size: 'small',
        filters: {
          name: ''
        },
        columns: [
          { prop: "id", label: "ID", minWidth: 60 },
          { prop: "userName", label: "用户名", minWidth: 100 },
          // {prop:"operation", label:"操作", minWidth:120},
          { prop: "method", label: "方法", minWidth: 180 },
          { prop: "params", label: "参数", minWidth: 220 },
          { prop: "ip", label: "IP", minWidth: 120 },
          { prop: "time", label: "耗时", minWidth: 80 },
          { prop: "createBy", label: "创建人", minWidth: 100 },
          { prop: "createTime", label: "创建时间", minWidth: 120, formatter: this.dateFormat }
          // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
          // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
        ],
        pageRequest: { pageNum: 1, pageSize: 10 },
        pageResult: {},
        showOperation: false
      }
    },
    methods: {
      // 获取分页数据
      findPage: function (data) {
        if (data !== null) {
          this.pageRequest = data.pageRequest
        }
        this.pageRequest.params = [{ name: 'userName', value: this.filters.name }]
        LOG_PAGE(this.pageRequest).then((res) => {
          this.pageResult = res
        }).then(data != null ? data.callback : '')
      },
      // 时间格式化
      dateFormat: function (row, column, cellValue, index) {
        return format(row[column.property])
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>
</style>
