<template>
  <div class="expand-table-container">
    <!-- 头部 -->
    <div class="header">
      <h2>
        📋 固定列 + 完整展开行
        <span class="badge">左侧 · 右侧固定</span>
      </h2>
      <div class="tip">
        <i class="el-icon-info"></i>
        点击行首 <strong>「展开」</strong> 查看完整字段（跨固定列显示）
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
      row-key="id"
      :expand-row-keys="expandRowKeys"
      @expand-change="handleExpandChange"
    >
      <!-- 展开列（不固定，作为第一列） -->
      <el-table-column type="expand" width="60" align="center">
        <template slot-scope="scope">
          <div class="expand-content">
            <div class="title">
              📄 完整信息
              <span class="tag">#{{ scope.row.id }}</span>
            </div>
            <div class="expand-grid">
              <div class="expand-item">
                <span class="label">姓名</span>
                <span class="value">{{ scope.row.name }}</span>
              </div>
              <div class="expand-item">
                <span class="label">ID</span>
                <span class="value">{{ scope.row.id }}</span>
              </div>
              <div class="expand-item" style="grid-column: 1 / -1;">
                <span class="label">描述</span>
                <span class="value value--long">{{ scope.row.description }}</span>
              </div>
              <div class="expand-item" style="grid-column: 1 / -1;">
                <span class="label">备注</span>
                <span class="value value--long">{{ scope.row.remark || '无' }}</span>
              </div>
              <div class="expand-item">
                <span class="label">状态</span>
                <span class="value">
                  <span class="status-tag" :class="getStatusClass(scope.row.status)">
                    {{ scope.row.status }}
                  </span>
                </span>
              </div>
              <div class="expand-item">
                <span class="label">创建时间</span>
                <span class="value">{{ scope.row.createTime }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 左侧固定列：ID -->
      <el-table-column prop="id" label="ID" fixed="left" width="90" align="center">
        <template slot-scope="scope">
          <span class="truncate-text" :title="scope.row.id">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <!-- 左侧固定列：姓名 -->
      <el-table-column prop="name" label="姓名" fixed="left" width="140">
        <template slot-scope="scope">
          <span class="truncate-text" :title="scope.row.name">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <!-- 中间列：描述 -->
      <el-table-column prop="description" label="描述" min-width="200">
        <template slot-scope="scope">
          <span class="truncate-text" :title="scope.row.description">
            {{ scope.row.description }}
          </span>
        </template>
      </el-table-column>

      <!-- 中间列：备注 -->
      <el-table-column prop="remark" label="备注" min-width="160">
        <template slot-scope="scope">
          <span class="truncate-text" :title="scope.row.remark || '-'">
            {{ scope.row.remark || '-' }}
          </span>
        </template>
      </el-table-column>

      <!-- 右侧固定列：状态 -->
      <el-table-column prop="status" label="状态" fixed="right" width="110" align="center">
        <template slot-scope="scope">
          <span class="truncate-text" :title="scope.row.status">
            <span class="status-tag" :class="getStatusClass(scope.row.status)">
              {{ scope.row.status }}
            </span>
          </span>
        </template>
      </el-table-column>

      <!-- 右侧固定列：操作 -->
      <el-table-column label="操作" fixed="right" width="160" align="center">
        <template slot-scope="scope">
          <div class="action-btns">
            <el-button size="small" type="primary" plain @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" plain @click="handleDelete(scope.row)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部工具 -->
    <div class="footer-tools">
      <div class="info">
        共 <strong>{{ tableData.length }}</strong> 条记录
        · 点击行首 <i class="el-icon-arrow-right" style="vertical-align:middle;"></i> 展开
      </div>
      <div>
        <el-button size="small" @click="expandAll">全部展开</el-button>
        <el-button size="small" @click="collapseAll">全部收起</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExpandTable',
  data() {
    return {
      // 模拟数据（包含长文本）
      tableData: [
        {
          id: 'A-1001',
          name: '张伟 · 高级产品经理',
          description: '负责核心业务线的产品规划与需求分析，主导了多个从0到1的项目落地，具备丰富的B端产品经验。',
          remark: '近期专注于AI赋能方向，推动智能决策模块的迭代升级。',
          status: '进行中',
          createTime: '2026-01-15 09:30'
        },
        {
          id: 'A-1002',
          name: '李娜 · 技术架构师',
          description: '全栈技术架构设计与技术选型，微服务治理与性能优化，主导过日活千万级系统的架构升级。',
          remark: '目前正在研究云原生与Serverless架构在业务中的落地实践。',
          status: '已完成',
          createTime: '2026-01-12 14:20'
        },
        {
          id: 'A-1003',
          name: '王强 · 运营负责人',
          description: '用户增长策略制定与执行，活动运营与数据分析，擅长通过精细化运营提升用户留存率。',
          remark: 'Q2季度重点推进会员体系与积分商城项目。',
          status: '待审核',
          createTime: '2026-01-10 11:45'
        },
        {
          id: 'A-1004',
          name: '陈敏 · 资深前端工程师',
          description: '负责前端架构设计与组件库建设，推动团队工程化与标准化，具备丰富的可视化大屏开发经验。',
          remark: '近期在研究WebAssembly与前端性能优化方向。',
          status: '进行中',
          createTime: '2026-01-08 16:10'
        },
        {
          id: 'A-1005',
          name: '赵磊 · 数据科学专家',
          description: '机器学习模型开发与优化，数据挖掘与特征工程，主导过推荐系统与风控模型的落地。',
          remark: '正在探索大语言模型在垂直领域的微调与应用。',
          status: '已关闭',
          createTime: '2026-01-05 08:50'
        },
        {
          id: 'A-1006',
          name: '孙晓 · 项目经理 (PMP)',
          description: '负责跨部门项目协调与进度管控，敏捷流程推行与风险管理，确保项目按时高质交付。',
          remark: '目前同时推进3个中大型项目，资源协调是关键挑战。',
          status: '待审核',
          createTime: '2026-01-03 13:25'
        }
      ],
      // 当前展开的行 key 数组（使用 id 作为唯一标识）
      expandRowKeys: []
    };
  },
  methods: {
    // 切换展开/收起
    handleExpandChange(row, expanded) {
      const index = this.expandRowKeys.indexOf(row.id);
      if (expanded) {
        if (index === -1) this.expandRowKeys.push(row.id);
      } else {
        if (index !== -1) this.expandRowKeys.splice(index, 1);
      }
    },
    // 全部展开
    expandAll() {
      this.expandRowKeys = this.tableData.map(row => row.id);
    },
    // 全部收起
    collapseAll() {
      this.expandRowKeys = [];
    },
    // 状态样式映射
    getStatusClass(status) {
      const map = {
        '进行中': 'active',
        '已完成': 'done',
        '待审核': 'pending',
        '已关闭': 'closed'
      };
      return map[status] || '';
    },
    handleEdit(row) {
      this.$message.info(`编辑：${row.name}`);
    },
    handleDelete(row) {
      this.$message.warning(`删除：${row.name}`);
    }
  }
};
</script>

<style scoped>
/* 这里使用 scoped 但为了覆盖 Element UI 样式，需用深度选择器，或直接不加 scoped。
   由于需要覆盖 .el-table__expanded-cell 等，推荐不加 scoped 或者使用 /deep/。
   此处不加 scoped，确保全局样式生效。 */
.expand-table-container {
  width: 100%;
  max-width: 1300px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
  padding: 24px 20px 30px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
  gap: 10px;
}
.header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1d2129;
  display: flex;
  align-items: center;
  gap: 12px;
}
.header h2 .badge {
  font-size: 13px;
  font-weight: 400;
  background: #ecf5ff;
  color: #409eff;
  padding: 0 16px;
  border-radius: 20px;
  line-height: 26px;
}
.header .tip {
  font-size: 14px;
  color: #86909c;
  background: #f7f8fa;
  padding: 4px 16px;
  border-radius: 20px;
}
.header .tip i {
  margin-right: 4px;
}

/* ============================================================
   核心：消除固定列对展开行的遮挡，实现完整跨列显示
   ============================================================ */
/* 1. 让展开行的单元格成为相对定位的层，并提高 z-index */
.el-table__expanded-cell {
  position: relative !important;
  z-index: 999 !important;
  overflow: visible !important;
  background-color: #ffffff !important;
}

/* 2. 固定列容器允许内容溢出，并降低 z-index，使其位于展开行下方 */
.el-table__fixed,
.el-table__fixed-right {
  overflow: visible !important;
  z-index: 1 !important;
}

/* 3. 固定列内部的包裹层也允许溢出，避免裁剪展开行内容 */
.el-table__fixed-body-wrapper,
.el-table__fixed-right-body-wrapper {
  overflow: visible !important;
}

/* 展开行内容样式 */
.expand-content {
  background: #fafbfc;
  border-radius: 6px;
  padding: 12px 16px;
  margin: 4px 0;
  border: 1px solid #e9ebef;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}
.expand-content .title {
  font-size: 15px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px dashed #dcdfe6;
  display: flex;
  align-items: center;
  gap: 10px;
}
.expand-content .title .tag {
  font-size: 12px;
  font-weight: 400;
  background: #ecf5ff;
  color: #409eff;
  padding: 0 12px;
  border-radius: 12px;
  line-height: 22px;
}
.expand-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 8px 20px;
}
.expand-item {
  display: flex;
  align-items: baseline;
  font-size: 14px;
  line-height: 1.6;
  padding: 4px 0;
  border-bottom: 1px solid #f0f1f3;
}
.expand-item .label {
  flex-shrink: 0;
  width: 70px;
  color: #86909c;
  font-weight: 500;
}
.expand-item .value {
  color: #1d2129;
  word-break: break-all;
  flex: 1;
}
.expand-item .value--long {
  background: #f7f8fa;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 13px;
}
.expand-item .value .status-tag {
  display: inline-block;
  padding: 0 12px;
  height: 24px;
  line-height: 24px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-width: 52px;
}
.status-tag.active {
  background: #e8f5e9;
  color: #2e7d32;
}
.status-tag.pending {
  background: #fff3e0;
  color: #e65100;
}
.status-tag.done {
  background: #e3f2fd;
  color: #0d47a1;
}
.status-tag.closed {
  background: #f5f5f5;
  color: #616161;
}

/* 操作按钮 */
.action-btns .el-button {
  padding: 5px 10px;
  font-size: 12px;
}

/* 表格内文本截断（固定列和非固定列均适用） */
.truncate-text {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: keep-all;
}
.el-table .cell .truncate-text {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 展开行内的文本不截断，完整显示 */
.expand-content .value {
  white-space: normal;
  word-break: break-word;
}

/* 底部控制区 */
.footer-tools {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.footer-tools .info {
  font-size: 14px;
  color: #86909c;
}
.footer-tools .info strong {
  color: #1d2129;
}

/* 响应式 */
@media (max-width: 768px) {
  .expand-table-container {
    padding: 16px 12px;
  }
  .expand-grid {
    grid-template-columns: 1fr;
  }
  .header h2 {
    font-size: 17px;
  }
  .header .tip {
    font-size: 12px;
    padding: 2px 12px;
  }
}
</style>