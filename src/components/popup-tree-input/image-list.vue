<template>
  <div class="vm-image-list">
    <Row class="image-list-heading vm-panel">
      <Row type="flex" align="middle" justify="space-between" class="panel-body">
       <div class="search-bar">
          <Input placeholder="Please enter ..." v-model="keyword" style="width: 300px"/>
          <Button type="ghost" @click="search"><i class="fa fa-search"></i>搜索</Button>
        </div>
        <Row type="flex" align="middle" class="page">
          <span>Show</span>
          <Input :max="40" :min="1" :number="true" v-model="showNum" class="input-number" @on-change=" updateDataShow "/>
          <span class="margin-end">/ Page</span>
          <span class="total">Total {{ data.length }}</span>
          <Page :total="data.length" :current="currentPage" :page-size="showNum" @on-change="pageChange"></Page>
        </Row>
      </Row>
    </Row>
    <Row class="image-list" :gutter="16">
      <Col :lg="6" :sm="12" class="vm-margin" v-for="item in dataShow" :key="item.id">
        <VmCard :editable="true" :name="item.name" :img="item.img" :nickName="item.nickName"
                :roleNames="item.roleNames" :detailUrl="item.detailUrl" :editUrl="item.editUrl"
                :avatar="item.avatar"
                @delete-ok=" deleteOk(item) ">
        </VmCard>
      </Col>
    </Row>
  </div>
</template>

<script>
  import VmCard from './image-card'
  import {
    DELETE_FACE
  } from "@/api/modules/user.js";
  export default {
    name: 'VmImageList',
    components: {
      VmCard
    },
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    data: function () {
      return {
        keyword: '', // keyword for search
        dataShow: [], // data for showing
        showNum: 8, // number of item per page
        currentPage: 1
      }
    },
    methods: {
      updateDataShow: function () {
        let startPage = (this.currentPage - 1) * this.showNum
        let endPage = startPage + this.showNum
        this.dataShow = this.data.slice(startPage, endPage)
      },
      pageChange: function (page) {
        this.currentPage = page
        this.updateDataShow()
      },
      search: function () {
        let that = this
        let tempData = that.data
        that.dataShow = []
        tempData.forEach(function (elem) {
          if (elem.name.toString().indexOf(that.keyword) > -1) {
            that.dataShow.push(elem)
            return
          }
        })
      },
      deleteOk: function (data) {
        DELETE_FACE(data.id).then((response) => {
          if(response.code == "200") {
            this.$emit("cropperSuccess", response.msg)
            location. reload()
          } else {
            this.$message({
              type: "error",
              message: response.msg
            })
          }
          })
      }
    },
    watch: {
      data: function () {
        this.dataShow = this.data.slice(0, this.showNum) // update dataShow once data changed
      }
    },
    mounted: function () {
      // this.dataShow = this.data.slice(0, this.showNum)
    }
  }
</script>
<style lang="less">
@import './../../theme/components.less';
</style>
