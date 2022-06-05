<template>
  <div style="height: 80%">
    <!-- 搜索栏-->
    <el-form :inline="true" :model="page" class="demo-form-inline" size="mini">
      <el-form-item label="歌曲名">
        <el-input v-model="page.name" placeholder="歌曲名" clearable />
      </el-form-item>
      <el-form-item label="启用">
        <el-select v-model="page.enabled" placeholder="启用" clearable filterable>
          <el-option label="所有" :value="-1" />
          <el-option label="启用" :value="1" />
          <el-option label="未启用" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" sizi="mini" @click="getByPage">查询</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <div class="add-container">
      <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">
        添加
      </el-button>
      <audio :src="musicUrl" :autoplay="autoplay" controls="controls" />
    </div>


    <!--右侧栏添加-->
    <el-drawer
      title="标题"
      :visible.sync="drawer"
      :before-close="handleClose">
      <el-form ref="form" :model="musicAdd" label-width="80px" size="mini">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="musicAdd.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="musicAdd.name" />
        </el-form-item>
        <el-form-item label="歌手">
          <el-input v-model="musicAdd.artist" />
        </el-form-item>

        <el-form-item label="封面">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="uploadSuccess"
          >
            <i class="el-icon-upload" v-if="musicAdd.cover == ''"/>
            <div class="el-upload__text" v-if="musicAdd.cover == ''">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <img
              v-else
              :src="musicAdd.cover"
              class="avatar"/>

          </el-upload>
        </el-form-item>

        <el-form-item label="歌曲文件">
          <el-upload
            :action="fdfsUploadImage"
            :limit="1"
            :on-success="uploadMusicSuccess"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="歌词">
          <el-input v-model="musicAdd.lrc" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit">提交</el-button>
          <el-button size="mini">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 列表 -->
    <el-table :data="musicData.content" border style="width: 100%" height="100%" @sort-change="changeSort">
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="name" label="歌曲名" width="200" show-overflow-tooltip />
      <el-table-column prop="artist" label="歌手" sortable="custom" />
      <el-table-column prop="cover" label="图片" width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 100%;height: 100px"
            :src="scope.row.cover"
            :preview-src-list="[scope.row.cover]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" sortable="custom" />
      <el-table-column prop="enable" label="启用" sortable="custom">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable === 1">启用</el-tag>
          <el-tag v-else type="info">未启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="readLrc(scope.row.id)">歌词</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="primary" @click="toHear(scope.row.url)">播放</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button v-if="scope.row.enable === 0" size="mini" type="success" @click="toEnable(scope.row.id)">启用</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button v-if="scope.row.enable === 1" size="mini" type="warning" @click="toDisable(scope.row.id)">弃用</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="toolbar" style="padding:10px;">
      <el-pagination layout="total, prev, pager, next, jumper" @current-change="refreshPageRequest"
                     :current-page="page.pageNum"
                     :page-size="page.pageSize"
                     :total="musicData.totalSize" style="float:right;">
      </el-pagination>
    </div>

    <!-- 添加弹窗 -->
    <el-dialog title="添加" :visible.sync="addDialog">
      <music-add @closeAddDialog="closeAddDialog" @getByPage="getByPage" />
    </el-dialog>

    <!-- 修改弹窗 -->
    <el-dialog title="修改" :visible.sync="updateDialog">
      <music-update :music="music" @closeUpdateDialog="closeUpdateDialog" @getByPage="getByPage" />
    </el-dialog>

    <!-- 歌词弹窗 -->
    <el-dialog title="歌词" :visible.sync="lrcDialog">
      <div v-html="music.lrc" />
    </el-dialog>
  </div>
</template>

<script>
  import {
    MUSIC_SAVE,
    MUSIC_PAGE,
    MUSIC_DELETE_ID,
    MUSIC_GET_ID,
    MUSIC_ENABLE,
    MUSIC_DISABLE
  } from "@/api/modules/music.js";
  export default {
    components: {

    },
    data () {
      return {
        page: {
          pageNum: 1, // 当前页
          pageSize: 10, // 每页显示条数
          name: '',
          enabled: ''
        },
        musicData: {
          content: [],
          pageNum: "",
          pageSize: "",
          totalPages: "",
          totalSize: 0
        },
        music: {},
        musicUrl: '', // 音乐预览url
        autoplay: '', // 自动播放
        updateDialog: false, // 控制修改弹窗显示
        lrcDialog: false, // 控制修改弹窗显示
        addDialog: false, // 控制添加弹窗显示

        drawer: false, //右侧栏
        musicAdd: {
          url: '',
          cover: '',
        },
        imageUrl: null, // 上传图片回显
        fileList: [], // 上传文件的文件列表
        uploadUrl: "http://121.5.129.126:8001/file/images", // 上传图片路径
        fdfsUploadImage: "http://121.5.129.126:8001/file/fdfsUploadImage"
      }
    },
    created () {
      this.getByPage()
    },
    methods: {
      onSubmit () {
        MUSIC_SAVE(this.musicAdd).then(res => {
          if (res) {
            this.$message({ message: '操作成功', type: 'success' })
            this.drawer = false
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
          this.getByPage()
          this.musicAdd = {}
        })
      },
      handleCurrentChange (val) {
        this.page.currentPage = val
        this.getByPage()
      },
      changeSort (e) {
        if (e.order) {
          this.page.sortColumn = e.prop
          this.page.sortMethod = e.order
        } else {
          this.page.sortColumn = ''
          this.page.sortMethod = 'asc'
        }
        this.getByPage()
      },
      toEnable (id) {
        // 启用
        this.$confirm('是否启用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          MUSIC_ENABLE(id).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
      },
      toHear (url) {
        this.musicUrl = url
        this.autoplay = true
      },
      toDisable (id) {
        // 弃用
        this.$confirm('是否弃用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          MUSIC_DISABLE(id).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
      },
      getByPage () {
        MUSIC_PAGE(this.page).then(res => {
          this.musicData = res
          this.page.pageNum = res.pageNum
          this.page.pageSize = res.pageSize
        })
      },
      // 换页刷新
      refreshPageRequest: function (pageNum) {
        this.page.pageNum = pageNum
        this.getByPage()
      },
      handleEdit (id) {
        MUSIC_GET_ID(id).then(res => {
          this.musicAdd = res
          this.drawer = true
        })
      },
      readLrc (id) {
        // 阅读歌词
        MUSIC_GET_ID(id).then(res => {
          this.music = res
          this.lrcDialog = true
        })
      },
      handleDelete (id) {
        // 删除
        this.$confirm('是否删除该音乐?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          MUSIC_DELETE_ID(id).then(res => {
            this.$message.success(res.msg)
            this.getByPage()
          })
        })
      },
      openAddDialog () {
        // 打开添加弹窗
        this.addDialog = true
      },
      closeAddDialog () {
        // 关闭添加弹窗
        this.addDialog = false
      },
      closeUpdateDialog () {
        // 关闭修改弹窗
        this.updateDialog = false
      },
      // 右侧栏
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => { });
      },
      // 上传成功回显
      uploadSuccess (res, file) {
        this.musicAdd.cover = res.data
      },
      uploadMusicSuccess (res, file) {
        this.musicAdd.url = res.data
      }
    }
  }
</script>
<style scoped>
  .add-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .add-button {
    margin-top: 5px;
    margin-right: 10px;
  }
</style>

