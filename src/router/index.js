import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import App from '../App.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: HomeView,
    meta: {
      name: 'home',
      title: '主页'
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: {
      name: 'about',
      title: '3D机房'
    }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/2023_7/elFormValid.vue'),
    meta: {
      name: 'test',
      title: '多表单校验'
    }
  },
  {
    path: '/imgSelect',
    name: 'imgSelect',
    component: () => import('../views/2023_7/imgSelect.vue'),
    meta: {
      name: 'imgSelect',
      title: '图片选中'
    }
  },
  {
    path: '/testDialog',
    name: 'testDialog',
    component: () => import('../views/11-23/testDialog.vue'),
    meta: {
      name: 'testDialog',
      title: '弹框最小化'
    }
  },
  {
    path: '/imageCompress',
    name: 'imageCompress',
    component: () => import('../views/12-4/imageCompress.vue'),
    meta: {
      name: 'imageCompress',
      title: '图片压缩'
    }
  },
  {
    path: '/EditTable',
    name: 'EditTable',
    component: () => import('../views/2023_7/EditTable.vue'),
    meta: {
      name: 'EditTable',
      title: '表格列编辑'
    }
  },
  {
    path: '/FullCalendar',
    name: 'FullCalendar',
    component: () => import('../views/2023_7/FullCalendar2.vue'),
    meta: {
      name: 'FullCalendar',
      title: 'FullCalendar'
    }
  },
  {
    path: '/testTreeTable',
    name: 'testTreeTable',
    component: () => import('../views/2023_7/testTreeTable.vue'),
    meta: {
      name: 'home',
      title: '树状表格'
    }
  },
  {
    path: '/testCesium',
    name: 'testCesium',
    component: () => import('../views/Cesium/testCesium.vue'),
    meta: {
      name: 'testCesium',
      title: 'Cesium'
    }
  },
  {
    path: '/monacoEditor',
    name: 'monacoEditor',
    component: () => import('../views/2024_3/testMonacoEditor.vue'),
    meta: {
      name: 'monacoEditor',
      title: 'monacoEditor'
    }
  }
];

const router = new VueRouter({
  routes
});

export default router;
