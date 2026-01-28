<!-- components/steps/PrefixSuffix.vue -->
<template>
  <div class="prefix-suffix">
    <el-card>
      <div slot="header">前后缀设置</div>
      <el-form ref="form" label-width="80px">
          <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="打印前缀">
            <el-input
              v-model="prefix"
              placeholder="请输入前缀，如：CODE-"
              clearable
              @input="handleInput"
            >
              <template slot="prepend">前缀</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="打印后缀">
            <el-input
              v-model="suffix"
              placeholder="请输入后缀，如：-END"
              clearable
              @input="handleInput"
            >
              <template slot="prepend">后缀</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>

      <el-divider></el-divider>

      <el-card shadow="never">
        <div slot="header">预览效果</div>
        <div class="preview-area">
          <div class="preview-text">
            <span class="prefix" v-if="prefix">{{ prefix }}</span>
            <span class="code">[编码内容]</span>
            <span class="suffix" v-if="suffix">{{ suffix }}</span>
          </div>
          <div class="preview-example">
            示例：{{ prefix }}SN202312250001{{ suffix }}
          </div>
        </div>
      </el-card>
    </el-card>

    <div class="action-buttons">
      <el-button @click="$emit('prev')">上一步</el-button>
      <el-button type="primary" @click="$emit('next')">应用设置</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrefixSuffix',
  data() {
    return {
      prefix: '',
      suffix: '',
      timer: null
    }
  },
  methods: {
    handleInput() {
      // 防抖处理
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$emit('update', {
          prefix: this.prefix,
          suffix: this.suffix
        })
      }, 300)
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  }
}
</script>

<style scoped>
.prefix-suffix {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-area {
  padding: 15px;
}

.preview-text {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.preview-text .prefix {
  color: #409EFF;
}

.preview-text .code {
  color: #67C23A;
}

.preview-text .suffix {
  color: #E6A23C;
}

.preview-example {
  font-size: 14px;
  color: #909399;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>