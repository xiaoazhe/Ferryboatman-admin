<template>
  <VmImageList :data="dataList" @delete-ok="deletefn" class="vm-margin"></VmImageList>
</template>

<script>
  import VmImageList from "@/components/popup-tree-input/image-list";
  import {
    USER_FIND_PAGE
  } from "@/api/modules/user.js";
  export default {
    name: 'ImageList',
    components: {
      VmImageList
    },
    data () {
      return {
        size: 'small',
        filters: {
          name: ''
        },
        columns: [],
        filterColumns: [],
        pageRequest: {pageNum: 0, pageSize: 100, totalSize: ""},
        dataList: {},
      }
    },
    methods: {
      // 获取分页数据
      findPage: function (data) {
        if (data !== null) {
          this.pageRequest = this.pageRequest
        }
        // this.pageRequest.params = [{ name: 'name', value: this.filters.name }]
        USER_FIND_PAGE(this.pageRequest).then((res) => {
          this.dataList = res.content
          this.pageRequest.pageNum = res.pageNum
          this.pageRequest.pageSize = res.size
          this.pageRequest.totalSize = res.totalSize
        }).then(data != null ? data.callback : '')
      },
      deletefn: function (data) {
        for (let i = 0; i < this.dataList.length; i++) {
          if (this.dataList[i].id === data.id) {
            this.dataList.splice(i, 1)
          }
        }
      }
    },
    mounted () {
      this.findPage()
    }
  }
</script>

<style lang="less">
  /*@import './../../../theme/components.less';*/

</style>
