<!-- components/steps/PrinterSelection.vue -->
<template>
  <div class="printer-selection">
    <el-card class="printer-card">
      <div slot="header">选择打印机</div>
      <el-select
        v-model="selectedPrinter"
        placeholder="请选择打印机"
        style="width: 100%"
        :disabled="loading"
      >
        <el-option
          v-for="printer in printers"
          :key="printer.id"
          :label="printer.name"
          :value="printer"
        >
          <div style="display: flex; align-items: center">
            <i class="el-icon-printer" style="margin-right: 8px"></i>
            <span>{{ printer.name }}</span>
            <el-tag size="mini" style="margin-left: 8px">
              {{ printer.type }}
            </el-tag>
          </div>
        </el-option>
      </el-select>

      <div v-if="selectedPrinter" class="printer-info">
        <el-descriptions :column="1" size="small">
          <el-descriptions-item label="打印机名称">
            {{ selectedPrinter.name }}
          </el-descriptions-item>
          <el-descriptions-item label="类型">
            {{ selectedPrinter.type }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag type="success" size="small">在线</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <!-- 打印进度 -->
    <el-card v-if="loading" class="progress-card">
      <div slot="header">打印进度</div>
      <div style="padding: 20px">
        <el-progress
          :percentage="progress"
          :status="progress === 100 ? 'success' : ''"
          :stroke-width="12"
          :text-inside="true"
        />
        <div class="progress-text">
          <span v-if="progress < 100">正在发送数据到打印机...</span>
          <span v-else style="color: #67C23A">
            <i class="el-icon-success"></i> 打印完成
          </span>
        </div>
      </div>
    </el-card>

    <div class="action-buttons">
      <el-button @click="$emit('prev')" :disabled="loading">上一步</el-button>
      <el-button
        type="primary"
        :icon="loading ? 'el-icon-loading' : 'el-icon-printer'"
        @click="handlePrint"
        :loading="loading"
        :disabled="!selectedPrinter || loading"
      >
        {{ loading ? '打印中...' : '开始打印' }}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrinterSelection',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectedPrinter: null,
      printers: [
        { id: '1', name: '办公室打印机', type: '热敏打印机', status: 'online' },
        { id: '2', name: '仓库打印机', type: '标签打印机', status: 'online' },
        { id: '3', name: '财务部打印机', type: '普通打印机', status: 'online' },
        { id: '4', name: '蓝牙便携打印机', type: '便携式', status: 'offline' }
      ]
    }
  },
  methods: {
    handlePrint() {
      if (this.selectedPrinter) {
        this.$emit('print', this.selectedPrinter)
      }
    }
  }
}
</script>

<style scoped>
.printer-selection {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.printer-card {
  margin-bottom: 10px;
}

.printer-info {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.progress-card {
  margin-top: 10px;
}

.progress-text {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>