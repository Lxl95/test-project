<template>
  <div class="log-container">
    <!-- 顶部查询类型切换 -->
    <div class="query-type-header">
      <div 
        v-for="item in queryTypes" 
        :key="item.value"
        class="type-tab"
        :class="{ active: queryType === item.value }"
        @click="switchQueryType(item.value)"
      >
        {{ item.label }}
      </div>
    </div>

    <!-- 查询条件区域 -->
    <div class="query-conditions">
      <el-form :model="queryParams" ref="queryForm" label-width="0px">
        <!-- 按人员查询的条件 -->
        <div v-if="queryType === 'person'">
          <el-form-item prop="personName" class="form-item">
            <el-select 
              v-model="queryParams.personId" 
              filterable 
              clearable
              placeholder="请选择人员"
              class="full-width"
            >
              <el-option
                v-for="item in personList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- 按工程查询的条件 -->
        <div v-else>
          <el-form-item prop="projectName" class="form-item">
            <el-select 
              v-model="queryParams.projectId" 
              filterable 
              clearable
              placeholder="请选择工程"
              class="full-width"
            >
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- 通用查询条件 -->
        <el-form-item prop="logLevel" class="form-item">
          <el-select 
            v-model="queryParams.logLevel" 
            clearable
            placeholder="日志级别"
            class="full-width"
          >
            <el-option
              v-for="item in logLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="dateRange" class="form-item">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="full-width"
          ></el-date-picker>
        </el-form-item>

        <el-form-item prop="keyword" class="form-item keyword-item">
          <el-input
            v-model="queryParams.keyword"
            placeholder="关键词搜索"
            clearable
            class="full-width"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button 
          type="primary" 
          icon="el-icon-search" 
          @click="handleSearch"
          class="btn-search"
        >
          查询
        </el-button>
        <el-button 
          icon="el-icon-refresh" 
          @click="handleReset"
          class="btn-reset"
        >
          重置
        </el-button>
        <el-button 
          type="warning" 
          icon="el-icon-download" 
          @click="handleExport"
          :loading="exportLoading"
          class="btn-export"
        >
          导出
        </el-button>
      </div>
    </div>

    <!-- 日志列表 -->
    <div class="log-list">
      <el-card 
        v-for="(log, index) in logList" 
        :key="log.id"
        shadow="never"
        class="log-card"
        @click.native="showLogDetail(log)"
      >
        <div class="log-content">
          <div class="log-header">
            <span class="log-level" :class="getLogLevelClass(log.level)">
              {{ getLogLevelLabel(log.level) }}
            </span>
            <span class="log-time">{{ log.createTime }}</span>
          </div>
          <div class="log-body">
            <p class="log-title">{{ log.title || '无标题' }}</p>
            <p class="log-message">{{ log.message | truncateText }}</p>
          </div>
          <div class="log-footer">
            <span class="operator">
              <i class="el-icon-user"></i> {{ log.operatorName || '未知' }}
            </span>
            <span class="source">
              <i class="el-icon-location-outline"></i> {{ log.source || '未知来源' }}
            </span>
          </div>
        </div>
      </el-card>

      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore">
        <el-button type="text" @click="loadMore" :loading="loading">
          {{ loading ? '加载中...' : '加载更多' }}
        </el-button>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-if="!loading && !logList.length">
        <i class="el-icon-document-remove"></i>
        <p>暂无日志记录</p>
      </div>
    </div>

    <!-- 日志详情弹窗 -->
    <el-drawer
      title="日志详情"
      :visible.sync="detailVisible"
      direction="rtl"
      size="90%"
      :before-close="closeDetail"
      class="detail-drawer"
    >
      <div class="detail-content">
        <el-descriptions title="" :column="1" border>
          <el-descriptions-item label="日志ID">{{ detailData.id }}</el-descriptions-item>
          <el-descriptions-item label="日志级别">
            <el-tag :type="getLogLevelType(detailData.level)" size="small">
              {{ getLogLevelLabel(detailData.level) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ detailData.createTime }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ detailData.operatorName || '未知' }}</el-descriptions-item>
          <el-descriptions-item label="来源">{{ detailData.source || '未知' }}</el-descriptions-item>
          <el-descriptions-item label="模块">{{ detailData.module || '未知' }}</el-descriptions-item>
          <el-descriptions-item label="操作类型">{{ detailData.operationType || '其他' }}</el-descriptions-item>
        </el-descriptions>

        <h3 class="detail-section-title">请求参数</h3>
        <pre class="code-block">{{ detailData.requestParams }}</pre>

        <h3 class="detail-section-title">响应结果</h3>
        <pre class="code-block">{{ detailData.responseResult }}</pre>

        <h3 class="detail-section-title">日志消息</h3>
        <p style="white-space: pre-wrap; word-break: break-all;">
          {{ detailData.message || '无消息内容' }}
        </p>

        <h3 class="detail-section-title">异常信息（如有）</h3>
        <pre class="code-block" v-if="detailData.exception">{{ detailData.exception }}</pre>
        <p v-else>无异常信息</p>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'LogQuery',
  data() {
    return {
      // 查询类型：person / project
      queryType: 'person',
      queryTypes: [
        { label: '按人员查询', value: 'person' },
        { label: '按工程查询', value: 'project' }
      ],
      
      // 查询参数
      queryParams: {
        personId: '',
        projectId: '',
        logLevel: '',
        keyword: '',
        dateRange: []
      },
      
      // 下拉选项
      logLevelOptions: [
        { label: 'DEBUG', value: 'DEBUG' },
        { label: 'INFO', value: 'INFO' },
        { label: 'WARN', value: 'WARN' },
        { label: 'ERROR', value: 'ERROR' }
      ],
      personList: [
        { id: '1', name: '张三' },
        { id: '2', name: '李四' },
        { id: '3', name: '王五' }
      ],
      projectList: [
        { id: '1', name: '工程项目A' },
        { id: '2', name: '工程项目B' },
        { id: '3', name: '工程项目C' }
      ],
      
      // 日志列表
      logList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      hasMore: false,
      loading: false,
      exportLoading: false,
      
      // 详情弹窗
      detailVisible: false,
      detailData: {}
    }
  },
  filters: {
    truncateText(text) {
      if (!text) return ''
      return text.length > 50 ? text.substring(0, 50) + '...' : text
    }
  },
  created() {
    this.initQueryParams()
    this.searchLogs()
  },
  methods: {
    // 初始化查询参数
    initQueryParams() {
      const now = new Date()
      const startDate = new Date(now.setHours(0, 0, 0, 0))
      const endDate = new Date(now.setHours(23, 59, 59, 999))
      this.queryParams.dateRange = [startDate, endDate]
    },
    
    // 切换查询类型
    switchQueryType(type) {
      if (this.queryType === type) return
      this.queryType = type
      this.handleReset()
      this.searchLogs()
    },
    
    // 查询
    handleSearch() {
      this.currentPage = 1
      this.searchLogs()
    },
    
    // 重置
    handleReset() {
      this.$refs.queryForm?.resetFields()
      this.initQueryParams()
    },
    
    // 导出
    async handleExport() {
      this.exportLoading = true
      try {
        // 模拟导出请求
        await new Promise(resolve => setTimeout(resolve, 2000))
        this.$message({
          message: '导出成功',
          type: 'success'
        })
      } catch (error) {
        this.$message({
          message: '导出失败',
          type: 'error'
        })
      } finally {
        this.exportLoading = false
      }
    },
    
    // 搜索日志
    searchLogs() {
      this.loading = true
      // 模拟接口请求
      setTimeout(() => {
        this.logList = this.generateMockLogs(10)
        this.total = 25
        this.hasMore = this.total > this.logList.length
        this.loading = false
      }, 800)
    },
    
    // 加载更多
    loadMore() {
      this.loading = true
      setTimeout(() => {
        const moreData = this.generateMockLogs(5)
        this.logList = [...this.logList, ...moreData]
        this.currentPage++
        this.hasMore = this.total > this.logList.length
        this.loading = false
      }, 1000)
    },
    
    // 生成模拟日志数据
    generateMockLogs(count) {
      const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR']
      const modules = ['系统管理', '用户中心', '订单管理', '财务模块', '报表统计']
      const operators = ['张三', '李四', '王五']
      const sources = ['Web端', 'APP端', '小程序', 'API接口']
      const operationTypes = ['新增', '修改', '删除', '查询', '登录', '导出']
      
      const messages = [
        '用户登录成功',
        '数据同步完成',
        '配置文件更新',
        '定时任务执行',
        '批量导入数据',
        '权限校验通过',
        '接口调用超时',
        '数据库连接异常',
        '缓存刷新成功',
        '文件上传完成'
      ]
      
      const logs = []
      const now = new Date()
      
      for (let i = 0; i < count; i++) {
        const randomDays = Math.floor(Math.random() * 7)
        const logTime = new Date(now - randomDays * 24 * 60 * 60 * 1000 - Math.random() * 24 * 60 * 60 * 1000)
        
        logs.push({
          id: `LOG${Date.now()}${i}`,
          level: levels[Math.floor(Math.random() * levels.length)],
          title: `${operationTypes[Math.floor(Math.random() * operationTypes.length)]}操作日志`,
          message: messages[Math.floor(Math.random() * messages.length)] + ` ${i + 1}`,
          createTime: logTime.toLocaleString('zh-CN'),
          operatorName: operators[Math.floor(Math.random() * operators.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          module: modules[Math.floor(Math.random() * modules.length)],
          operationType: operationTypes[Math.floor(Math.random() * operationTypes.length)],
          requestParams: JSON.stringify({
            param1: `value${i + 1}`,
            param2: Math.random() > 0.5 ? 'test' : null
          }, null, 2),
          responseResult: JSON.stringify({
            code: 200,
            message: 'success',
            data: { id: i + 1, status: '正常' }
          }, null, 2),
          exception: Math.random() > 0.7 ? 'java.lang.NullPointerException\n at com.example.service...' : null
        })
      }
      
      return logs
    },
    
    // 获取日志级别样式类
    getLogLevelClass(level) {
      const classMap = {
        DEBUG: 'debug',
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error'
      }
      return classMap[level] || 'info'
    },
    
    // 获取日志级别标签
    getLogLevelLabel(level) {
      const labelMap = {
        DEBUG: '调试',
        INFO: '信息',
        WARN: '警告',
        ERROR: '错误'
      }
      return labelMap[level] || level
    },
    
    // 获取日志级别Tag类型
    getLogLevelType(level) {
      const typeMap = {
        DEBUG: '',
        INFO: 'success',
        WARN: 'warning',
        ERROR: 'danger'
      }
      return typeMap[level] || ''
    },
    
    // 显示日志详情
    showLogDetail(log) {
      this.detailData = log
      this.detailVisible = true
    },
    
    // 关闭详情弹窗
    closeDetail() {
      this.detailVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.log-container {
  height: 100vh;
  background: #f5f6fa;
  display: flex;
  flex-direction: column;
}

/* 顶部查询类型切换 */
.query-type-header {
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 12px;
  gap: 10px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.type-tab {
  flex: 1;
  padding: 10px 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  background: transparent;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.type-tab.active {
  background: white;
  color: #667eea;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 查询条件区域 */
.query-conditions {
  background: white;
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 12px;
}

.keyword-item {
  margin-bottom: 0;
}

.full-width {
  width: 100%;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.btn-search {
  flex: 1;
}

.btn-reset {
  flex: 0 0 auto;
}

.btn-export {
  flex: 0 0 auto;
}

/* 日志列表 */
.log-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
}

.log-card {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.log-card:active {
  transform: scale(0.98);
}

.log-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.log-content {
  padding: 16px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.log-level {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.log-level.debug {
  background: #e3f2fd;
  color: #1976d2;
}

.log-level.info {
  background: #e8f5e9;
  color: #388e3c;
}

.log-level.warn {
  background: #fff3e0;
  color: #f57c00;
}

.log-level.error {
  background: #ffebee;
  color: #d32f2f;
}

.log-time {
  font-size: 12px;
  color: #999;
}

.log-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.log-message {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.log-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.operator, .source {
  font-size: 12px;
  color: #888;
}

.operator i, .source i {
  margin-right: 4px;
}

/* 加载更多 */
.load-more {
  text-align: center;
  padding: 16px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
}

/* 详情弹窗 */
.detail-drawer {
  .el-drawer__body {
    padding: 16px;
  }
}

.detail-content {
  padding: 0 16px;
}

.detail-section-title {
  font-size: 16px;
  color: #333;
  margin: 20px 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.code-block {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  font-family: 'Consolas', monospace;
  font-size: 13px;
  color: #666;
  max-height: 200px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
