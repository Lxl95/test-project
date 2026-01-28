<!-- components/steps/RuleSelection.vue -->
<template>
  <div class="rule-selection">
    <el-card class="rule-card">
      <div slot="header">选择编码规则</div>
      <el-select
        v-model="selectedRule"
        placeholder="请选择编码规则"
        style="width: 100%; margin-bottom: 20px"
      >
        <el-option
          v-for="rule in encodingRules"
          :key="rule.id"
          :label="rule.name"
          :value="rule"
        >
          <span style="float: left">{{ rule.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            {{ rule.description }}
          </span>
        </el-option>
      </el-select>

      <el-descriptions v-if="selectedRule" :column="1" size="small">
        <el-descriptions-item label="规则名称">
          {{ selectedRule.name }}
        </el-descriptions-item>
        <el-descriptions-item label="编码模式">
          <el-tag type="info">{{ selectedRule.pattern }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="说明">
          {{ selectedRule.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="quantity-card">
      <div slot="header">生成数量</div>
      <el-input-number
        v-model="quantity"
        :min="1"
        :max="1000"
        controls-position="right"
        style="width: 100%"
      >
        <template slot="append">个</template>
      </el-input-number>
    </el-card>

    <div class="action-buttons">
      <el-button
        type="primary"
        :disabled="!selectedRule || quantity < 1"
        @click="handleNext"
      >
        生成编码
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RuleSelection',
  data() {
    return {
      selectedRule: null,
      quantity: 1,
      encodingRules: [
        {
          id: '1',
          name: '序列号规则',
          pattern: '{SEQ:6}',
          description: '6位数字序列号'
        },
        {
          id: '2',
          name: '日期+流水号',
          pattern: '{YYYYMMDD}-{SEQ:4}',
          description: '日期 + 4位流水号'
        },
        {
          id: '3',
          name: '固定前缀+随机数',
          pattern: 'SN-{RANDOM:8}',
          description: 'SN前缀 + 8位随机数'
        },
        {
          id: '4',
          name: '自定义编码',
          pattern: '{PREFIX}-{YYYYMMDD}-{SEQ:5}',
          description: '自定义前缀 + 日期 + 5位流水号'
        }
      ]
    }
  },
  methods: {
    handleNext() {
      if (this.selectedRule && this.quantity > 0) {
        this.$emit('next', {
          rule: this.selectedRule,
          quantity: this.quantity
        })
      }
    }
  }
}
</script>

<style scoped>
.rule-selection {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rule-card,
.quantity-card {
  margin-bottom: 10px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>