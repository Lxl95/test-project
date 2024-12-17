<template>
  <div class="hello">
    <el-upload :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <div class="upload-video-img-wrap">
        <div class="photo-bg" alt="课程封面" :style="{ backgroundImage: 'url(' + imageUrl + ')' }"></div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import * as imageConversion from 'image-conversion';
export default {
  name: 'imageCompress',
  data() {
    return {
      uploadUrl: '',
      imageUrl: 'dd'
    };
  },
  mounted() {},
  methods: {
    beforeAvatarUpload(file) {
      console.log(file, '压缩前');
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJpgOrPng) {
        //自己封装的错误提示方法
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      if (!isLt2M || !isJpgOrPng) {
        return false;
      }
      return new Promise(resolve => {
        // 压缩到100KB,这里的100就是要压缩的大小,可自定义
        imageConversion.compressAccurately(file, 100).then(res => {
          console.log(res, '压缩后');

          const res2 = new File([res], file.name, { type: file.type });
          console.log(res2, '压缩后');

          resolve(res2);
        });
      });
    },
    //这个方法的返回结果res的数据结构由后台定义
    handleAvatarSuccess(res, file) {
      //文件上传没有走全局拦截，所以需要对状态码进行处理
      console.log(res);
      if (res.errorNo === 0) {
        //输出的上传的图片名
        console.log(res.data.fileName);
        //把返回的file文件转为blob数据进行回显
        this.imageUrl = URL.createObjectURL(file.raw);
      } else {
        this.$message.error('图片上传失败，请重新上传！');
      }
    }
  }
};
</script>
<style lang="css" scoped>
.photo-bg {
  width: 300px;
  height: 300px;
  background-color: aliceblue;
}
</style>
