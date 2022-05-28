<template>
  <Row class="vm-panel vm-timeline">
    <Row type="flex" justify="center" class="panel-heading">
     {{ title }}
    </Row>
    <ul class="panel-body">
      <li v-for="(item, index) in data" :key="item.id">
        <Row v-if="index%2 == 0" type="flex" justify="space-around">
          <div class="left">
            <div class="panel-body">
              <h4>{{ item.createTime }}</h4>
            </div>
          </div>
          <div class="split">
            <span class="dot-left"></span>
          </div>
          <div class="right">
            <div class="content panel-body">
              <h3>{{ item.typeName }}</h3>
              <p>{{ item.title }}</p>
            </div>
          </div>
        </Row>

        <Row v-else type="flex" justify="space-around">
          <div class="left">
            <div class="content panel-body">
              <h3>{{ item.createTime }}</h3>
              <p>{{ item.typeName }}</p>
            </div>
          </div>
          <div class="split">
            <span class="dot-right"></span>
          </div>
          <div class="right">
            <div class="panel-body">
              <h4>{{ item.title }}</h4>
            </div>
          </div>
        </Row>
      </li>
    </ul>
  </Row>
</template>

<script>
  export default {
    name: 'VmTimeline',
    props: {
      title: {
        type: String,
        default: '时间轴'
      },
      data: {
        type: Array,
        default: function () {
          return [
            {
              createTime: '',
              typeName: '',
              title: ''
            }
          ]
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .vm-timeline {
    font-size: 14px;

    .panel-heading {
      color: #41b883;
      font-size: 16px;
    }

    ul.panel-body {
      li {
        .left, .right {
          flex-grow: 1;
          width: calc(50% - 1px);
          padding-bottom: 15px;
        }

        .left {
          text-align: right;
          padding-right: 30px;
        }

        .right {
          text-align: left;
          padding-left: 30px;
        }

        .content {
          background-color: #f4f4f4;
          border-radius: 4px;
        }

        .split {
          width: 2px;
          background-color: #dddee1;
          height: inherit;

          .dot-left, .dot-right {
            display: inline-block;
            position: relative;
            width: 12px;
            height: 12px;
            color: #41b883;
            background-color: #41b883;
            border-radius: 50%;
            margin: 20px 0 0 -5px;
          }

          .dot-left:before, .dot-right:before {
            content: '';
            border: 6px solid transparent;
            position: absolute;
          }

          .dot-left:before {
            border-left-color: inherit;
            left: 8px;
          }

          .dot-right:before {
            border-right-color: inherit;
            right: 8px;
          }
        }

      }
    }
  }
</style>
