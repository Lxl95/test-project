import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
Vue.use(Viewer);
Viewer.setDefaults({
  Options: {
    inline: true,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    // "scalable": true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    url: 'data-source'
  }
});

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
import CodeView from 'vue-code-view';
Vue.use(CodeView);

import VueKonva from 'vue-konva';
Vue.use(VueKonva);

Vue.directive('draggabled', {
  bind(el, binding, vnode) {
    el.style.position = 'absolute';
    const that = vnode.context
    el.onmousedown = function (e) {
      const disX = e.clientX - el.offsetLeft;
      const disY = e.clientY - el.offsetTop;
      console.log(e.target.className);
      document.onmousemove = function (e) {
        const left = e.clientX - disX;
        const top = e.clientY - disY;
        el.style.left = left + 'px';
        el.style.top = top + 'px';
      };
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
  });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
