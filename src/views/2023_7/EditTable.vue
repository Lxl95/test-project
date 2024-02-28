<template>
  <el-table :data="tableData">
    <el-table-column type="index" width="50" label="序号" />
    <edit-table-column label="培训经历" prop="trainingInfo" :show-overflow-tooltip="true" editType="input" />
    <edit-table-column label="结束时间" prop="endTime" editType="endTime" min-width="115" />
  </el-table>
</template>
<script>
import EditTableColumn from './EditTableColumn.vue';
export default {
  components: { EditTableColumn },
  data() {
    return {
      tableData: [
        { trainingInfo: '11', endTime: '2023-8-6', isEditing: true },
        { trainingInfo: '22', endTime: '2023-8-8', isEditing: true }
      ]
    };
  }
};
</script>
