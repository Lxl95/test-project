<template>
  <div class="container">
    <!-- 顶部标题栏 -->
    <div class="header">
      <h1>工程项目管理</h1>
      <p>{{ nowDate }}</p>
    </div>

    <!-- 顶部数据卡片 -->
    <div class="top-card">
      <div class="card-item" v-for="(item, idx) in topData" :key="idx">
        <p class="num">{{ item.num }}</p>
        <p class="label">{{ item.label }}</p>
      </div>
    </div>

    <!-- 表格：标题+下拉同行 -->
    <el-card class="table-card" shadow="hover">
      <div class="table-header-row">
        <div class="card-title small-title">
          <i class="el-icon-menu"></i> 工程项目列表
        </div>
        <el-select
          v-model="activeStage"
          size="mini"
          placeholder="选择阶段"
          style="width:120px;"
        >
          <el-option label="全部项目" value="all" />
          <el-option label="设计阶段" value="design" />
          <el-option label="施工阶段" value="construct" />
          <el-option label="验收阶段" value="check" />
          <el-option label="筹备阶段" value="prepare" />
          <el-option label="竣工阶段" value="complete" />
        </el-select>
      </div>

      <!-- 表格绑定悬浮/点击事件 -->
      <el-table
        :data="tableData"
        size="mini"
        max-height="220"
        border
        style="width:100%;margin-top:10px;"
        @mouseenter="pauseScroll"
        @mouseleave="restartScrollDelay"
        @row-click="pauseScroll"
      >
        <el-table-column prop="name" label="项目名称" min-width="110" />
        <el-table-column prop="stage" label="项目阶段" width="88" />
        <el-table-column prop="num" label="工程数量" width="70" />
        <el-table-column prop="status" label="状态" width="70">
          <template slot-scope="scope">
            <span :class="scope.row.status === '已完成' ? 'status-green' : 'status-blue'">
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 工程类型统计 -->
    <el-card class="chart-card" shadow="hover">
      <div class="card-title small-title">
        <i class="el-icon-s-data"></i> 工程类型统计
      </div>
      <div id="chartType" class="chart-box small-chart"></div>
    </el-card>

    <!-- 待办任务统计 -->
    <el-card class="chart-card" shadow="hover">
      <div class="card-title small-title">
        <i class="el-icon-s-data"></i> 待办任务统计
      </div>
      <div id="chartTodo" class="chart-box pie-box"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'ProjectApp',
  data() {
    return {
      nowDate: '',
      activeStage: 'all',
      topData: [],
      projectTableList: [],
      projectTypeData: {
        types: [],
        counts: []
      },
      todoData: [],
      chartTypeInstance: null,
      chartTodoInstance: null,
      scrollTimer: null,
      delayTimer: null,
      isScrolling: true
    }
  },
  computed: {
    tableData() {
      if (this.activeStage === 'all') return this.projectTableList
      return this.projectTableList.filter(item => item.stageType === this.activeStage)
    }
  },
  created() {
    this.getNowDate()
  },
  mounted() {
    this.getDataFromApi()
    window.addEventListener('resize', this.resizeChart)
    this.startTableScroll()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)
    this.chartTypeInstance?.dispose()
    this.chartTodoInstance?.dispose()
    clearInterval(this.scrollTimer)
    clearTimeout(this.delayTimer)
  },
  methods: {
    // 自动获取日期星期
    getNowDate() {
      const week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
      const date = new Date()
      const y = date.getFullYear()
      const m = String(date.getMonth()+1).padStart(2,'0')
      const d = String(date.getDate()).padStart(2,'0')
      this.nowDate = `${y}年${m}月${d}日 ${week[date.getDay()]}`
    },

    // 开启表格自动滚动
    startTableScroll() {
      this.isScrolling = true
      clearInterval(this.scrollTimer)
      this.scrollTimer = setInterval(() => {
        const tableWrap = document.querySelector('.el-table__body-wrapper')
        if(!tableWrap) return
        if(tableWrap.scrollTop >= tableWrap.scrollHeight - tableWrap.clientHeight){
          tableWrap.scrollTop = 0
        }else{
          tableWrap.scrollTop += 1
        }
      }, 80)
    },

    // 暂停滚动
    pauseScroll() {
      this.isScrolling = false
      clearInterval(this.scrollTimer)
      clearTimeout(this.delayTimer)
    },

    // 10秒后恢复滚动
    restartScrollDelay() {
      clearTimeout(this.delayTimer)
      this.delayTimer = setTimeout(() => {
        this.startTableScroll()
      }, 10000)
    },

    // 接口获取数据
    async getDataFromApi() {
      const res = {
        topData: [
          { num: '1836', label: '工程总数' },
          { num: '1026', label: '已完成' },
          { num: '810', label: '进行中' },
        ],
        projectTableList: [
          { name: '燃气管道改造工程', stage: '设计阶段', stageType: 'design', num: 126, status: '进行中' },
          { name: '小区燃气入户安装', stage: '施工阶段', stageType: 'construct', num: 328, status: '已完成' },
          { name: '商业综合体燃气配套', stage: '施工阶段', stageType: 'construct', num: 186, status: '进行中' },
          { name: '老旧管网更新项目', stage: '验收阶段', stageType: 'check', num: 215, status: '已完成' },
          { name: '工业园区燃气工程', stage: '设计阶段', stageType: 'design', num: 98, status: '进行中' },
          { name: '市政燃气主干管铺设', stage: '施工阶段', stageType: 'construct', num: 266, status: '进行中' },
          { name: '学校燃气配套改造', stage: '验收阶段', stageType: 'check', num: 112, status: '已完成' },
          { name: '乡镇燃气普及工程', stage: '筹备阶段', stageType: 'prepare', num: 145, status: '待启动' },
          { name: '高层住宅燃气安装', stage: '竣工阶段', stageType: 'complete', num: 145, status: '已完成' },
        ],
        projectTypeData: {
          types: ['住宅工程','商业工程','市政工程','工业园区','老旧小区','学校工程','医院工程','乡镇燃气','高层住宅'],
          counts: [285, 168, 210, 132, 198, 96, 78, 144, 126]
        },
        todoData: [
          { name: '设计任务', value: 42 },
          { name: '施工任务', value: 76 },
          { name: '技术交底', value: 28 },
          { name: '图纸会审', value: 19 },
          { name: '工序验收', value: 35 },
          { name: '竣工验收', value: 22 }
        ]
      }
      this.topData = res.topData
      this.projectTableList = res.projectTableList
      this.projectTypeData = res.projectTypeData
      this.todoData = res.todoData

      this.$nextTick(() => {
        this.initProjectTypeChart()
        this.initTodoChart()
      })
    },

    resizeChart() {
      this.chartTypeInstance?.resize()
      this.chartTodoInstance?.resize()
    },

    // 工程类型柱状图
    initProjectTypeChart() {
      const colors = ['#5B8FF9','#61DDAA','#F6BD16','#7262fd','#78D3F8','#9661BC','#F6903D','#008680','#F08BB4']
      this.chartTypeInstance = echarts.init(document.getElementById('chartType'))
      this.chartTypeInstance.setOption({
        tooltip: { trigger: 'axis' },
        legend: { show: false },
        grid: { left: '8%', right: '3%', bottom: '18%', top: '12%', containLabel: true },
        xAxis: {
          type: 'category',
          data: this.projectTypeData.types,
          axisLabel: { fontSize: 10, rotate: 35 }
        },
        yAxis: {
          type: 'value',
          name: '工程数量',
          nameGap: 15,
          nameTextStyle: { fontSize: 11 }
        },
        series: [{
          name: '工程数量',
          type: 'bar',
          barWidth: '50%',
          data: this.projectTypeData.counts,
          itemStyle: {
            color: params => colors[params.dataIndex % colors.length]
          }
        }]
      })
    },

    // 待办饼图
    initTodoChart() {
      const colors = ['#5B8FF9','#61DDAA','#F6BD16','#7262fd','#78D3F8','#9661BC']
      this.chartTodoInstance = echarts.init(document.getElementById('chartTodo'))
      this.chartTodoInstance.setOption({
        tooltip: { trigger: 'item', formatter: '{b}：{c}个\n占比：{d}%' },
        legend: {
          top: 5,
          left: 'center',
          orient: 'horizontal',
          type: 'scroll',
          width: '95%',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: { fontSize: 11 }
        },
        series: [{
          name: '待办任务',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '52%'],
          label: {
            fontSize: 10,
            formatter: '{b}\n{c}个 {d}%'
          },
          data: this.todoData.map((item, idx) => ({
            name: item.name,
            value: item.value,
            itemStyle: { color: colors[idx] }
          }))
        }]
      })
    }
  }
}
</script>

<style scoped>
.container {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 0 10px 20px;
  box-sizing: border-box;
}
* {
  box-sizing: border-box;
}
.header {
  background: linear-gradient(to right, #3b89e8, #52a0ff);
  color: #fff;
  padding: 16px 14px;
  border-radius: 0 0 10px 10px;
  margin: 0 -10px 10px;
}
/* 全局主标题缩小2号字体 */
.header h1 {
  margin: 0;
  font-size: 18px;
}
.header p {
  margin: 6px 0 0;
  font-size: 13px;
  opacity: 0.9;
}
.top-card {
  display: flex;
  background: #fff;
  padding: 14px 0;
  border-radius: 8px;
  margin-bottom: 10px;
}
.card-item {
  flex: 1;
  text-align: center;
}
.num {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}
.label {
  margin: 4px 0 0;
  color: #666;
  font-size: 12px;
}
.table-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
/* 卡片小标题统一缩小2字号 */
.card-title {
  font-size: 13px;
  font-weight: bold;
  margin: 0;
}
.table-card {
  margin: 10px 0;
  border-radius: 8px;
}
::v-deep .el-table--mini td,
::v-deep .el-table--mini th {
  padding: 6px 0;
  font-size: 12px;
}
.status-blue { color: #409eff; font-size: 12px; }
.status-green { color: #67c23a; font-size: 12px; }
.chart-card {
  margin: 10px 0;
  border-radius: 8px;
}
.chart-box { width: 100%; }
.small-chart { height: 220px; }
.pie-box { height: 240px; }
</style>