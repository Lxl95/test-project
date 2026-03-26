<template>
  <div>
    <!-- directive -->
    <div class="images" v-viewer>
      <img v-for="src in images" :key="src" :src="src" />
    </div>
    <!-- component -->
    <viewer :images="images">
      <img v-for="src in images" :key="src" :src="src" />
    </viewer>
    <!-- api -->
    <button type="button" @click="show">Click to show</button>
  </div>
</template>
<script>
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
import Vue from 'vue';
Vue.use(VueViewer);
export default {
  data() {
    return {
      images: ['https://picsum.photos/200/200', 'https://picsum.photos/300/200', 'https://picsum.photos/250/200']
    };
  },
  methods: {
    show() {
      this.$viewerApi({
        images: this.images
      });
    },
    // 流程表单设计，组件之间数据共享，计算天数
    BpmForm() {
      console.log(this.date[0], this.date[1], this.$Datas, 'date');
      if (this.date[0] && this.date[1]) {
        // 转换为 Date 对象
        const d1 = new Date(this.date[0]);
        const d2 = new Date(this.date[1]);

        // 提取日期部分（年、月、日），构建 UTC 时间，避免本地时区干扰
        const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
        const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

        // 计算毫秒差并转换为天数
        const msPerDay = 24 * 60 * 60 * 1000;
        const days = (utc2 - utc1) / msPerDay;
        console.log(days, 'days')
        const dateCom = this.$Datas.find(item => item._config && item._config.label == '天数');
        if (dateCom) {
          dateCom._config.defaultValue = days;
        }
      }
    }
  }
};
</script>
