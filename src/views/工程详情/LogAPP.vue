<!-- LogQuery.vue -->
<template>
  <div class="log-query-app">
    <!-- 顶部查询类型切换 -->
    <div class="query-type-tabs">
      <el-radio-group v-model="queryType" @change="handleQueryTypeChange">
        <el-radio-button label="person">按人员查询</el-radio-button>
        <el-radio-button label="project">按工程查询</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 查询条件区域 -->
    <div class="query-conditions">
      <el-form ref="queryForm" :model="queryParams" label-width="80px" label-position="top">
        <!-- 按人员查询的条件 -->
        <template v-if="queryType === 'person'">
          <el-form-item label="人员姓名">
            <el-input
              v-model="queryParams.personName"
              placeholder="请输入人员姓名"
              clearable
            />
          </el-form-item>
          <el-form-item label="部门">
            <el-select
              v-model="queryParams.department"
              placeholder="请选择部门"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="dept in departmentOptions"
                :key="dept.value"
                :label="dept.label"
                :value="dept.value"
              />
            </el-select>
          </el-form-item>
        </template>

        <!-- 按工程查询的条件 -->
        <template v-if="queryType === 'project'">
          <el-form-item label="工程名称">
            <el-input
              v-model="queryParams.projectName"
              placeholder="请输入工程名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="工程状态">
            <el-select
              v-model="queryParams.projectStatus"
              placeholder="请选择工程状态"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="status in projectStatusOptions"
                :key="status.value"
                :label="status.label"
                :value="status.value"
              />
            </el-select>
          </el-form-item>
        </template>

        <!-- 公共查询条件 -->
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="queryParams.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="操作类型">
          <el-select
            v-model="queryParams.operationType"
            placeholder="请选择操作类型"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="type in operationTypeOptions"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleQuery"
          :loading="queryLoading"
          class="query-btn"
        >
          查询
        </el-button>
        <el-button
          icon="el-icon-refresh"
          @click="handleReset"
          class="reset-btn"
        >
          重置
        </el-button>
        <el-button
          type="success"
          icon="el-icon-download"
          @click="handleExport"
          :loading="exportLoading"
          class="export-btn"
        >
          导出
        </el-button>
      </div>
    </div>

    <!-- 日志列表 -->
    <div class="log-list-container">
      <div class="list-header">
        <span class="total-count">共 {{ total }} 条记录</span>
        <el-button
          type="text"
          icon="el-icon-refresh"
          @click="refreshList"
          :loading="listLoading"
        />
      </div>

      <div class="log-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="noMoreData">
        <div
          v-for="log in logList"
          :key="log.id"
          class="log-item"
          @click="showLogDetail(log)"
        >
          <div class="log-item-header">
            <span class="log-title">{{ log.title }}</span>
            <span
              class="log-status"
              :class="`status-${log.status}`"
            >
              {{ getStatusText(log.status) }}
            </span>
          </div>
          
          <div class="log-item-content">
            <div class="log-info-row">
              <i class="el-icon-user"></i>
              <span>{{ log.operator }}</span>
            </div>
            <div class="log-info-row">
              <i class="el-icon-date"></i>
              <span>{{ log.operationTime }}</span>
            </div>
            <div class="log-info-row">
              <i class="el-icon-document"></i>
              <span class="log-desc">{{ log.description }}</span>
            </div>
          </div>
          
          <div class="log-item-footer">
            <span class="project-name" v-if="log.projectName">
              <i class="el-icon-office-building"></i>
              {{ log.projectName }}
            </span>
            <span class="operation-type">
              {{ log.operationType }}
            </span>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="listLoading" class="loading-more">
          <i class="el-icon-loading"></i>
          <span>加载中...</span>
        </div>
        
        <div v-if="noMoreData && logList.length > 0" class="no-more-data">
          <span>没有更多数据了</span>
        </div>
        
        <div v-if="logList.length === 0 && !listLoading" class="empty-list">
          <i class="el-icon-document"></i>
          <p>暂无数据</p>
        </div>
      </div>
    </div>

    <!-- 日志详情抽屉 -->
    <el-drawer
      title="日志详情"
      :visible.sync="detailVisible"
      direction="btt"
      size="90%"
      :with-header="false"
      custom-class="log-detail-drawer"
    >
      <log-detail
        :log-data="currentLog"
        @close="detailVisible = false"
      />
    </el-drawer>
  </div>
</template>

<script>
import LogDetail from './LogDetail.vue'

export default {
  name: 'LogQuery',
  components: {
    LogDetail
  },
  data() {
    return {
      queryType: 'person', // person 或 project
      queryParams: {
        personName: '',
        department: '',
        projectName: '',
        projectStatus: '',
        dateRange: [],
        operationType: ''
      },
      queryLoading: false,
      exportLoading: false,
      listLoading: false,
      logList: [],
      currentLog: null,
      detailVisible: false,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      departmentOptions: [
        { label: '技术部', value: 'tech' },
        { label: '工程部', value: 'project' },
        { label: '人事部', value: 'hr' },
        { label: '财务部', value: 'finance' }
      ],
      projectStatusOptions: [
        { label: '进行中', value: 'ongoing' },
        { label: '已完成', value: 'completed' },
        { label: '暂停', value: 'paused' }
      ],
      operationTypeOptions: [
        { label: '新增', value: 'add' },
        { label: '修改', value: 'update' },
        { label: '删除', value: 'delete' },
        { label: '查询', value: 'query' },
        { label: '导出', value: 'export' }
      ]
    }
  },
  computed: {
    total() {
      return this.pageInfo.total
    },
    noMoreData() {
      return this.logList.length >= this.pageInfo.total
    }
  },
  mounted() {
    this.loadLogList()
  },
  methods: {
    // 切换查询类型
    handleQueryTypeChange() {
      this.resetQueryParams()
      this.$nextTick(() => {
        this.loadLogList()
      })
    },

    // 重置查询参数
    resetQueryParams() {
      this.queryParams = {
        personName: '',
        department: '',
        projectName: '',
        projectStatus: '',
        dateRange: [],
        operationType: ''
      }
      this.pageInfo.pageNum = 1
    },

    // 查询
    async handleQuery() {
      this.pageInfo.pageNum = 1
      await this.loadLogList()
    },

    // 重置
    handleReset() {
      this.$refs.queryForm.resetFields()
      this.resetQueryParams()
      this.loadLogList()
    },

    // 导出
    async handleExport() {
      this.exportLoading = true
      try {
        // 这里调用导出API
        const params = {
          ...this.queryParams,
          queryType: this.queryType
        }
        
        // 模拟导出
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.$message.success('导出成功，开始下载文件')
        
        // 实际项目中可能需要这样处理
        // const response = await this.$axios.post('/api/logs/export', params, {
        //   responseType: 'blob'
        // })
        // const blob = new Blob([response.data])
        // const link = document.createElement('a')
        // link.href = URL.createObjectURL(blob)
        // link.download = `日志记录_${new Date().toISOString().slice(0,10)}.xlsx`
        // link.click()
        // URL.revokeObjectURL(link.href)
        
      } catch (error) {
        this.$message.error('导出失败：' + error.message)
      } finally {
        this.exportLoading = false
      }
    },

    // 加载日志列表
    async loadLogList() {
      if (this.listLoading) return
      
      this.listLoading = true
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const mockData = this.generateMockData()
        
        if (this.pageInfo.pageNum === 1) {
          this.logList = mockData
        } else {
          this.logList = [...this.logList, ...mockData]
        }
        
        this.pageInfo.total = 50 // 模拟总条数
        
      } catch (error) {
        this.$message.error('加载失败：' + error.message)
      } finally {
        this.listLoading = false
      }
    },

    // 加载更多
    loadMore() {
      if (this.noMoreData || this.listLoading) return
      this.pageInfo.pageNum++
      this.loadLogList()
    },

    // 刷新列表
    refreshList() {
      this.pageInfo.pageNum = 1
      this.loadLogList()
    },

    // 显示日志详情
    showLogDetail(log) {
      this.currentLog = log
      this.detailVisible = true
    },

    // 生成模拟数据
    generateMockData() {
      const mockLogs = []
      const startIndex = (this.pageInfo.pageNum - 1) * this.pageInfo.pageSize
      
      for (let i = 0; i < this.pageInfo.pageSize; i++) {
        const index = startIndex + i
        mockLogs.push({
          id: index + 1,
          title: `日志记录 ${index + 1}`,
          operator: `用户${Math.floor(Math.random() * 100)}`,
          operationTime: this.getRandomDate(),
          description: `这是第${index + 1}条日志记录，记录了一次重要的操作过程...`,
          projectName: this.queryType === 'project' ? '测试工程' : undefined,
          operationType: this.getRandomOperationType(),
          status: this.getRandomStatus(),
          details: this.generateMockDetails()
        })
      }
      
      return mockLogs
    },

    // 生成模拟详情数据
    generateMockDetails() {
      return [
        { label: '操作时间', value: new Date().toLocaleString() },
        { label: '操作人员', value: `用户${Math.floor(Math.random() * 100)}` },
        { label: 'IP地址', value: `192.168.1.${Math.floor(Math.random() * 255)}` },
        { label: '操作模块', value: '用户管理' },
        { label: '操作内容', value: '修改了用户权限设置' },
        { label: '操作前数据', value: '权限等级：普通用户' },
        { label: '操作后数据', value: '权限等级：管理员' },
        { label: '操作结果', value: '成功' }
      ]
    },

    // 辅助方法
    getRandomDate() {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    },

    getRandomOperationType() {
      const types = ['新增', '修改', '删除', '查询', '导出']
      return types[Math.floor(Math.random() * types.length)]
    },

    getRandomStatus() {
      const statuses = ['success', 'warning', 'info']
      return statuses[Math.floor(Math.random() * statuses.length)]
    },

    getStatusText(status) {
      const map = {
        success: '成功',
        warning: '警告',
        info: '信息'
      }
      return map[status] || '未知'
    }
  }
}
</script>

<style lang="scss" scoped>
.log-query-app {
  padding: 16px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.query-type-tabs {
  margin-bottom: 20px;
  ::v-deep .el-radio-group {
    display: flex;
    .el-radio-button {
      flex: 1;
      .el-radio-button__inner {
        width: 100%;
        padding: 12px 0;
      }
    }
  }
}

.query-conditions {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.action-buttons {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  
  .el-button {
    flex: 1;
    height: 44px;
    font-size: 16px;
  }
}

.log-list-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  
  .total-count {
    font-size: 14px;
    color: #606266;
  }
}

.log-list {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.log-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
  background: white;
  
  &:active {
    background-color: #f5f7fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.log-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  .log-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .log-status {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
    margin-left: 8px;
    
    &.status-success {
      background: #f0f9eb;
      color: #67c23a;
    }
    
    &.status-warning {
      background: #fdf6ec;
      color: #e6a23c;
    }
    
    &.status-info {
      background: #f4f4f5;
      color: #909399;
    }
  }
}

.log-item-content {
  .log-info-row {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    font-size: 14px;
    color: #606266;
    
    i {
      margin-right: 8px;
      color: #909399;
    }
    
    .log-desc {
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.log-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #ebeef5;
  
  .project-name {
    font-size: 13px;
    color: #909399;
    display: flex;
    align-items: center;
    
    i {
      margin-right: 4px;
    }
  }
  
  .operation-type {
    font-size: 12px;
    color: #409eff;
    padding: 2px 8px;
    background: #ecf5ff;
    border-radius: 4px;
  }
}

.loading-more,
.no-more-data,
.empty-list {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 14px;
  
  i {
    font-size: 20px;
    margin-right: 8px;
  }
}

.empty-list {
  padding: 40px 20px;
  
  i {
    font-size: 48px;
    margin-bottom: 12px;
    display: block;
  }
}

// 移动端优化
@media (max-width: 768px) {
  .log-query-app {
    padding: 12px;
  }
  
  .query-conditions {
    padding: 12px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
    
    .el-button {
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
// 全局样式调整，适配移动端
.log-detail-drawer {
  .el-drawer {
    border-radius: 16px 16px 0 0;
  }
  
  .el-drawer__body {
    padding: 0;
  }
}

// 表单元素适配移动端
.el-form-item__label {
  font-weight: 500;
}

.el-input__inner,
.el-select__input {
  height: 44px;
  line-height: 44px;
}

.el-date-editor .el-range-input {
  height: 42px;
}

// 下拉菜单适配移动端
.el-select-dropdown__item {
  padding: 12px 20px;
}

// 日期选择器适配移动端
.el-date-range-picker {
  width: 90% !important;
  max-width: 400px;
}
</style>