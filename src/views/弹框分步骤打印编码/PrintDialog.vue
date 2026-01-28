<!-- components/QRPrintWizard.vue -->
<template>
  <el-dialog
    :visible.sync="visible"
    title="二维码打印"
    width="800px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    @closed="resetWizard"
  >
    <!-- 步骤条 -->
    <el-steps :active="currentStep" align-center style="margin-bottom: 30px">
      <el-step title="选择规则" description="选择编码规则"></el-step>
      <el-step title="预览编码" description="确认生成编码"></el-step>
      <el-step title="前后缀设置" description="设置打印前后缀"></el-step>
      <el-step title="二维码预览" description="预览二维码效果"></el-step>
      <el-step title="选择打印机" description="选择并开始打印"></el-step>
    </el-steps>

    <!-- 步骤内容 -->
    <div class="step-content">
      <!-- 步骤1: 选择规则 -->
      <RuleSelection
        v-if="currentStep === 0"
        ref="step1"
        @next="handleStep1Complete"
      />

      <!-- 步骤2: 预览编码 -->
      <PreviewCodes
        v-else-if="currentStep === 1"
        ref="step2"
        :codes="printJob.codes"
        @next="goToNextStep"
        @prev="goToPrevStep"
      />

      <!-- 步骤3: 前后缀设置 -->
      <PrefixSuffix
        v-else-if="currentStep === 2"
        ref="step3"
        @update="handlePrefixSuffixUpdate"
        @next="goToNextStep"
        @prev="goToPrevStep"
      />

      <!-- 步骤4: 二维码预览 -->
      <QRPreview
        v-else-if="currentStep === 3"
        ref="step4"
        :codes="printJob.codes"
        @next="goToNextStep"
        @prev="goToPrevStep"
      />

      <!-- 步骤5: 选择打印机 -->
      <PrinterSelection
        v-else-if="currentStep === 4"
        ref="step5"
        :loading="printing"
        :progress="printProgress"
        @print="handlePrint"
        @prev="goToPrevStep"
      />
    </div>

    <!-- 底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button v-if="currentStep > 0" @click="goToPrevStep">上一步</el-button>
      <el-button
        v-if="currentStep < 4"
        type="primary"
        :disabled="!canProceed"
        @click="goToNextStep"
      >
        下一步
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import RuleSelection from './steps/RuleSelection.vue'
import PreviewCodes from './steps/PreviewCodes.vue'
import PrefixSuffix from './steps/PrefixSuffix.vue'
import QRPreview from './steps/QRPreview.vue'
import PrinterSelection from './steps/PrinterSelection.vue'
import { generateCodeByRule } from './utils/codeGenerator'

export default {
  name: 'QRPrintWizard',
  components: {
    RuleSelection,
    PreviewCodes,
    PrefixSuffix,
    QRPreview,
    PrinterSelection
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentStep: 0,
      printing: false,
      printProgress: 0,
      printJob: {
        rule: null,
        quantity: 0,
        prefix: '',
        suffix: '',
        codes: [],
        printer: null
      }
    }
  },
  computed: {
    canProceed() {
      switch (this.currentStep) {
        case 0:
          return this.printJob.rule && this.printJob.quantity > 0
        case 1:
          return this.printJob.codes.length > 0
        case 2:
          return true // 前后缀可选
        case 3:
          return this.printJob.codes.length > 0
        default:
          return false
      }
    }
  },
  methods: {
    // 步骤1完成
    handleStep1Complete({ rule, quantity }) {
      this.printJob.rule = rule
      this.printJob.quantity = quantity
      
      // 生成编码
      const codes = []
      for (let i = 0; i < quantity; i++) {
        const code = generateCodeByRule(rule, i)
        codes.push({
          id: `code_${Date.now()}_${i}`,
          code,
          fullText: code,
          status: 'pending'
        })
      }
      this.printJob.codes = codes
      
      this.goToNextStep()
    },

    // 前后缀更新
    handlePrefixSuffixUpdate({ prefix, suffix }) {
      this.printJob.prefix = prefix || ''
      this.printJob.suffix = suffix || ''
      
      // 更新编码的完整文本
      this.printJob.codes = this.printJob.codes.map(code => ({
        ...code,
        fullText: `${prefix}${code.code}${suffix}`
      }))
    },

    // 处理打印
    async handlePrint(printer) {
      this.printJob.printer = printer
      this.printing = true
      this.printProgress = 0
      
      try {
        // 模拟打印进度
        await this.simulatePrintProgress()
        
        // 打印完成后保存数据
        await this.savePrintRecord()
        
        this.$emit('print-complete', {
          jobId: `JOB-${Date.now()}`,
          ...this.printJob
        })
        
        this.$message.success('打印完成')
        setTimeout(() => {
          this.handleClose()
        }, 1500)
      } catch (error) {
        this.$message.error('打印失败：' + error.message)
        this.printing = false
      }
    },

    // 模拟打印进度
    simulatePrintProgress() {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          this.printProgress += Math.random() * 15
          if (this.printProgress >= 100) {
            this.printProgress = 100
            clearInterval(interval)
            setTimeout(resolve, 500)
          }
        }, 300)
      })
    },

    // 保存打印记录
    async savePrintRecord() {
      // 这里调用API保存记录
      console.log('保存打印记录:', this.printJob)
      // await api.savePrintRecord(this.printJob)
    },

    // 步骤导航
    goToNextStep() {
      if (this.currentStep < 4) {
        this.currentStep++
      }
    },

    goToPrevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },

    // 关闭处理
    handleClose() {
      if (this.printing) {
        this.$confirm('打印正在进行中，确定要取消吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.printing = false
          this.$emit('update:visible', false)
        })
      } else {
        this.$emit('update:visible', false)
      }
    },

    // 重置向导
    resetWizard() {
      this.currentStep = 0
      this.printing = false
      this.printProgress = 0
      this.printJob = {
        rule: null,
        quantity: 0,
        prefix: '',
        suffix: '',
        codes: [],
        printer: null
      }
    }
  }
}
</script>

<style scoped>
.step-content {
  min-height: 300px;
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* src/assets/styles/common.css */
/* 全局样式 */

/* 打印向导动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 二维码样式 */
.qr-code {
  padding: 10px;
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

/* 打印进度动画 */
.print-progress-bar {
  transition: width 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-dialog {
    width: 95% !important;
    margin-top: 5vh !important;
  }
  
  .el-step__title {
    font-size: 12px;
  }
}
</style>