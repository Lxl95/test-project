<!-- views/PrintManagement.vue -->
<template>
  <div class="print-management">
    <div class="header">
      <h1>二维码打印管理</h1>
      <el-button type="primary" @click="openPrintWizard">
        <i class="el-icon-printer"></i> 生成打印
      </el-button>
    </div>

    <!-- 打印记录表格 -->
    <el-card class="table-card">
      <el-table :data="printRecords" style="width: 100%">
        <el-table-column prop="jobId" label="任务ID" width="180"></el-table-column>
        <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
        <el-table-column prop="printer" label="打印机" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="printTime" label="打印时间" width="180"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="viewDetails(scope.row)">查看</el-button>
            <el-button type="text" @click="rePrint(scope.row)">重印</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 打印向导弹窗 -->
    <PrintDialog
      :visible.sync="showWizard"
      @close="handleWizardClose"
      @print-complete="handlePrintComplete"
    />
  </div>
</template>

<script>
import PrintDialog from './PrintDialog.vue'

export default {
  name: 'PrintManagement',
  components: {
    PrintDialog
  },
  data() {
    return {
      showWizard: false,
      printRecords: [
        {
          jobId: 'JOB-20231225-001',
          quantity: 10,
          printer: '办公室打印机',
          status: '已完成',
          printTime: '2023-12-25 14:30:00'
        },
        // 更多记录...
      ]
    }
  },
  methods: {
    openPrintWizard() {
      this.showWizard = true
    },
    handleWizardClose() {
      this.showWizard = false
    },
    handlePrintComplete(jobData) {
      this.printRecords.unshift({
        jobId: jobData.jobId,
        quantity: jobData.quantity,
        printer: jobData.printer,
        status: '已完成',
        printTime: new Date().toLocaleString()
      })
      this.$message.success('打印任务已完成并保存')
    },
    getStatusType(status) {
      const map = {
        '已完成': 'success',
        '打印中': 'primary',
        '失败': 'danger',
        '等待中': 'info'
      }
      return map[status] || 'info'
    },
    viewDetails(record) {
      // 查看详情逻辑
    },
    rePrint(record) {
      // 重新打印逻辑
    }
  }
}
</script>

<style scoped>
.print-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-card {
  margin-top: 20px;
}
</style>