<template>
  <div class="attendance-wrapper">
    <!-- 1. 顶部标题 -->
    <!-- <div class="header">工程考勤签到</div> -->

    <!-- 2. 打卡主卡片 -->
    <div class="card check-card">
      <div class="check-title">今日打卡</div>
      <div class="rule-desc">
        打卡规则：{{ checkMode === 'once' ? '一天打卡一次' : '一天打卡两次（上班、下班）' }}，
        灵活打卡
      </div>
      <el-button
        type="primary"
        size="medium"
        class="check-btn"
        @click="handleCheck"
        :loading="loading"
      >
        {{ checkBtnText }}
      </el-button>
    </div>

    <!-- 3. 今日打卡记录 -->
    <div class="card today-record">
      <div class="card-title">今日打卡记录</div>
      <div class="record-item" v-if="todayList.length">
        <div v-for="(item, idx) in todayList" :key="idx" class="record-row">
          <span class="type">{{ item.type }}</span>
          <span class="time">{{ item.checkTime }}</span>
          <span class="status" :class="item.status">{{ item.status }}</span>
        </div>
      </div>
      <div class="empty" v-else>暂无今日打卡记录</div>
    </div>

    <!-- 4. 历史打卡记录 + 筛选 -->
    <div class="card history-record">
      <div class="card-title">历史打卡记录</div>
      <el-tabs v-model="tabActive" class="tab-filter">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="准时" name="准时" />
        <el-tab-pane label="迟到" name="迟到" />
        <el-tab-pane label="未签到" name="未签到" />
      </el-tabs>

      <div class="list-container">
        <div class="list-item" v-for="(item, idx) in filterHistoryList" :key="idx">
          <div class="left">
            <div class="name">{{ item.userName }}</div>
            <div class="date">{{ item.date }}</div>
          </div>
          <div class="right">
            <span class="status" :class="item.status">{{ item.status }}</span>
          </div>
        </div>
        <div class="empty" v-if="filterHistoryList.length === 0">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Attendance',
  data() {
    return {
      // 打卡模式：once一天一次 / twice一天两次
      checkMode: 'twice',
      loading: false,
      tabActive: 'all',
      // 今日打卡记录
      todayList: [],
      // 历史打卡记录
      historyList: [
        { date: '2025-12-19', userName: '柴忠帅', status: '未签到' },
        { date: '2025-12-18', userName: '柴忠帅', status: '未签到' },
        { date: '2025-12-17', userName: '柴忠帅', status: '迟到' },
        { date: '2025-12-16', userName: '柴忠帅', status: '准时' },
        { date: '2025-12-15', userName: '柴忠帅', status: '准时' },
      ]
    }
  },
  computed: {
    // 打卡按钮文字
    checkBtnText() {
      if (this.checkMode === 'once') {
        return this.todayList.length ? '今日已打卡' : '点击打卡'
      }
      // 一天两次
      const hasWork = this.todayList.some(i => i.type === '上班打卡')
      const hasOff = this.todayList.some(i => i.type === '下班打卡')
      if (hasWork && hasOff) return '今日已完成打卡'
      if (!hasWork) return '上班打卡'
      return '下班打卡'
    },
    // 筛选历史记录
    filterHistoryList() {
      if (this.tabActive === 'all') return this.historyList
      return this.historyList.filter(i => i.status === this.tabActive)
    }
  },
  methods: {
    // 打卡操作
    async handleCheck() {
      this.loading = true
      try {
        const now = new Date()
        const h = now.getHours()
        const time = now.toLocaleTimeString()
        const date = now.toLocaleDateString().replace(/\//g, '-')

        // 一天一次打卡
        if (this.checkMode === 'once') {
          if (this.todayList.length) {
            this.$message.info('今日已打卡，无需重复操作')
            return
          }
          this.todayList.push({
            type: '每日打卡',
            checkTime: time,
            status: h <= 9 ? '准时' : '迟到'
          })
        }

        // 一天两次打卡
        else {
          const hasWork = this.todayList.some(i => i.type === '上班打卡')
          const hasOff = this.todayList.some(i => i.type === '下班打卡')
          
          if (hasWork && hasOff) {
            this.$message.info('今日已完成两次打卡')
            return
          }

          // 上班打卡
          if (!hasWork) {
            this.todayList.push({
              type: '上班打卡',
              checkTime: time,
              status: h <= 9 ? '准时' : '迟到'
            })
          }
          // 下班打卡
          else {
            this.todayList.push({
              type: '下班打卡',
              checkTime: time,
              status: h >= 18 ? '准时' : '早退'
            })
          }
        }

        this.$message.success('打卡成功')
      } catch (err) {
        this.$message.error('打卡失败')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* 整体页面 */
.attendance-wrapper {
  padding: 15px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 标题 */
.header {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
}

/* 卡片通用 */
.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 打卡卡片 */
.check-card {
  text-align: center;
}
.check-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}
.rule-desc {
  font-size: 13px;
  color: #666;
  margin-bottom: 18px;
  line-height: 1.5;
}
.check-btn {
  width: 160px;
  border-radius: 20px;
}

/* 卡片标题 */
.card-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

/* 今日记录 */
.record-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f2f2f2;
  font-size: 14px;
}
.record-row:last-child {
  border-bottom: none;
}
.type {
  color: #333;
  width: 80px;
}
.time {
  flex: 1;
  text-align: center;
  color: #666;
}
.status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}
.status.准时 {
  color: #00c48c;
  background: #e6fffa;
}
.status.迟到 {
  color: #ff7d00;
  background: #fff7e6;
}
.status.未签到 {
  color: #ff4d4f;
  background: #fff1f0;
}
.status.早退 {
  color: #1890ff;
  background: #e6f7ff;
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 20px 0;
  color: #999;
  font-size: 13px;
}

/* 筛选标签 */
.tab-filter {
  margin-bottom: 12px;
}

/* 历史列表 */
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f7f8fa;
}
.left .name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}
.left .date {
  font-size: 12px;
  color: #999;
}
.right .status {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 4px;
}
</style>