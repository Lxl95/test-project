<template>
  <div id="canvas-div"></div>
</template>

<script>
import * as THREE from 'three';
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // console.log(THREE);

      // 目标：使用控制器查看3d物体

      // 1、创建场景
      const scene = new THREE.Scene();

      // 2、创建相机
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

      // 设置相机位置
      camera.position.set(1, 2, 10);
      // camera.lookAt(1,2,3);
      scene.add(camera);

      // 添加物体
      // 创建几何体
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
      const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const parentCubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      // 根据几何体和材质创建物体
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      const parentCube = new THREE.Mesh(cubeGeometry, parentCubeMaterial);

      scene.add(cube);
      scene.add(parentCube);

      parentCube.add(cube); // 父子元素
      parentCube.position.set(-3, 0, 0);
      // 子元素是根据父元素的位置进行position的偏移 而不是原点
      cube.position.set(2, 0, 0);
      parentCube.scale.set(2, 2, 2); // 父亲缩放会带动儿子一起缩放
      parentCube.rotation.x = Math.PI / 4;

      // 将几何体添加到场景中

      // 初始化渲染器
      const renderer = new THREE.WebGLRenderer();
      // 设置渲染的尺寸大小
      renderer.setSize(window.innerWidth, window.innerHeight);
      // console.log(renderer);
      // 将webgl渲染的canvas内容添加到body
      //   document.body.appendChild(renderer.domElement);
      document.querySelector('#canvas-div').appendChild(renderer.domElement);

      // // 使用渲染器，通过相机将场景渲染进来
      // renderer.render(scene, camera);

      // 创建轨道控制器
      const controls = new OrbitControls(camera, renderer.domElement);

      // 添加坐标轴辅助器
      const axesHelper = new THREE.AxesHelper(5);
      scene.add(axesHelper);


      window.addEventListener('dblclick', () => {
        const fullScreenElement = document.fullscreenElement;
        if (!fullScreenElement) {
          //   双击控制屏幕进入全屏，退出全屏
          // 让画布对象全屏
          renderer.domElement.requestFullscreen();
        } else {
          //   退出全屏，使用document对象
          document.exitFullscreen();
        }
        //   console.log(fullScreenElement);
      });


      // 监听画面变化，更新渲染画面
      window.addEventListener('resize', () => {
        //   console.log("画面变化了");
        // 更新摄像头
        camera.aspect = window.innerWidth / window.innerHeight;
        //   更新摄像机的投影矩阵
        camera.updateProjectionMatrix();

        //   更新渲染器
        renderer.setSize(window.innerWidth, window.innerHeight);
        //   设置渲染器的像素比
        renderer.setPixelRatio(window.devicePixelRatio);
      });


      function render() {
        controls.update();
        renderer.render(scene, camera);
        //   渲染下一帧的时候就会调用render函数
        requestAnimationFrame(render);
      }

      render();
    }
  }
};
</script>

<style lang="scss" scoped>
canvas {
  width: 100vw;
  height: 100vh;
}
</style>>