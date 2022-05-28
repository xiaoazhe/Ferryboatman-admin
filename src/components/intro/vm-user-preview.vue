<template>
  <Row class="vm-user-preview vm-panel">
    <div class="panel-heading">
      <img :src="user.avatar" height="90" alt="photo">
      <span class="title">
        <span class="name">{{ user.name }}</span>
        <p class="role">{{ user.nickName }}</p>
      </span>
    </div>
    <ul class="content">
      <li>
        <span>
          <i class="fa fa-user"></i>
        </span>
        <span>
          组织
        </span>
        <span>
          {{ user.deptName }}
        </span>
      </li>
      <li>
        <span>
          <i class="fa fa-heart"></i>
        </span>
        <span>
         邮箱
        </span>
        <span>
          {{ user.email }}
        </span>
      </li>
      <li>
        <span>
          <i class="fa fa-calendar"></i>
        </span>
        <span>
         手机号
        </span>
        <span>
          {{ user.mobile }}
        </span>
      </li>
      <li>
        <span>
          <i class="fa fa-calendar"></i>
        </span>
        <span>
          更新时间
        </span>
        <span>
          {{ user.lastUpdateTime }}
        </span>
      </li>
    </ul>
  </Row>
</template>
<script>
  export default {
    name: 'VmUserPreview',
    props: {
      user: {
        type: Object,
        default: function () {
          return {
            avatar: "",
            name: "",
            nickName: ""
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>

  .vm-user-preview{
    overflow: hidden;
    .panel-heading{
      display: flex;
      img{
        margin-right: 15px;
      }
      .title{
        display: flex;
        flex-direction: column;
        justify-content: center;
        .name{
          color: #41b883;
          font-size: 18px;
        }
        .role{
          color: #99a9c0;
        }
      }
    }
    ul.content{
      font-size: 12px;
      li{
        display: flex;
        border-bottom: 1px solid #eeeff1;
        i{
          color: #99a9c0;
          font-size: 16px;
          width: 10px;
        }
        padding: 0 15px;
        height: 45px;
        line-height: 45px;
        span{
          flex-grow: 1;
        }
        span:first-child{
          width: 20%;
        }
        span:nth-child(2){
          width: 40%;
        }
        span:last-child{
          text-align: right;
          width: 40%;
        }
      }
      li:last-child{
        border-bottom: 1px solid transparent;
      }
    }
  }
</style>
