<template>
  <div id="index">
    <ul>
      <li v-for="(item, index) of imgArr" :key="index">
        <img :src="item" alt="图片描述" />
      </li>
    </ul>
  </div>
</template>

<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

export default {
  name: 'HelloWorld',
  data() {
    return {
      imgArr: [
        'https://picsum.photos/200/200',
        'https://picsum.photos/300/200',
        'https://picsum.photos/250/200'
      ]
    }
  },
  mounted() {
    const ViewerDom = document.getElementById('index')
    const viewer = new Viewer(ViewerDom, {
      // 相关配置项
    })
    console.log(viewer)
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
ul {
  display: flex;
  flex-wrap: wrap;
}
ul li {
  width: 265px;
  height: 180px;
  list-style: none;
  border: 2px solid #ccc;
  border-radius: 3px;
  padding: 1px;
  margin: 10px;
  cursor: pointer;
}
ul li img {
  width: 100%;
  height: 100%;
}
</style>
