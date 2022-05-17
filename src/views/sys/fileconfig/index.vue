<template>
  <el-tabs class="cont" v-model="activeName" type="card">
    <el-tab-pane label="用户管理" name="first">
      用户管理
      <el-form ref="form" :model="loginUser" label-width="80px" size="mini">
        <el-form-item label="用户名">
          <el-input v-model="loginUser.name"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="loginUser.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="loginUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="loginUser.mobile"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit">立即修改</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="七牛云上传配置" name="second">
      <el-form ref="form" :model="qiniuConfig" label-width="80px" size="mini">
        <el-form-item label="空间域名">
          <el-input v-model="qiniuConfig.basePath"></el-input>
        </el-form-item>
        <el-form-item label="AccessKey">
          <el-input v-model="qiniuConfig.accessKey"></el-input>
        </el-form-item>
        <el-form-item label="SecretKey">
          <el-input v-model="qiniuConfig.secretKey"></el-input>
        </el-form-item>
        <el-form-item label="BucketName">
          <el-input v-model="qiniuConfig.bucketName"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="qiniuSubmit">立即启用</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="阿里云上传配置" name="third">
      <el-form ref="form" :model="aliyunConfig" label-width="80px" size="mini">
        <el-form-item label="阿里云地域节点（EndPoint）">
          <el-input v-model="aliyunConfig.basePath"></el-input>
        </el-form-item>
        <el-form-item label="FileUrl">
          <el-input v-model="aliyunConfig.fileUrl"></el-input>
        </el-form-item>
        <el-form-item label="AccessKey">
          <el-input v-model="aliyunConfig.accessKey"></el-input>
        </el-form-item>
        <el-form-item label="SecretKey">
          <el-input v-model="aliyunConfig.secretKey"></el-input>
        </el-form-item>
        <el-form-item label="BucketName">
          <el-input v-model="aliyunConfig.bucketName"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="aliyunSubmit">立即启用</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import { GET_LOGIN_USER } from '@/api/modules/user.js';
  import { GET_FILE_CONFIG, FDFS_UPLOAD, FDFS_DELETE, FILE_CONFIG } from '@/api/modules/file.js';

  export default {
    data() {
      return {
        activeName: 'first',
        loginUser: {},
        qiniuConfig: {
          storageType: "qiniu"
        },
        aliyunConfig:{
          storageType: "aliyun"
        },
        config:[]
      };
    },
    created() {
      this.getUser()
      this.getFileConfig()
    },
    methods: {
      onSubmit() {
        USER_UPDATE(this.loginUser).then((res) => {
          if (res) {
            this.$message({ message: "操作成功", type: "success" });
            this.getUser()
          } else {
            this.$message({
              message: "操作失败, " + res.msg,
              type: "error"
            });
          }
        })
      },
      qiniuSubmit() {
        FILE_CONFIG(this.qiniuConfig).then((res) => {
          this.getFileConfig()
        })
      },
      aliyunSubmit() {
        FILE_CONFIG(this.aliyunConfig).then((res) => {
          this.getFileConfig()
        })
      },
      getUser() {
        GET_LOGIN_USER().then((res) => {
          this.loginUser = res
        }).then()
      },
      getFileConfig() {
        GET_FILE_CONFIG().then((res) => {
          this.config = res
          for (var i = 0; i < this.config.length; i++) {
            if (this.config[i].storageType === "aliyun") {
              this.aliyunConfig = this.config[i]
            } else if (this.config[i].storageType === "qiniu") {
              this.qiniuConfig = this.config[i]
            }
          }
        }).then()
      }
    }
  };
</script>
<style scoped>

  .cont {
    width: 50%;
    height: 80%;
    text-align: center;
  }
</style>
