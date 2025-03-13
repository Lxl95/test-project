<template>
  <div id="myEchart"></div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts-wordcloud';

export default {
  data() {
    return {
      image:
        'data:image/png;base64,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'
    };
  },
  mounted() {
    this.initEchart();
  },
  methods: {
    initEchart() {
      const echartDom = document.getElementById('myEchart');
      const myChart = echarts.init(echartDom);
      var maskImage = new Image();
      maskImage.src = this.image;
      const option = {
        series: [
          {
            type: 'wordCloud',
            shape: 'circle',// 默认形状（会被 maskImage 覆盖）
            keepAspect: false,
            // maskImage: maskImage, // 自定义形状图片
            left: 'center',
            top: 'center',
            width: '100%',
            height: '90%',
            right: null,
            bottom: null,
            sizeRange: [12, 60], // 字体大小范围
            rotationRange: [-90, 90], // 旋转角度范围
            rotationStep: 45, // 旋转步长
            gridSize: 8, // 网格大小
            drawOutOfBound: false, // 是否允许词语超出画布
            layoutAnimation: true,
            textStyle: {
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              color: function () {
                return 'rgb(' + [Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',') + ')';
              }
            },
            emphasis: {
              // focus: 'self',
              textStyle: {
                textShadowBlur: 3,
                textShadowColor: '#333'
              }
            },
            //data属性中的value值却大，权重就却大，展示字体就却大
            data: [
              { name: 'Farrah', value: 366 },
              { name: '汽车', value: 900 },
              { name: '视频', value: 606 },
              { name: '视频1', value: 570 },
              { name: '视频2', value: 134 },
              { name: '视频3', value: 1567 },
              { name: '视频4', value: 89 },
              { name: '视频5', value: 780 },
              { name: '视频6', value: 564 },
              { name: '视频7', value: 320 },
              { name: '视频8', value: 880 },
              { name: 'Vue', value: 100 },
              { name: 'JavaScript', value: 80 },
              { name: 'ECharts', value: 60 },
              { name: '前端开发', value: 50 },
              { name: '数据可视化', value: 40 },
              { name: 'Canvas', value: 30 },
              { name: 'HTML', value: 20 },
              { name: 'CSS', value: 10 }
            ]
          }
        ]
      };
      option && myChart.setOption(option);

      //随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    }
  }
};
</script>

<style>
#myEchart {
  height: 300px;
  width: 300px;
}
</style>
