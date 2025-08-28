<template>
  <div class="project-business-container">
    <el-table
      :data="processList"
      border
      style="width: 100%; height: calc(100vh - 60px);"
      :highlight-current-row="true"
      @row-click="handleProcessClick"
    >
      <!-- 左侧业务流程列 -->
      <el-table-column
        prop="name"
        label="业务流程"
        width="180"
      >
        <template slot-scope="scope">
          <div :style="{ 
            padding: '10px 0',
            fontWeight: currentProcess === scope.row ? '500' : 'normal'
          }">
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>

      <!-- 右侧子流程详情列 -->
      <el-table-column
        label="业务子流程详情"
        prop="children"
      >
        <template slot-scope="scope">
          <!-- 只显示当前选中流程的子流程 -->
          <div v-if="currentProcess === scope.row" class="subprocess-container">
            <div class="subprocess-header">
              <span>工程通用模型(弱)</span>
              <span>业务子流程</span>
            </div>
            
            <el-table
              :data="scope.row.children"
              border
              style="width: 100%; margin-top: 15px"
              @row-click="handleRowClick"
              :highlight-current-row="true"
            >
              <el-table-column
                prop="name"
                label="子流程名称"
                width="300"
              ></el-table-column>
              <el-table-column
                prop="count"
                label="数量"
                width="120"
                align="center"
                :formatter="formatCount"
              ></el-table-column>
              <el-table-column
                label="操作"
                align="center"
              >
                <template slot-scope="subScope">
                  <el-button
                    type="text"
                    @click="goToBusiness(subScope.row)"
                    :disabled="!subScope.row.path"
                  >
                    查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 未选中时显示提示 -->
          <div v-else class="empty-placeholder">
            请选择左侧业务流程查看详情
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 业务流程数据
const processData = [
  {
    name: '准备工作',
    color: '#4CAF50',
    children: [
      { name: '施工任务委托书', count: 1, path: '/construction-task' },
      { name: '施工派工单', count: 1, path: '/work-order' },
      { name: '图纸会审及设计交底', count: 1, path: '/drawing-review' },
      { name: '施工技术及安全交底', count: 1, path: '/safety-teaching' },
    ]
  },
  {
    name: '开工准备',
    color: '#4CAF50',
    children: [
      { name: '测量放线', count: 1, path: '/surveying' },
      { name: '测量放线报验单', count: 1, path: '/surveying-report' },
      { name: '施工组织设计', count: 1, path: '/construction-design' },
      { name: '开工报告', count: 1, path: '/start-report' },
      { name: '开工报审单', count: 1, path: '/start-application' },
    ]
  },
  // 其他业务流程...
  {
    name: '管道焊接',
    color: '#2196F3',
    children: [
      { name: 'PE管热熔焊接', count: 4, path: '/pe-welding' },
      { name: 'PE管电熔焊接', count: 1, path: '/pe-electro-welding' },
      { name: '钢制管道焊接', count: 0, path: '/steel-pipe-welding' },
      // 其他子流程...
    ]
  }
];

export default {
  name: 'ProjectBusiness',
  data() {
    return {
      processList: processData,
      currentProcess: null,
    };
  },
  mounted() {
    // 初始化默认选中第一个流程
    this.currentProcess = this.processList[0];
  },
  methods: {
    // 跳转到对应业务菜单
    goToBusiness(sub) {
      if (sub.path) {
        this.$router.push(sub.path);
      }
    },
    // 左侧流程表格行点击事件
    handleProcessClick(row) {
      this.currentProcess = row;
    },
    // 右侧子流程表格行点击事件
    handleRowClick(row) {
      this.goToBusiness(row);
    },
    // 格式化数量显示，添加角标样式
    formatCount(row) {
      return row.count > 0 
        ? `<span class="count-badge">${row.count}</span>` 
        : row.count;
    }
  }
};
</script>

<style scoped>
.project-business-container {
  padding: 20px;
  background: #fff;
  height: 100vh;
  box-sizing: border-box;
}

/* 子流程容器样式 */
.subprocess-container {
  padding: 10px;
}

.subprocess-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

/* 未选中时的占位提示 */
.empty-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
  background-color: #f9f9f9;
  border-radius: 4px;
}

/* 表格数量角标样式 */
.count-badge {
  display: inline-block;
  padding: 0 6px;
  background-color: #4CAF50;
  color: #fff;
  border-radius: 10px;
  font-size: 12px;
  line-height: 18px;
}

/* 左侧表格行样式 */
::v-deep .el-table__row:hover td:first-child {
  background-color: #e8f0fe !important;
}

::v-deep .el-table__row.current-row td:first-child {
  background-color: #d1e7fe !important;
}

/* 右侧子表格行样式 */
::v-deep .subprocess-container .el-table__row:hover {
  background-color: #e8f0fe !important;
}

::v-deep .subprocess-container .el-table__row.current-row {
  background-color: #d1e7fe !important;
}

/* 表格单元格样式调整 */
::v-deep .el-table td, 
::v-deep .el-table th {
  padding: 0;
  vertical-align: top;
}

/* 左侧列样式 */
::v-deep .el-table td:first-child {
  padding: 10px 0;
  text-align: center;
  border-right: 1px solid #e6e6e6;
}
</style>
