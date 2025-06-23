<template>
  <div class="echart-box">
    <div class="dashboard-container">
      <!-- 风险等级分布饼图 -->
      <div class="report-card half-width">
        <h2 class="card-title">风险等级用户分布</h2>
        <div id="riskPieChart" class="chart-container"></div>
      </div>

      <!-- 风险金额分布柱状图 -->
      <div class="report-card half-width">
        <h2 class="card-title">风险金额分布（万元）</h2>
        <div id="amountBarChart" class="chart-container"></div>
      </div>

      <!-- 催缴成效TOP10 -->
      <div class="report-card half-width">
        <h2 class="card-title">本月催缴成效TOP10</h2>
        <table class="ranking-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>催收员</th>
              <th>回收金额</th>
              <th>完成率</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="rank-1">1</td>
              <td>张伟</td>
              <td class="amount">1,258,900</td>
              <td>98%</td>
            </tr>
            <tr>
              <td class="rank-2">2</td>
              <td>李娜</td>
              <td class="amount">987,600</td>
              <td>95%</td>
            </tr>
            <tr>
              <td class="rank-3">3</td>
              <td>王芳</td>
              <td class="amount">856,300</td>
              <td>93%</td>
            </tr>
            <tr>
              <td>4</td>
              <td>赵强</td>
              <td class="amount">745,200</td>
              <td>90%</td>
            </tr>
            <tr>
              <td>5</td>
              <td>刘洋</td>
              <td class="amount">689,100</td>
              <td>88%</td>
            </tr>
            <tr>
              <td>6</td>
              <td>陈晨</td>
              <td class="amount">567,800</td>
              <td>85%</td>
            </tr>
            <tr>
              <td>7</td>
              <td>杨光</td>
              <td class="amount">498,700</td>
              <td>82%</td>
            </tr>
            <tr>
              <td>8</td>
              <td>周雪</td>
              <td class="amount">432,500</td>
              <td>80%</td>
            </tr>
            <tr>
              <td>9</td>
              <td>吴迪</td>
              <td class="amount">398,200</td>
              <td>78%</td>
            </tr>
            <tr>
              <td>10</td>
              <td>郑爽</td>
              <td class="amount">356,900</td>
              <td>75%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 片区回收率对比雷达图 -->
      <div class="report-card half-width">
        <h2 class="card-title">片区回收能力对比</h2>
        <div id="recoveryRadarChart" class="chart-container"></div>
      </div>

      <!-- 高风险用户回收率对比柱状图 -->
      <div class="report-card full-width">
        <h2 class="card-title">各片区高风险用户回收率对比</h2>
        <div id="recoveryBarChart" class="chart-container" style="height: 450px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  data() {
    return {
        riskPieChart:null,
        amountBarChart:null,
        recoveryRadarChart:null,
        recoveryBarChart:null
    };
  },
  mounted() {
    this.initChart();
    this.initChart2();
    this.initChart3();
    this.initChart4();
  },
  beforeDestroy() {
    if (this.riskChart) this.riskChart.dispose();
    if (this.amountBarChart) this.amountBarChart.dispose();
    if (this.recoveryRadarChart) this.recoveryRadarChart.dispose();
    if (this.recoveryBarChart) this.recoveryBarChart.dispose();
  },
  methods: {
    initChart() {
      // 初始化所有图表
      const riskPieChart = echarts.init(document.getElementById('riskPieChart'));
      const amountBarChart = echarts.init(document.getElementById('amountBarChart'));
      const recoveryRadarChart = echarts.init(document.getElementById('recoveryRadarChart'));
      const recoveryBarChart = echarts.init(document.getElementById('recoveryBarChart'));

      // 风险等级分布饼图配置
      const riskPieOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            // color: '#fff'
          }
        },
        color: ['#C23531', '#2F4554', '#61A0A8'],
        series: [
          {
            name: '风险等级分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#0a1a35',
              borderWidth: 0
            },
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)'
              // color: '#fff'
            },
            emphasis: {
              label: {
                show: true,
                // fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: [
              { value: 1542, name: '高风险' },
              { value: 3568, name: '中风险' },
              { value: 8921, name: '低风险' }
            ],
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      };

      // 风险金额分布柱状图配置
      const amountBarOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}<br/>金额: {c} 万元'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['高风险', '中风险', '低风险'],
          axisLine: {
            lineStyle: {
              color: '#7d8ba6'
            }
          },
          axisLabel: {
            color: '#000'
          }
        },
        yAxis: {
          type: 'value',
          name: '金额（万元）',
          nameTextStyle: {
            color: '#7d8ba6'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(125, 139, 166, 0.2)'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#7d8ba6'
            }
          },
          axisLabel: {
            color: '#000'
          }
        },
        series: [
          {
            name: '风险金额',
            type: 'bar',
            barWidth: '40%',
            data: [5820, 3260, 1580],
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
              normal: {
                color: function (params) {
                  //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                  var colorList = ['#C23531', '#2F4554', '#61A0A8'];
                  return colorList[params.dataIndex];
                }
              }
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c} 万',
              color: '#fff'
            },
            animationDelay: function (idx) {
              return idx * 100;
            }
          }
        ],
        animationEasing: 'elasticOut'
      };

      // 片区回收能力雷达图配置
      const recoveryRadarOption = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          data: ['回收金额', '回收率'],
          textStyle: {
            // color: '#fff'
          },
          bottom: 0
        },
        radar: {
          indicator: [
            { name: '华东', max: 100 },
            { name: '华北', max: 100 },
            { name: '华南', max: 100 },
            { name: '华中', max: 100 },
            { name: '西南', max: 100 },
            { name: '西北', max: 100 }
          ],
          radius: '65%',
          axisName: {
            color: '#7d8ba6'
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(125, 139, 166, 0.3)'
            }
          },
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(125, 139, 166, 0.3)'
            }
          }
        },
        series: [
          {
            name: '片区回收能力',
            type: 'radar',
            data: [
              {
                value: [82, 65, 78, 71, 68, 59],
                name: '回收金额',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                  width: 2,
                  color: '#00f0ff'
                },
                areaStyle: {
                  color: 'rgba(0, 240, 255, 0.2)'
                },
                itemStyle: {
                  color: '#00f0ff'
                }
              },
              {
                value: [78, 65, 82, 71, 68, 59],
                name: '回收率',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                  width: 2,
                  color: '#ff2d75'
                },
                areaStyle: {
                  color: 'rgba(255, 45, 117, 0.2)'
                },
                itemStyle: {
                  color: '#ff2d75'
                }
              }
            ]
          }
        ]
      };

      // 高风险用户回收率对比柱状图配置
      const recoveryBarOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}<br/>回收率: {c}%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['华东', '华北', '华南', '华中', '西南', '西北', '东北'],
          axisLine: {
            lineStyle: {
              color: '#7d8ba6'
            }
          },
          axisLabel: {
            color: '#000',
            rotate: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '回收率(%)',
          nameTextStyle: {
            color: '#7d8ba6'
          },
          min: 50,
          max: 100,
          splitLine: {
            lineStyle: {
              color: 'rgba(125, 139, 166, 0.2)'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#7d8ba6'
            }
          },
          axisLabel: {
            color: '#000',
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: '回收率',
            type: 'bar',
            barWidth: '40%',
            data: [
              {
                value: 78,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00f0ff' },
                    { offset: 1, color: '#1a5cb8' }
                  ])
                }
              },
              {
                value: 65,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00f0ff' },
                    { offset: 1, color: '#1a5cb8' }
                  ])
                }
              },
              {
                value: 82,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00f0ff' },
                    { offset: 1, color: '#1a5cb8' }
                  ])
                }
              },
              {
                value: 71,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00f0ff' },
                    { offset: 1, color: '#1a5cb8' }
                  ])
                }
              },
              {
                value: 68,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00f0ff' },
                    { offset: 1, color: '#1a5cb8' }
                  ])
                }
              },
              {
                value: 59,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00f0ff' },
                    { offset: 1, color: '#1a5cb8' }
                  ])
                }
              },
              {
                value: 63,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00f0ff' },
                    { offset: 1, color: '#1a5cb8' }
                  ])
                }
              }
            ],
            itemStyle: {
              borderRadius: [5, 5, 0, 0]
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%',
              color: '#fff'
            },
            animationDelay: function (idx) {
              return idx * 100;
            }
          }
        ],
        animationEasing: 'elasticOut'
      };

      // 应用配置
      riskPieChart.setOption(riskPieOption);
      amountBarChart.setOption(amountBarOption);
      recoveryRadarChart.setOption(recoveryRadarOption);
      recoveryBarChart.setOption(recoveryBarOption);

      // 窗口大小变化时重新调整图表大小
      window.addEventListener('resize', function () {
        riskPieChart.resize();
        amountBarChart.resize();
        recoveryRadarChart.resize();
        recoveryBarChart.resize();
      });
    }
  }
};
</script>
<style scoped>
.echart-box {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background-color: #f5f5f5;
  color: #606266;
  margin: 0;
  padding: 20px;
  overflow-x: hidden;
}

.amountBarChart .axisLabel,
.recoveryBarChart .axisLabel {
  color: #333; /* 设置为深灰色，与白色背景形成对比 */
}

.dashboard-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  max-width: 1600px;
  margin: 0 auto;
}

.report-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.report-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #409eff;
}

.report-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.4rem;
  margin: 0 0 20px 0;
  color: #409eff;
  display: flex;
  align-items: center;
}

.card-title::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 20px;
  background: #409eff;
  margin-right: 10px;
  border-radius: 4px;
}

.chart-container {
  width: 100%;
  height: 350px;
}

.full-width {
  grid-column: 1 / -1;
}

.half-width {
  grid-column: span 1;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.ranking-table th {
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  color: #606266;
  font-weight: normal;
  border-bottom: 1px solid #dcdfe6;
}

.ranking-table td {
  padding: 12px;
  border-bottom: 1px solid #dcdfe6;
}

.ranking-table tr:hover {
  background: #ecf5ff;
}

.rank-1 {
  color: #ffd700; /* 金色 */
  font-weight: bold;
}

.rank-2 {
  color: #c0c0c0; /* 银色 */
  font-weight: bold;
}

.rank-3 {
  color: #cd7f32; /* 铜色 */
  font-weight: bold;
}

.amount {
  font-family: 'Courier New', monospace;
  color: #409eff;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
  }
}

@media (max-width: 1200px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
}
</style>