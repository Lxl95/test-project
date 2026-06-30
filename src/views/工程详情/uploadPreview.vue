<template>
  <div>
    <el-upload action="/api/upload" :file-list="fileList" :on-success="handleSuccess" :on-remove="handleRemove" multiple>
      <el-button type="primary">选择文件</el-button>
      <div slot="tip" class="el-upload__tip">支持 jpg/png 及其他任意格式文件</div>

      <!-- 自定义文件列表插槽 -->
      <template slot="file" slot-scope="{ file }">
        <!-- 图片类型：横向缩略图 -->
        <!-- <div v-if="isImageFile(file)" class="image-thumbnail-wrapper">
          <div class="image-thumbnail">
            <img :src="file.url" :alt="file.name" />
            <i class="el-icon-close delete-icon" @click.stop="handleRemove(file)"></i>
          </div>
        </div>

        <div v-else class="file-list-item">
          <i class="el-icon-document"></i>
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
          <i class="el-icon-close delete-btn" @click.stop="handleRemove(file)"></i>
        </div> -->
        <div v-if="isImageFile(file)" class="van-uploader__preview">
            <div  class="van-image van-uploader__preview-image">
              <img src="https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg" class="van-image__img" style="object-fit: cover" />
              <!---->
              <div class="van-uploader__preview-cover"><div class="preview-cover van-ellipsis">图片名称</div></div>
            </div>
            <div role="button" class="van-uploader__preview-delete van-uploader__preview-delete--shadow" tabindex="0" aria-label="删除">
              <i class="el-icon-close van-badge__wrapper van-icon van-icon-cross van-uploader__preview-delete-icon">
              </i>
            </div>
          </div>
          <div v-else class="van-uploader__preview">
            <div class="van-uploader__file">
              <i class="el-icon-document van-badge__wrapper van-icon van-icon-description van-uploader__file-icon"  @click.stop="handleRemove(file)">
              </i>
              <div class="van-uploader__file-name van-ellipsis"></div>
              <div class="van-uploader__preview-cover"><div class="preview-cover van-ellipsis">AI知识库资料[企业门户].xlsx</div></div>
            </div>
            <div role="button" class="van-uploader__preview-delete van-uploader__preview-delete--shadow" tabindex="0" aria-label="删除">
              <i class="el-icon-close van-badge__wrapper van-icon van-icon-cross van-uploader__preview-delete-icon">
              </i>
            </div>
          </div>
      </template>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [] // 文件列表，可预设数据
    };
  },
  mounted() {
    // 模拟预设数据（实际可从接口获取）
    this.loadPresetFiles();
  },
  methods: {
    // 加载预设文件（图片 + 文档）
    loadPresetFiles() {
      const preset = [
        {
          name: '风景图片.jpg',
          url: 'https://picsum.photos/id/1015/40/40', // 示例图片地址
          size: 102400,
          uid: 1,
          raw: { type: 'image/jpeg' }
        },

        {
          name: '头像.png',
          url: 'https://picsum.photos/id/1/40/40',
          size: 45678,
          uid: 3,
          raw: { type: 'image/png' }
        },
        {
          name: '文档说明.pdf',
          url: '',
          size: 204800,
          uid: 2,
          raw: { type: 'application/pdf' }
        }
      ];
      this.fileList = preset;
    },

    // 判断是否为图片文件
    isImageFile(file) {
      // 优先通过 raw.type 判断
      if (file.raw && file.raw.type) {
        return file.raw.type.startsWith('image/');
      }
      // 否则根据文件名后缀判断
      const ext = (file.name || '').split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (!bytes) return '';
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = bytes;
      let unitIndex = 0;
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      return `${size.toFixed(1)} ${units[unitIndex]}`;
    },

    // 上传成功回调
    handleSuccess(response, file, fileList) {
      // 根据接口返回更新 file.url
      if (response.url) {
        file.url = response.url;
      }
      // 确保新文件有 raw 信息（已自带）
      this.fileList = fileList;
    },

    // 删除文件
    handleRemove(file) {
      const index = this.fileList.findIndex(f => f.uid === file.uid);
      if (index !== -1) {
        this.fileList.splice(index, 1);
      }
      // 可在此调用后端删除接口
    }
  }
};
</script>

<style scoped>
/* 图片缩略图容器：横向排列 */
.image-thumbnail-wrapper {
  display: inline-block; /* 使容器横向排列 */
  margin: 0 12px 12px 0;
  text-align: center;
  width: 60px; /* 宽度略大于图片，容纳文字 */
  vertical-align: top;
}

/* 缩略图区域 */
.image-thumbnail {
  position: relative;
  width: 40px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f7fa;
  margin: 0 auto 4px;
}

.image-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片填满且不变形 */
}

/* 删除图标悬浮在缩略图右上角 */
.delete-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 16px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  padding: 2px;
  transition: all 0.2s;
}

.delete-icon:hover {
  background-color: #f56c6c;
}

/* 图片文件名：换行省略 */
.image-thumbnail-wrapper .file-name {
  font-size: 12px;
  color: #606266;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 非图片文件：纵向列表样式（类似默认列表） */
.file-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: #fff;
  transition: all 0.2s;
}

.file-list-item i.el-icon-document {
  font-size: 24px;
  color: #409eff;
  margin-right: 8px;
}

.file-list-item .file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 8px;
}

.file-list-item .file-size {
  font-size: 12px;
  color: #909399;
  margin-right: 12px;
}

.file-list-item .delete-btn {
  cursor: pointer;
  color: #c0c4cc;
  font-size: 16px;
  transition: color 0.2s;
}

.file-list-item .delete-btn:hover {
  color: #f56c6c;
}
/* 自定义文件列表外层容器（可包裹在 slot 外层，或通过全局样式覆盖） */
/deep/ .el-upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
/deep/.el-upload-list__item {
   width:auto;
   margin-top: 10px;
} 
/deep/ .el-upload-list__item .el-icon-close {
    opacity: 1;
    display: block;
}
</style>
<style scoped>
.van-uploader__preview {
    margin: 0 8px 8px 0;
    cursor: pointer;
    position: relative
}

.van-uploader__preview-image {
    width: 80px;
    height: 80px;
    border-radius: 0;
    display: block;
    overflow: hidden
}

.van-uploader__preview-delete {
    position: absolute;
    top: 0;
    right: 0
}

.van-uploader__preview-delete--shadow {
    width: 14px;
    height: 14px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 0 0 0 12px
}

.van-uploader__preview-delete-icon {
    color: #fff;
    font-size: 14px;
    position: absolute;
    top: 0;
    right: 0;
    transform: scale(.7)translate(10%,-10%)
}

.van-uploader__preview-cover {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0
}


 .preview-cover {
    box-sizing: border-box;
    color: #fff;
    text-align: center;
    background: rgba(0,0,0,.3);
    width: 100%;
    padding: 4px;
    font-size: 12px;
    position: absolute;
    bottom: 0
}
.van-image__img {
    width: 100%;
    height: 100%;
    display: block
}
.van-ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
}
.van-uploader__file {
    width: 80px;
    height: 80px;
    background: #f7f8fa;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex
}

.van-uploader__file-icon {
    /* color: #fff; */
    font-size: 40px;
}

.van-uploader__file-name {
    box-sizing: border-box;
    width: 100%;
    margin-top: 8px;
    padding: 0 4px;
    color: #646566;
    font-size: 12px;
    text-align: center
}

</style>