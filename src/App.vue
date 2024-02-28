<template>
  <div id="app">
    <nav>
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">3D机房</router-link>  |
      <router-link to="/test">Test</router-link> -->
      <span v-for="router in routerList" :key="router.path">
        <router-link :to="router.path">{{ router.meta && router.meta.title }}</router-link>
        |
      </span>
      <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <div v-for="router in routerList" :key="router.path">
          <el-menu-item :index="router.path">{{ router.meta && router.meta.title }}</el-menu-item>
        </div>
      </el-menu> -->
    </nav>
    <router-view />
  </div>
</template>
<script>
import VueRouter from './router';
export default {
  data() {
    return {
      activeIndex: '1',
      VueRouter,
      routerList: []
    };
  },
  created() {
    this.routerList = this.VueRouter.options.routes;
    console.log(this.routerList);
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
}
/* nav {
  padding: 30px;
  display: none;
} */

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
