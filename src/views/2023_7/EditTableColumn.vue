<template>
  <el-table-column v-bind="$attrs" v-on="$listeners">
    <template slot-scope="{ row }">
      <!-- 输入框 -->
      <template v-if="editType === 'input'">
        <el-input v-if="row.isEditing" v-model="row[prop]" placeholder="请输入备注" size="small" />
        <span v-else>{{ row[prop] }}</span>
      </template>
      <!-- 下拉框 -->
      <template v-else-if="editType === 'select'">
        <el-select v-if="row.isEditing" v-model="row[prop]" filterable placeholder="请选择" size="mini">
          <el-option v-for="item in options" :key="item.ctCode" :label="item.ctName" :value="item.ctName" />
        </el-select>
        <span v-else>{{ row[prop] }}</span>
      </template>
      <!-- 开始时间 -->
      <template v-else-if="editType === 'startTime'">
        <el-date-picker
          v-if="row.isEditing"
          v-model="row[prop]"
          size="small"
          type="month"
          class="date-picker"
          placeholder="开始时间"
          format="yyyy.MM"
          value-format="yyyy.MM"
          :picker-options="startPicker(row)"
        />
        <span v-else>{{ row[prop] }}</span>
      </template>
      <!-- 结束时间 -->
      <template v-else-if="editType === 'endTime'">
        <el-date-picker
          v-if="row.isEditing"
          v-model="row[prop]"
          size="small"
          type="month"
          class="date-picker"
          placeholder="结束时间"
          format="yyyy.MM"
          value-format="yyyy.MM"
          :picker-options="endPicker(row)"
        />
        <span v-else>{{ row[prop] }}</span>
      </template>
      <!-- 普通显示 -->
      <template v-else>
        <span>{{ row[prop] }}</span>
      </template>
    </template>
  </el-table-column>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    prop: {
      type: String,
      default: ''
    },
    editType: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    //开始时间验证
    startPicker(row) {
      return {
        disabledDate(time) {
          return time.getTime() > new Date(row.endTime);
        }
      };
    },
    //结束时间验证
    endPicker(row) {
      return {
        disabledDate(time) {
          return time.getTime() < new Date(row.startTime);
        }
      };
    }
  }
};
</script>
<style></style>
