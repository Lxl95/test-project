<template>
  <div class="canvasWrapper"></div>
</template>

<script>
/* eslint-disable */
import {
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  BufferGeometry,
  BufferAttribute,
  Shape
} from 'three'
import * as THREE from 'three'
import Stage from '@/components/Stage'
import WaveBall from '@/components/WaveBall'
export default {
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const stage = new Stage(5, 3, 0)
      const { scene, renderer, camera } = stage

      const geometry = new WaveBall(48, 48)
      geometry.wave()

      const material = new MeshNormalMaterial()
      const mesh = new Mesh(geometry, material)
      scene.add(mesh)

      // const material_2 = new MeshBasicMaterial({
      //   wireframe: true,
      // });
      // const mesh_2 = new Mesh(geometry, material_2);
      // scene.add(mesh_2);

      const current = document.querySelector('.canvasWrapper')
      if (current) {
        current.innerHTML = ''
        current.append(renderer.domElement)
        animate()
      }
      // 连续渲染
      function animate(time = 1) {
        if (time > 2) {
          time = 1
        }
        stage.responsive()
        geometry.wave(time)
        renderer.render(scene, camera)
        requestAnimationFrame((msg) => {
          animate(time + 0.02)
        })
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
