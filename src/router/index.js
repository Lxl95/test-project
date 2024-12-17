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
    path: '/about3D',
    name: 'about3D',
    // route level code-splitting
    // this generates a separate chunk (about3D.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about3D" */ '../views/3D机房.vue'),
    meta: {
      name: 'about3D',
      title: '3D机房'
    }
  },
  {
    path: '/elFormValid',
    name: 'elFormValid',
    component: () => import('../views/2023_7/elFormValid.vue'),
    meta: {
      name: 'elFormValid',
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
    component: () => import('../views/弹框最小化/testDialog.vue'),
    meta: {
      name: 'testDialog',
      title: '弹框最小化'
    }
  },
  {
    path: '/imageCompress',
    name: 'imageCompress',
    component: () => import('../views/图片压缩/imageCompress.vue'),
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
      title: 'FullCalendar日历'
    }
  },
  {
    path: '/testTreeTable',
    name: 'testTreeTable',
    component: () => import('../views/2023_7/testTreeTable.vue'),
    meta: {
      name: 'testTreeTable',
      title: '树状表格'
    }
  },
  {
    path: '/selectScroll',
    name: 'selectScroll',
    component: () => import('../views/2023_7/selectScroll.vue'),
    meta: {
      name: 'selectScroll',
      title: '滚动时关闭下拉框弹出层'
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
  },
  {
    path: '/FakeProgress',
    name: 'FakeProgress',
    component: () => import('../views/2024_3/testFake.vue'),
    meta: {
      name: 'FakeProgress',
      title: 'FakeProgress'
    }
  },
  {
    path: '/codeView',
    name: 'codeView',
    component: () => import('../views/2024_3/codeView.vue'),
    meta: {
      name: 'codeView',
      title: 'codeView'
    }
  },
  {
    path: '/titleCSS',
    name: 'titleCSS',
    component: () => import('../views/2024_10/titleCSS.vue'),
    meta: {
      name: 'titleCSS',
      title: 'titleCSS'
    }
  },
  {
    path: '/html2pdf',
    name: 'html2pdf',
    component: () => import('../views/2024_10/html2pdf.vue'),
    meta: {
      name: 'html2pdf',
      title: 'html2pdf'
    }
  },
  {
    path: '/ImageViewer',
    name: 'ImageViewer',
    component: () => import('../views/ImageViewer.vue'),
    meta: {
      name: 'ImageViewer',
      title: '图片预览'
    }
  },
  {
    path: '/tableTest',
    name: 'tableTest',
    component: () => import('../views/tableTest.vue'),
    meta: {
      name: 'tableTest',
      title: 'elTable自定义勾选列'
    }
  },
  {
    path: '/testExcel',
    name: 'testExcel',
    component: () => import('../views/testExcel.vue'),
    meta: {
      name: 'testExcel',
      title: '预览Excel'
    }
  },
  {
    path: '/testBpm',
    name: 'testBpm',
    component: () => import('../views/testBpm.vue'),
    meta: {
      name: 'testBpm',
      title: '原生流程图'
    }
  },
  {
    path: '/testSpan',
    name: 'testSpan',
    component: () => import('../views/testSpan.vue'),
    meta: {
      name: 'testSpan',
      title: '表格单元格合并'
    }
  },
  {
    path: '/testTree',
    name: 'testTree',
    component: () => import('../views/testTree.vue'),
    meta: {
      name: 'testTree',
      title: '树形选择器'
    }
  },
  {
    path: '/TinyMCE',
    name: 'TinyMCE',
    component: () => import('../views/TinyMCE.vue'),
    meta: {
      name: 'TinyMCE',
      title: '富文本TinyMCE'
    }
  },
  {
    path: '/ThreeJs_1',
    name: 'ThreeJs_1',
    component: () => import('../views/ThreeTest/OrbitControls.vue'),
    meta: {
      name: 'OrbitControls',
      title: '轨道控制器-父子物体-缩放-旋转'
    }
  },
  {
    path: '/testMaterial',
    name: 'testMaterial',
    component: () => import('../views/ThreeTest/testMaterial.vue'),
    meta: {
      name: 'testMaterial',
      title: 'Three材质'
    }
  },
  {
    path: '/TestThree',
    name: 'TestThree',
    component: () => import('../views/ThreeTest/TestThree.vue'),
    meta: {
      name: 'TestThree',
      title: 'Three动态效果'
    }
  }
];

const router = new VueRouter({
  routes
});

export default router;
