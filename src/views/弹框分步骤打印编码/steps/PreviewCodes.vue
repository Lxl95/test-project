<!-- components/steps/PreviewCodes.vue -->
<template>
  <div class="preview-codes">
    <el-alert
      :title="`共生成 ${codes.length} 个编码`"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
    />

    <el-table
      :data="paginatedCodes"
      height="250"
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="code"
        label="生成编码"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-tag>{{ scope.row.code }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="fullText"
        label="完整文本"
        min-width="180"
      ></el-table-column>
    </el-table>

    <el-pagination
      v-if="codes.length > 10"
      small
      layout="prev, pager, next"
      :total="codes.length"
      :page-size="10"
      @current-change="handlePageChange"
      style="margin-top: 10px; justify-content: center"
    />

    <div class="action-buttons">
      <el-button @click="$emit('prev')">上一步</el-button>
      <el-button type="primary" @click="$emit('next')">确认编码</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PreviewCodes',
  props: {
    codes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    paginatedCodes() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.codes.slice(start, end)
    }
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page
    }
  }
}
</script>

<style scoped>
.preview-codes {
  display: flex;
  flex-direction: column;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>