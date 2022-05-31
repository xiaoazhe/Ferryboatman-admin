<template>
  <div :class="[type === 'horizantal' ? 'vm-card-horizantal' : 'vm-card-vertical' , 'vm-panel']">
    <div class="card-img">
      <img :src="avatar" alt="">
      <div v-if="editable && type == 'vertical'" class="control">
        <span class="edit">
          <a :href="editUrl">
            <i class="fa fa-pencil" @click="modalEdit=true"></i>
          </a>
        </span>
        <span class="delete">
          <i class="fa fa-trash" @click="modalDelete=true"></i>
        </span>
      </div>
    </div>
    <div class="card-desc panel-body">
      <h2>{{ name }}</h2>
      <p>{{ nickName }}</p>
      <p>{{ roleNames }}</p>
<!--      <a :href="detailUrl">-->
<!--        more >-->
<!--      </a>-->
    </div>
    <Modal
        v-model="modalDelete"
        title="Delete"
        ok-text="OK"
        cancel-text="Cancel"
        v-on:on-ok="deleteOk">
        确定要删除头像吗？如果已经绑定人脸登陆，人脸识别登陆将失效～
    </Modal>
    <Modal
      v-model="modalEdit"
      title="Edit"
      cancel-text="Cancel">
      请前往用户管理处上传～
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'VmCard',
    props: {
      // tableData: Array,
      type: {
        type: String,
        default: 'vertical'
      },
      editable: {
        type: Boolean,
        default: false
      },
      avatar: {
        type: String,
        avatar: ""
      },
      name: {
        type: String,
        default: "name"
      },
      img: {
        type: String,
        default: require('@/assets/img/img-1.jpg')
      },
      nickName: {
        type: String,
        default: "nickName"
      },
      roleNames: {
        type: String,
        default: "roleNames"
      },
      detailUrl: {
        type: String,
        default: '#'
      },
      editUrl: {
        type: String,
        default: '#'
      }
    },
    data: function () {
      return {
        modalDelete: false,
        modalEdit: false
      }
    },
    methods: {
      deleteOk: function () {
        this.$emit('delete-ok')
      }
    }
  }
</script>
<style lang="less">
/*@import './../../theme/components.less';*/

.vm-card-horizantal{
  overflow: hidden;
  position: relative;
  display: flex;
  padding: 0;
  .card-img{
    display: flex;
    align-items: center;
    width: 50%;
    img{
      display: block;
      margin: 0;
      width: 20%;
    }
  }
  .card-desc{
    width: 50%;
    p{
      font-size: 14px;
      margin: 10px 0;
      text-align: justify;
    }
  }
}
.vm-card-horizantal{
  overflow: hidden;
  position: relative;
  display: flex;
  padding: 0;
  .card-img{
    display: flex;
    align-items: center;
    width: 50%;
    img{
      display: block;
      margin: 0;
      width: 100%;
    }
  }
  .card-desc{
    width: 50%;
    p{
      font-size: 14px;
      margin: 10px 0;
      text-align: justify;
    }
  }
}

.vm-card-vertical{
  .card-img{
    position: relative;
    img{
      display: block;
      width: 100%
    }
    .control{
      position: absolute;
      bottom: -20px;
      right: 15px;
      display: flex;
      span{
        display: flex;
        justify-content: center;
        margin-left: 10px;
        align-items: center;
        color: white;
        font-size: 18px;
        background-color: #41b883;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
      }
      span.edit{
        background-color: #1d8ce0;
        a{
          color: white;
        }
      }
      span.delete{
        background-color: #41b883;
      }
    }
  }
  .card-desc{
    p{
      font-size: 14px;
      margin: 10px 0;
      text-align: justify;
      height: 84px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.vm-panel{
  background-color: white;
  text-align: left;
  border-radius: 4px;
  .panel-heading{
    text-align: left;
    width: 100%;
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid #eeeff1;
    padding:15px;
    font-weight: bold;
  }
  .panel-body{
    padding: 15px;
    font-size: 14px;
  }
}
</style>
