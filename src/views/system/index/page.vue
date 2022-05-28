<template>
  <d2-container type="full" class="page">
    <d2-grid-layout
      v-bind="layout"
      @layout-updated="layoutUpdatedHandler">
      <d2-grid-item
        v-for="(item, index) in layout.layout"
        :key="index"
        v-bind="item"
        @resize="resizeHandler"
        @move="moveHandler"
        @resized="resizedHandler"
        @moved="movedHandler">
        <el-card shadow="never" class="page_card">
          <template v-if="item.i === '0'">
            <Col :lg="6" :md="12">
              <VmStateOverView color="#41b883" icon="fa fa-user" title="博客点击" :count="overview.blogClick"></VmStateOverView>
            </Col>
          </template>
          <template v-if="item.i === '1'">
            <Col :lg="6" :md="12">
              <VmStateOverView color="#1d8ce0" icon="fa fa-eye" title="博客收藏" :count="overview.blogCollect"></VmStateOverView>
            </Col>
          </template>
          <template v-if="item.i === '2'">
            <Col :lg="6" :md="12">
              <VmStateOverView color="#ffa000" icon="fa fa-pencil" title="博客数量" :count="overview.blogSize"></VmStateOverView>
            </Col>
          </template>
          <template v-if="item.i === '3'">
            <Col :lg="6" :md="12">
              <VmStateOverView color="#f60000" icon="fa fa-download" title="上传资料" :count="overview.material"></VmStateOverView>
            </Col>
          </template>
          <template v-if="item.i === '4'">
            <Row :gutter="16">
              <Col :lg="6">
                <VmUserPreview :user="overview.user"></VmUserPreview>
              </Col>
<!--              <Col :lg="18">-->
<!--                <VmProgress title="Working Progress" :data="dataProgress"></VmProgress>-->
<!--              </Col>-->
            </Row>
          </template>
          <template v-if="item.i === '5'">
            <Col :lg="16">
              <VmTimeline title="Timeline" :data="overview.blogList" style="height: 20%">
              </VmTimeline>
            </Col>
          </template>
          <template v-if="item.i === '6'">
            <div class="d2-mb">拖拽卡片调整位置</div>
            <div class="d2-mb">拖拽卡片右下角的手柄调整卡片大小</div>
            <div class="d2-mb">在控制台打印出数据变化</div>
          </template>
          <template v-if="item.i === '7'">
            <div class="d2-mb">拖拽卡片调整位置</div>
            <div class="d2-mb">拖拽卡片右下角的手柄调整卡片大小</div>
            <div class="d2-mb">在控制台打印出数据变化</div>
          </template>
        </el-card>
      </d2-grid-item>
    </d2-grid-layout>
  </d2-container>
</template>

<script>
  import Vue from 'vue'
  import VmStateOverView from './../../../components/intro/vm-state-overview.vue'
  import { GridLayout, GridItem } from 'vue-grid-layout'
  import { USER_FIND_INTRO } from '@/api/modules/user.js'
  import VmUserPreview from "../../../components/intro/vm-user-preview";
  import VmProgress from "../../../components/intro/vm-progress";
  import VmTimeline from "../../../components/intro/vm-timeline";
  import VmTabs from "../../../components/intro/vm-tabs";
  import VmTabsItem from "../../../components/intro/vm-tabs-item";
  import VmWeather from "../../../components/intro/vm-weather";
  Vue.component('d2-grid-layout', GridLayout)
  Vue.component('d2-grid-item', GridItem)
  export default {
    components: {
      VmStateOverView,
      VmUserPreview,
      VmProgress,
      VmTimeline,
      VmTabs,
      VmTabsItem,
      VmWeather
    },
    data () {
      return {
        layout: {
          layout: [
            { x: 0, y: 0, w: 3, h: 4, i: '0' },
            { x: 3, y: 0, w: 3, h: 4, i: '1' },
            { x: 6, y: 0, w: 3, h: 4, i: '2' },
            { x: 9, y: 0, w: 3, h: 4, i: '3' },
            { x: 0, y: 5, w: 4, h: 10, i: '5' },
            { x: 4, y: 5, w: 8, h: 10, i: '4' },

            // { x: 0, y: 10, w: 8, h: 5, i: '6' },
            // { x: 8, y: 10, w: 4, h: 5, i: '7' }
          ],
          colNum: 12,
          rowHeight: 30,
          isDraggable: true,
          isResizable: true,
          isMirrored: false,
          verticalCompact: true,
          margin: [10, 10],
          useCssTransforms: true
        },
        overview:{
          blogClick: "",
          blogCollect: "",
          blogList: [],
          blogSize: "",
          material: "",
          user:{
            avatar: "",
            name: "",
            nickName: ""
          }
        },
        dataProgress: [
          {
            name: 'Jesse Luo',
            tags: ['cool', 'funy'],
            value: 90
          },
          {
            name: 'Angla Cool',
            tags: ['nice', 'sexy', 'literature'],
            value: 30
          },
          {
            name: 'lele Wang',
            tags: ['mould', 'shy'],
            value: 80
          },
          {
            name: 'Jesse Ca',
            tags: ['funny', 'hardworking', 'learnd'],
            value: 20
          },
          {
            name: 'Jesse Lee',
            tags: ['nice', 'mould'],
            value: 100
          }
        ],
      }
    },
    mounted () {
      // 加载完成后显示提示
      this.showInfo()
      this.findIntro()
    },
    methods: {
      findIntro() {
        USER_FIND_INTRO().then((res) => {
          if (res) {
            this.overview = res
            for(let lay = 0; lay <this.layout.layout.length; lay++) {
              if (this.layout.layout[lay].i === '5') {
                this.layout.layout[lay].h = this.overview.blogList.length * 2
              }
            }
          }
        })
      },
      // log (arg1 = 'log', ...logs) {
      //   if (logs.length === 0) {
      //     console.log(arg1)
      //   } else {
      //     console.group(arg1)
      //     logs.forEach(e => {
      //       console.log(e)
      //     })
      //     console.groupEnd()
      //   }
      // },
      // 显示提示
      showInfo () {
        this.$notify({
          title: '提示',
          message: '你可以按住卡片拖拽改变位置；或者在每个卡片的右下角拖动，调整卡片大小'
        })
      },
      // 测试代码
      layoutUpdatedHandler (newLayout) {
        console.group('layoutUpdatedHandler')
        newLayout.forEach(e => {
          console.log(`{'x': ${e.x}, 'y': ${e.y}, 'w': ${e.w}, 'h': ${e.h}, 'i': '${e.i}'},`)
        })
        console.groupEnd()
      },
      resizeHandler (i, newH, newW) {
        this.log('resizeHandler', `i: ${i}, newH: ${newH}, newW: ${newW}`)
      },
      moveHandler (i, newX, newY) {
        this.log('moveHandler', `i: ${i}, newX: ${newX}, newY: ${newY}`)
      },
      resizedHandler (i, newH, newW, newHPx, newWPx) {
        this.log('resizedHandler', `i: ${i}, newH: ${newH}, newW: ${newW}, newHPx: ${newHPx}, newWPx: ${newWPx}`)
      },
      movedHandler (i, newX, newY) {
        this.log('movedHandler', `i: ${i}, newX: ${newX}, newY: ${newY}`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page {
    .vue-grid-layout {
      background-color: $color-bg;
      border-radius: 4px;
      margin: -10px;
      .page_card {
        height: 100%;
        @extend %unable-select;
      }
      .vue-resizable-handle {
        opacity: .3;
        &:hover{
          opacity: 1;
        }
      }
    }
  }
</style>
