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
