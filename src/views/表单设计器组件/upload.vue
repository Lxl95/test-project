<template>
  <div>
    <el-upload
      action="http://123.161.164.68:30000/apiia/api/Iams/Inner/CM/GmImg/Upload"
      list-type="text"
      name="formFile"
      :data="paramsObj"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-change="handleChange"
      multiple
    >
      <i class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img v-if="file.typeString === 'image'" class="el-upload-list__item-thumbnail" :src="baseUrl + file.url" alt="" />
        <video v-else-if="file.typeString === 'video'" :src="baseUrl + file.url" controls class="preview-video"></video>
        <span v-else>{{ file.url }}</span>
        <span class="el-upload-list__item-actions">
          <span class="action-button" @click.stop="handlePreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="action-button" @click.stop="downloadFile(file)">
            <i class="el-icon-download"></i>
          </span>
          <span class="action-button" @click.stop="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>

    <!-- 预览对话框 -->
    <el-dialog :visible.sync="previewVisible" width="80%" top="5vh">
      <img v-if="currentFile.type === 'image'" :src="currentFile.url" class="preview-image" />
      <video v-else-if="currentFile.type === 'video'" :src="currentFile.url" controls class="preview-video"></video>
      <div v-else class="unsupported-type">不支持预览的文件类型</div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: 'http://123.161.164.68:30000/apiia/',
      paramsObj: {
        SystemMark: 'XtYth',
        AccessToken: 'c0f75cf7-1e61-4e90-bed5-e011bda04d1f'
      },
      fileList: [], // 文件列表
      previewVisible: false, // 预览对话框显示状态
      currentFile: {} // 当前预览的文件
    };
  },
  methods: {
    // 文件预览处理
    handlePreview(file) {
      this.currentFile = {
        name: file.name,
        url: this.baseUrl + file.url || URL.createObjectURL(file.raw),
        type: this.getFileType(file)
      };
      this.previewVisible = true;
    },

    // 文件删除处理
    handleRemove(file, fileList) {
      // 实际项目中这里需要调用API删除服务器文件
      this.fileList = fileList;
      this.$message.success(`已删除: ${file.name}`);
    },

    // 获取文件类型 (图片/视频/其他)
    getFileType(file) {
      const type = file.raw?.type || file.type || '';
      if (type.startsWith('image/')) return 'image';
      if (type.startsWith('video/')) return 'video';

      // 通过文件后缀判断
      const extension = file.name.split('.').pop().toLowerCase();
      const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'];

      if (imageTypes.includes(extension)) return 'image';
      if (videoTypes.includes(extension)) return 'video';
      return 'other';
    },

    // 上传前校验
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        this.$message.error('文件大小不能超过50MB!');
        return false;
      }
      return true;
    },

    // 上传成功处理
    handleSuccess(response, file, fileList) {
      this.fileList = fileList;
      // 实际项目中这里需要将服务器返回的URL设置到file对象
      console.log(response);
      file.url = response.Data.GmImgUrl;
      file.typeString = this.getFileType(file);
      this.$message.success(`${file.name} 上传成功`);
    },

    // 上传失败处理
    handleError(err, file, fileList) {
      this.$message.error(`${file.name} 上传失败: ${err.message}`);
    },

    // 文件状态变化
    handleChange(file, fileList) {
      this.fileList = fileList;
    },

    // 自定义下载方法
    downloadFile(file) {
      const link = document.createElement('a');
      link.href = this.baseUrl + file.url;
      link.download = file.name;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
/* 自定义文件卡片样式 */
.el-upload-list__item-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.el-upload-list__item:hover .el-upload-list__item-actions {
  opacity: 1;
}

.action-button {
  color: #fff;
  font-size: 20px;
  margin: 0 5px;
  cursor: pointer;
  transition: color 0.2s;
}

.action-button:hover {
  color: #409eff;
}

/* 预览样式 */
.preview-image {
  width: 100%;
  display: block;
  max-height: 70vh;
  object-fit: contain;
}

.preview-video {
  width: 100%;
  max-height: 70vh;
}

.unsupported-type {
  text-align: center;
  font-size: 18px;
  padding: 40px 0;
  color: #999;
}
</style>