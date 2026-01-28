<!-- components/steps/QRPreview.vue -->
<template>
  <div class="qr-preview">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header">文本预览</div>
          <div class="text-preview">
            <div class="sample-text">
              {{ sampleCode.fullText }}
              <el-button
                type="text"
                icon="el-icon-document-copy"
                @click="copyText"
                style="margin-left: 10px"
              ></el-button>
            </div>
            <div class="text-info">
              <el-tag type="info" size="small">
                共 {{ codes.length }} 个二维码，内容格式相同
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">二维码预览</div>
          <div class="qr-code-area">
            <!-- 使用 vue-qriously 或类似库 -->
            <div class="qr-container">
              <canvas ref="qrCanvas"></canvas>
            </div>
            <div class="qr-info">
              尺寸：180×180px | 纠错等级：H (30%)
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="action-buttons">
      <el-button @click="$emit('prev')">上一步</el-button>
      <el-button type="primary" @click="$emit('next')">下一步</el-button>
    </div>
  </div>
</template>

<script>
// import QRCode from 'qrcode'

export default {
  name: 'QRPreview',
  props: {
    codes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      qrImage: ''
    }
  },
  computed: {
    sampleCode() {
      return this.codes[0] || { fullText: '暂无数据' }
    }
  },
  mounted() {
    this.generateQRCode()
  },
  watch: {
    'sampleCode.fullText': {
      handler() {
        this.generateQRCode()
      },
      immediate: true
    }
  },
  methods: {
    async generateQRCode() {
      if (!this.sampleCode.fullText) return
      
      try {
        const canvas = this.$refs.qrCanvas
        await QRCode.toCanvas(canvas, this.sampleCode.fullText, {
          width: 180,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
      } catch (err) {
        console.error('生成二维码失败:', err)
      }
    },
    
    copyText() {
      const text = this.sampleCode.fullText
      navigator.clipboard.writeText(text).then(() => {
        this.$message.success('已复制到剪贴板')
      }).catch(() => {
        // 降级方案
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        this.$message.success('已复制到剪贴板')
      })
    }
  }
}
</script>

<style scoped>
.qr-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.text-preview {
  padding: 15px;
  text-align: center;
}

.sample-text {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 16px;
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 10px;
  word-break: break-all;
}

.text-info {
  margin-top: 10px;
}

.qr-code-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
}

.qr-container {
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: white;
}

.qr-info {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>