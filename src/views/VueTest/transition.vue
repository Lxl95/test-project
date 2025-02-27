<template>
  <div class="page-container">
    <!-- 入场动画 -->
    <transition name="fade">
      <div v-if="showAnimation" class="animation-container">
        <img :src="gifUrl" alt="Loading..." class="gif-image" />
      </div>
    </transition>

    <!-- 页面内容 -->
    <transition name="fade">
      <div v-if="!showAnimation" class="content">
        <h1>欢迎来到我的页面！</h1>
        <p>这是一个带有入场动画的页面。</p>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAnimation: true,
      gifUrl: ''
      // gifUrl: require('@/assets/phonegif.gif'),
    };
  },
  mounted() {
    // 动态加载 GIF
    import('@/assets/phonegif.gif').then((module) => {
      this.gifUrl = module.default;
    });
    setTimeout(() => {
      this.showAnimation = false;
    }, 3000);
  },
};
</script>

<style scoped>
.page-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.animation-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.gif-image {
  width: 200px;
  height: 200px;
}

.content {
  text-align: center;
}

/* 过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>