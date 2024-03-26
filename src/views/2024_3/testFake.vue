<template>
  <div ref="main" class="home">
    </br>
    <div>{{ fake.progress }}</div>
    </br>
    <el-progress :percentage="parseInt(fake.progress*100)" :format="format"></el-progress>
    </br></br>
    <el-button @click="start">开始</el-button>
    <el-button @click="stop">停止</el-button>
    </br></br>
    <el-button @click="close">关闭</el-button>
  </div>
</template>

<script>
import FakeProgress from "fake-progress";

export default {
  data() {
    return {
      fake: new FakeProgress({
        timeConstant : 6000,
        autoStart : true
      })
    };
  },
  methods:{
   format(percentage) {
        return percentage === 100 ? '完成' : `${percentage}%`;
      },
   start() {
    this.fake.start()
   },
    close() {
      this.fake.end()
    },
    stop() {
      this.fake.stop()
    }
  },
};
</script>

