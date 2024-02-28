import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
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
})

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
