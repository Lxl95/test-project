<template>
  <VViewer
    :options="imgPath ? [baseUrl + imgPath] : imgList"
    :imgStyle="'cover'"
    :border-radius="'8px'"
    :style="
      imgPath ? 'width: 140px; height: 70px' : 'width: 420px; height: 70px'
    "
  ></VViewer>
</template>

<script>
import VViewer from '@/components/vviewer'
export default {
  name: 'ImgViewer',
  components: { VViewer },
  data() {
    return {
      baseUrl: 'https://picsum.photos/',
      imgPath: '',
      imgList: [
        'https://picsum.photos/200/200',
        'https://picsum.photos/300/200',
        'https://picsum.photos/250/200'
      ]
    }
  }
}
</script>
