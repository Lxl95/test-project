<template>
  <div id="app">
    <code-viewer :source="code_example" layout="right" themeMode=""></code-viewer>
  </div>
</template>
<script>
const code_source = `
<template>
  <div id="app">
    <img alt="Vue logo" class="logo" src="https://v2.cn.vuejs.org/images/logo.svg" />
    <h1>Welcome to Vue.js {{version}} !</h1>
    <el-row>
  <el-button type="primary" plain @click="addClick('111')">主要按钮</el-button>
</el-row>
  </div>
</template>
<script>
export default {
    data() {
      return {
        version: '2.x'
      };
    },
    methods: {
    addClick(val) {
      alert(val)
    }
   }
  };
<\/script>

<style>
.logo {
  width:66px;
}
</style> `;
export default {
  data() {
    return {
      code_example: code_source
    };
  }
};
</script>
