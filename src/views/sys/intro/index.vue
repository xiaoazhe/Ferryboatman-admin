<template>
  <div style="width: 100%; height: 50%">
  <div class="dashboard">
    <Row :gutter="16">
      <Col :lg="6" :md="12">
        <VmStateOverView color="#41b883" icon="fa fa-user" title="博客点击" :count="overview.blogClick"></VmStateOverView>
      </Col>
      <Col :lg="6" :md="12">
        <VmStateOverView color="#1d8ce0" icon="fa fa-eye" title="博客收藏" :count="overview.blogCollect"></VmStateOverView>
      </Col>
      <Col :lg="6" :md="12">
        <VmStateOverView color="#ffa000" icon="fa fa-pencil" title="博客数量" :count="overview.blogSize"></VmStateOverView>
      </Col>
      <Col :lg="6" :md="12">
        <VmStateOverView color="#f60000" icon="fa fa-download" title="上传资料" :count="overview.material"></VmStateOverView>
      </Col>
    </Row>
    <el-row :gutter="20">
    </el-row>
    <el-divider />
    <Row :gutter="16">
      <Col :lg="6">
        <VmUserPreview :user="overview.user"></VmUserPreview>
      </Col>
      <Col :lg="18">
        <VmProgress title="Working Progress" :data="dataProgress"></VmProgress>
      </Col>
    </Row>
    <Row :gutter="16">
      <Col :lg="16">
        <VmTimeline title="Timeline" :data="overview.blogList">
        </VmTimeline>
      </Col>
      <Col :lg="8">
        <VmTabs icon="fa fa-user" title="Briefs" content-height="200px">
          <VmTabsItem label="Social" name="01">
            <div class="demo-news">
              <h2>" Lorem ipsum dolor sit amet, consectetur adipiscing. "</h2>
            </div>
          </VmTabsItem>
          <VmTabsItem label="Business" name="02">
            <div class="demo-news">
              <h2>" Phasellus massa urna, vehicula bibendum. "</h2>
            </div>
          </VmTabsItem>
          <VmTabsItem label="Entertainment" name="03">
            <div class="demo-news">
              <h2>" Duis vitae dictum erat. In ut lorem turpis. "</h2>
            </div>
          </VmTabsItem>
          <VmTabsItem label="Sport" name="04">
            <div class="demo-news">
              <h2>" Etiam sit amet urna feugiat, laoreet urna quis. "</h2>
            </div>
          </VmTabsItem>
          <VmTabsItem label="Health" name="05">
            <div class="demo-news">
              <h2>" Fusce nec eleifend ligula. "</h2>
            </div>
          </VmTabsItem>
          <VmTabsItem label="Education" name="06">
            <div class="demo-news">
              <h2>" Fusce commodo nunc justo, id mattis. "</h2>
            </div>
          </VmTabsItem>
        </VmTabs>
        <VmWeather class="vm-margin" :data="dataWeather">
        </VmWeather>
      </Col>
    </Row>
  </div></div>
</template>

<script>
  import VmStateOverView from './../../../components/intro/vm-state-overview.vue'
  import VmUserPreview from './../../../components/intro/vm-user-preview.vue'
  import VmProgress from './../../../components/intro/vm-progress.vue'
  import VmTimeline from './../../../components/intro/vm-timeline.vue'
  import VmTabs from './../../../components/intro/vm-tabs.vue'
  import VmTabsItem from './../../../components/intro/vm-tabs-item.vue'
  import VmWeather from './../../../components/intro/vm-weather.vue'
  import { USER_FIND_INTRO } from '@/api/modules/user.js'
  export default {
    name: 'Dashboard',
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
        dataWeather: {
          location: 'Beijing',
          weather: 'cloudy',
          temprature: '30°',
          humidity: '56%',
          percip: '1.50in',
          winds: '10mph'
        }
      }
    },
    mounted: function () {
      this.findIntro()
    },
    methods: {
      findIntro() {
        USER_FIND_INTRO().then((res) => {
          if (res) {
            this.overview = res
          }
        })
      }
    }
  }
</script>

<style lang="less">
  @import './../../../theme/components.less';
</style>
