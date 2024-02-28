<template>
  <div>
    <el-button type="primary" @click="dialogVisible = true">打开弹框</el-button>
    <z-dialog :title="title" :show.sync="dialogVisible" :zDialogRef="'ZDialogRef'">
      <div>对话框body</div>
      <div slot="footer">对话框footer</div>
    </z-dialog>
  </div>
</template>

<script>
import ZDialog from './ZDialog';
export default {
  components: { ZDialog },
  data() {
    return {
      title: '提示',
      dialogVisible: false
    };
  }
};
</script>

<style></style>
