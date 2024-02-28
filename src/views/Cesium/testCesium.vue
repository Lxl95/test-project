<template>
  <div id="cesiumContainer"></div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlODMwYTEzNC1jMjZmLTRmMmYtOWY5MC0wNDU1NGMyN2FlNjEiLCJpZCI6MTUwMTMxLCJpYXQiOjE2ODgwMDc5MDN9.sxiJUx3KmcotP_57RZchyKUO165fswyfM7-xB9BiiZI'

      var viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false, // 隐藏动画控件
        baseLayerPicker: false, // 隐藏图层选择控件
        fullscreenButton: false, // 隐藏全屏按钮
        vrButton: false, // 隐藏VR按钮，默认false
        geocoder: false, // 隐藏地名查找控件
        homeButton: false, // 隐藏Home按钮
        infoBox: false, // 隐藏点击要素之后显示的信息窗口
        sceneModePicker: false, // 隐藏场景模式选择控件
        selectionIndicator: true, // 显示实体对象选择框，默认true
        timeline: false, // 隐藏时间线控件
        navigationHelpButton: false, // 隐藏帮助按钮
        scene3DOnly: true, // 每个几何实例将只在3D中呈现，以节省GPU内存
        shouldAnimate: true, // 开启动画自动播放
        sceneMode: 3, // 初始场景模式 1：2D 2：2D循环 3：3D，默认3
        requestRenderMode: true, // 减少Cesium渲染新帧总时间并减少Cesium在应用程序中总体CPU使用率
        // 如场景中的元素没有随仿真时间变化，请考虑将设置maximumRenderTimeChange为较高的值，例如Infinity
        maximumRenderTimeChange: Infinity
      })
      console.log('viewer', viewer)
      // 隐藏下方Cesium logo
      viewer.cesiumWidget.creditContainer.style.display = 'none'
      // 首先要加载影像图层的数据源，Cesium地球默认加载的是 bing 地图影像，所以要先从容器中删除这个默认影像
      viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
      // 加载ArcGIS影像
      let imagery = viewer.imageryLayers.addImageryProvider(
        new Cesium.ArcGisMapServerImageryProvider({
          url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
          baseLayerPicker: false
        })
      )
      console.log('imagery', imagery)
      // 影像亮度调整
      imagery.brightness = 0.3
    }
  }
}
</script>
<style lang="scss" scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
