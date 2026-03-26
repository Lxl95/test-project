<!-- LogDetail.vue -->
<template>
  <div class="log-detail">
    <!-- 顶部标题栏 -->
    <div class="detail-header">
      <div class="header-left">
        <el-button
          icon="el-icon-close"
          circle
          @click="handleClose"
          class="close-btn"
        />
      </div>
      <div class="header-title">
        <h3>{{ logData.title || '日志详情' }}</h3>
        <p class="sub-title">{{ logData.operationTime }}</p>
      </div>
      <div class="header-right">
        <span class="status-badge" :class="`status-${logData.status || ''}`">
          {{ getStatusText(logData.status || '') }}
        </span>
      </div>
    </div>

    <!-- 详情内容 -->
    <div class="detail-content">
      <div class="detail-list">
        <div
          v-for="(item, index) in detailList"
          :key="index"
          class="detail-item"
          :class="{ 'last-item': index === detailList.length - 1 }"
        >
          <div class="detail-label">{{ item.label }}：</div>
          <div class="detail-value">{{ item.value }}</div>
        </div>
      </div>
      
      <!-- 操作备注 -->
      <div class="remark-section" v-if="remarks.length > 0">
        <h4 class="section-title">操作备注</h4>
        <div class="remarks-list">
          <div
            v-for="(remark, index) in remarks"
            :key="index"
            class="remark-item"
          >
            <div class="remark-content">{{ remark.content }}</div>
            <div class="remark-info">
              <span class="remark-author">{{ remark.author }}</span>
              <span class="remark-time">{{ remark.time }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 相关附件 -->
      <div class="attachment-section" v-if="attachments.length > 0">
        <h4 class="section-title">相关附件</h4>
        <div class="attachments-list">
          <div
            v-for="(file, index) in attachments"
            :key="index"
            class="attachment-item"
            @click="previewFile(file)"
          >
            <i class="el-icon-document"></i>
            <div class="file-info">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-size">{{ file.size }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <div class="detail-footer">
      <el-button
        type="primary"
        @click="handleExportDetail"
        class="export-btn"
      >
        <i class="el-icon-download"></i>
        导出详情
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogDetail',
  props: {
    logData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      remarks: [
        {
          content: '本次操作为常规维护操作',
          author: '系统管理员',
          time: '2024-01-15 10:30'
        },
        {
          content: '已通过审批流程',
          author: '审批人',
          time: '2024-01-15 10:25'
        }
      ],
      attachments: [
        {
          name: '操作截图.png',
          size: '2.5MB',
          url: '#'
        },
        {
          name: '日志详情.xlsx',
          size: '156KB',
          url: '#'
        }
      ]
    }
  },
  computed: {
    detailList() {
      if (!this.logData || !this.logData.details) {
        return []
      }
      return this.logData.details
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    
    getStatusText(status) {
      const map = {
        success: '成功',
        warning: '警告',
        info: '信息'
      }
      return map[status] || '未知'
    },
    
    previewFile(file) {
      this.$message.info(`预览文件：${file.name}`)
      // 实际项目中这里实现文件预览逻辑
    },
    
    handleExportDetail() {
      this.$message.success('详情导出成功')
      // 实际项目中这里实现导出逻辑
    }
  }
}
</script>

<style lang="scss" scoped>
.log-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #ebeef5;
  position: sticky;
  top: 0;
  z-index: 10;
  
  .header-left {
    flex: 0 0 auto;
  }
  
  .header-title {
    flex: 1;
    text-align: center;
    
    h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .sub-title {
      margin: 0;
      font-size: 12px;
      color: #909399;
    }
  }
  
  .header-right {
    flex: 0 0 auto;
  }
}

.close-btn {
  padding: 8px;
  border: none;
  background: transparent;
  
  &:active {
    background-color: #f5f7fa;
  }
}

.status-badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  
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

.detail-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
}

.detail-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.detail-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child,
  &.last-item {
    border-bottom: none;
  }
  
  .detail-label {
    flex: 0 0 100px;
    font-weight: 500;
    color: #606266;
    font-size: 14px;
  }
  
  .detail-value {
    flex: 1;
    color: #303133;
    font-size: 14px;
    word-break: break-word;
  }
}

.section-title {
  font-size: 16px;
  color: #303133;
  margin: 24px 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.remarks-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.remark-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .remark-content {
    color: #303133;
    margin-bottom: 8px;
    line-height: 1.5;
  }
  
  .remark-info {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #909399;
  }
}

.attachments-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
  
  &:active {
    background-color: #f5f7fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  i {
    font-size: 24px;
    color: #409eff;
    margin-right: 12px;
  }
  
  .file-info {
    flex: 1;
    
    .file-name {
      color: #303133;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .file-size {
      font-size: 12px;
      color: #909399;
    }
  }
}

.detail-footer {
  padding: 16px;
  background: white;
  border-top: 1px solid #ebeef5;
  position: sticky;
  bottom: 0;
  
  .export-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
  }
}

// 移动端优化
@media (max-width: 768px) {
  .detail-item {
    flex-direction: column;
    
    .detail-label {
      margin-bottom: 8px;
    }
  }
}
</style>