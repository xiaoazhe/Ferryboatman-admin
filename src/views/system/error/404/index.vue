<template>
  <div class="page">
    <p class="page_title">稍等~~~~~</p>
    <el-button class="d2-mt" @click="$router.replace({ path: '/' })">
      跳转中
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.page {
  background: #303133;
  background-blend-mode: multiply,multiply;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .page_title {
    font-size: 20px;
    color: #FFF;
  }
}
</style>
