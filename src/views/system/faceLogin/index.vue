<template>
  <div class="login-container">
    <div class="login-form" v-show="canvasShow">
      <p class="titleInfo">人脸识别打开摄像头失败解决方案:https://blog.csdn.net/weixin_45931326/article/details/109626136</p>
      <p class="titleInfo">填充放行ip：http://121.5.129.126:8001</p>
      <div class="regInfo">
        <!-- <div class="tip">没有检测到脸</div> -->
        <div class="canvas">
          <!--video用于显示媒体设备的视频流，自动播放-->
          <video ref="vd" muted id="video" width="300px" height="300px" autoplay="autoplay"></video>
          <!--描绘video截图-->
          <canvas ref="cav" id="canvas" width="200" height="200"></canvas>
        </div>
      </div>
      <form id="myForm" action="/checkFace" method="post" ref="myForm" enctype="multipart/form-data">
      </form>
      <p style="text-align:center;padding:50px 0 0"><el-button id="capture" ref="capture" @click='handleClick'>拍 照</el-button> </p>
      <img :src='imgUrl' width="100" height="100">
    </div>
    <div v-show="tipShow" class="tipShow">
      <el-alert
        title="验证成功"
        type="success"
        center
        :closable="false"
        show-icon>
      </el-alert>
    </div>
    <div v-show="errorShow" class="tipShow">
      <el-alert
        title="验证失败"
        type="error"
        center
        :closable="false"
        show-icon>
      </el-alert>
    </div>
  </div>

</template>

<script>
  import { CHECK_FACE, FACE_LOGIN, CHECK_QR_CODE } from '@/api/modules/login.js'
  import {mapActions} from "vuex";
  import util from "../../../libs/util";
  import store from "../../../store";
  export default {
    components: {},
    data() {
      return {
        code: '',
        imgUrl: '',
        formData: {},
        vdstate: false,
        states: false,
        canvasShow: true,
        tipShow: false,
        errorShow: false
      }
    },
    methods: {
      ...mapActions('d2admin/account', [
        'login'
      ]),
      handleClick() {
        let _this = this

        if (!this.vdstate) {
          return false
        }
        if (!_this.states) {
          // 注册拍照按钮的单击事件
          let video = this.$refs['vd']
          let canvas = this.$refs['cav']
          // let form = this.$refs["myForm"];
          let context = canvas.getContext('2d')
          // 绘制画面
          context.drawImage(video, 0, 0, 200, 200)
          let base64Data = canvas.toDataURL('image/jpg')
          // 封装blob对象
          let blob = this.dataURItoBlob(base64Data, 'camera.jpg') // base64 转图片file
          let formData = new FormData()
          formData.append('file', blob)
          this.imgUrl = base64Data
          CHECK_FACE(formData).then((res) => {
            var accountInfoJson = localStorage.getItem("code");
            FACE_LOGIN(formData, accountInfoJson).then((response) => {
              _this.states = true
              _this.canvasShow = false

              _this.tipShow = true
              _this.$message.success('验证通过' + '!')
              this.login({
                username: response.user.name,
                password: response.user.pwd
              })
              window.close()
            }).catch(function(error) {
              console.log(error)
            })
          })
        }
      },
      dataURItoBlob(base64Data) {
        var byteString
        if (base64Data.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(base64Data.split(',')[1])
        else byteString = unescape(base64Data.split(',')[1])
        var mimeString = base64Data
          .split(',')[0]
          .split(':')[1]
          .split(';')[0]
        var ia = new Uint8Array(byteString.length)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ia], { type: mimeString })
      }
    },
    created() {
      var _this = this
      let a = JSON.stringify(navigator);
      this.$nextTick(() => {
        var _this = this
        // 访问用户媒体设备的兼容方法
        function getUserMedia(constrains, success, error) {
          var video = _this.$refs['vd'];
          if (navigator.mediaDevices.getUserMedia()) {
            // 最新标准API
            let myCons = {...constrains,video:true}
            navigator.mediaDevices
              .getUserMedia(constrains)
              .then((stream)=>{
                video.srcObject =stream
                video.play();
                _this.vdstate = true
              })
              .catch(error)
          } else if (navigator.webkitGetUserMedia) {
            // webkit内核浏览器
            navigator
              .webkitGetUserMedia(constrains)
              .then(success)
              .catch(error)
          } else if (navigator.mozGetUserMedia) {
            // Firefox浏览器
            navagator
              .mozGetUserMedia(constrains)
              .then(success)
              .catch(error)
          } else if (navigator.getUserMedia) {
            // 旧版API
            navigator
              .getUserMedia(constrains)
              .then(success)
              .catch(error)
          }
        }
        var video = this.$refs['vd']
        var canvas = this.$refs['cav']
        // debugger
        var context = canvas.getContext('2d')

        // 成功的回调函数
        function success(stream) {
          _this.vdstate = true
          // 兼容webkit内核浏览器
          var CompatibleURL = window.URL || window.webkitURL
          // 将视频流设置为video元素的源
          video.src = CompatibleURL.createObjectURL(stream)
          // 播放视频
          video.play()
        }
        // 异常的回调函数
        function error(error) {
          alert(error)
          console.log('访问用户媒体设备失败：', error.name, error.message)
        }
        if (
          navigator.mediaDevices.getUserMedia ||
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia
        ) {
          // 调用用户媒体设备，访问摄像头
          getUserMedia(
            {
              video: {width:200,height:200}
            },
            success,
            error
          )
        } else {
          alert('你的浏览器不支持访问用户媒体设备')
        }
        // 获取图片
      })
    },
    mounted: function() {
      setInterval(this.handleClick, 3000)
    },
    // 组件更新
    updated: function() {}
  }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-alert__title,.el-alert__icon{font-size: 20px;}
  .regInfo {
    width: 200px;
    height: 200px;
    overflow: hidden;
    border: 1px solid #ccc;
    border-radius: 50%;
    margin: 0 auto;
    position: relative;
    .tip {
      position: absolute;
      top: 0;
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: rgba(0, 0, 0, 0.2);
      text-align: center;
    }
    .canvas {
      position: absolute;
      top: 0;
      width: 100%;
    }
  }
  .titleInfo {
    text-align: center;
    font-weight: 700;
    padding: 30px 0 20px;
  }
  .tipShow{position: absolute;top:50%;left: 50%;width:180px;margin-left:-90px;}
</style>
