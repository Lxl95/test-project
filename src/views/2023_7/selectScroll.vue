<template>
  <div>
    <el-button type="primary" @click="dialogVisible = true">Click</el-button>
    <el-dialog title="滚动表单" :visible.sync="dialogVisible" width="50%">
      <div v-closeSelect ref="scrollDiv" style="height: 400px; overflow: auto">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="label">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="label">
            <el-select ref="mySelect" v-model="form.name" :popper-append-to-body="false">
              <el-option v-for="item in 10" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="label">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="label">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="label">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="label">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="label">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="label">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="label">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="label">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="label">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  directives: {
    closeSelect: {
      bind(el, binding, vnode) {
        //这里el是有滚动条的父盒子
        //获取盒子下所有下拉框
        let target = el.getElementsByClassName('el-select-dropdown');
        //处理方法 让所有下拉框隐藏
        el.handler = () => {
          for (let item of target) {
            console.log('item', item);
            item.style.display = 'none';
          }
        };
        //监听父子滚动
        el.addEventListener('scroll', el.handler);
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: { name: '' }
    };
  }
};
</script>
