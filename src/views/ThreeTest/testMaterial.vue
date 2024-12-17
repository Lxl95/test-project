<template>
  <div class="canvasWrapper"></div>
</template>

<script>
import {
  Mesh,
  MeshPhongMaterial,
  SphereGeometry,
  TextureLoader,
  Color,
  DirectionalLight
} from 'three'
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import Stage from '@/components/Stage'
export default {
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const stage = new Stage()
      const { scene, renderer } = stage
      const textureLoader = new TextureLoader()
      const marbleTexture = textureLoader.load('./textures/stone.jpg') // 贴图
      const sphereGeometry = new SphereGeometry(1, 36, 36) // 球体
      const mat = new MeshPhongMaterial() // 材质
      // 高光大小
      mat.shininess = 60
      // 高光颜色
      // mat.specular = new Color(0x00acec)
      // 高光贴图
      mat.specularMap = marbleTexture
      scene.add(new Mesh(sphereGeometry, mat))
      /* 灯光 */
      const light = new DirectionalLight(0xffffff, 0.8)
      light.position.set(10, 10, 10)
      scene.add(light)
      scene.add(new Mesh(sphereGeometry, mat))

      const current = document.querySelector('.canvasWrapper')
      if (current) {
        current.innerHTML = ''
        // 默认是黑色，three.js 渲染器更换背景色
        renderer.setClearColor('#ccc', 1.0)
        current.append(renderer.domElement)
        stage.animate()
      }
    }
  }
}
</script>
<style>
.canvasWrapper {
  width: 100%;
  height: 100%;
}
.canvasWrapper canvas {
  width: 100% !important;
  height: 100%;
}
</style>
