<template>
  <div>
    <el-button type="primary" @click="submitForm()">检验表单</el-button>
    <el-row :gutter="40">
      <el-col :span="12">
        <el-form :model="formData" :rules="rules" ref="formData" class="sp-form">
          <span>表单1</span>
          <el-form-item label="测试输入框1" prop="input1">
            <el-input v-model="formData.input1"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form :model="formData2" :rules="rules" ref="formData2" class="sp-form">
          <span>表单2</span>
          <el-form-item label="测试输入框2" prop="input2">
            <el-input v-model="formData2.input2"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form :model="formData3" :rules="rules" ref="formData3" class="sp-form">
          <span>表单3</span>
          <el-form-item label="测试输入框3" prop="input3">
            <el-input v-model="formData3.input3"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form :model="formData4" :rules="rules" ref="formData4" class="sp-form">
          <span>表单4</span>
          <el-form-item label="测试输入框4" prop="input4">
            <el-input v-model="formData4.input4"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        input1: ''
      },
      formData2: {
        input2: ''
      },
      formData3: {
        input3: ''
      },
      formData4: {
        input4: ''
      },
      rules: {
        input1: [{ required: true, message: '请随意输入内容，长度大于0', trigger: 'blur' }],
        input2: [{ required: true, message: '请随意输入内容，长度大于1', trigger: 'blur' }],
        input3: [{ required: true, message: '请随意输入内容，长度大于2', trigger: 'blur' }],
        input4: [{ required: true, message: '请随意输入内容，长度大于3', trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitForm() {
      let formNames = ['formData', 'formData2', 'formData3', 'formData4'];
      const promiseList = formNames.map(item => {
        return this.checkForm(item);
      });

      Promise.all(promiseList)
        .then(() => {
          console.log('所有表单都通过了校验');
        })
        .catch(formName => {
          console.log(formName + '表单未通过');
        });
    },
    checkForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject(formName);
          }
        });
      });
    }
  }
};
</script>

<style></style>
