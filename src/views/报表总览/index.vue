<template>
  <div class="report-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-title">
        <i class="el-icon-data-analysis"></i>
        报表中心
      </div>
      <div class="header-actions">
        <el-input class="search-box" placeholder="搜索报表..." prefix-icon="el-icon-search" v-model="searchQuery" clearable @keyup.enter.native="performSearch" @clear="clearSearch"></el-input>
        <el-button icon="el-icon-filter" @click="showFilterDialog">筛选</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="createNewReport">新建报表</el-button>
      </div>
    </div>

    <!-- 瀑布流布局容器 -->
    <div class="waterfall-container">
      <transition-group name="fade">
        <div class="category-card" v-for="category in filteredCategories" :key="category.id">
          <div class="category-header">
            <div class="category-title">{{ category.name }}</div>
            <div class="report-count">{{ getTotalReports(category) }}个报表</div>
          </div>

          <div class="category-content">
            <div class="report-list">
              <div class="report-item" v-for="report in category.reports" :key="report.id">
                <div class="report-name">{{ report.name }}</div>
                <div class="report-actions">
                  <el-button size="mini" icon="el-icon-view" @click="previewReport(report)" class="preview-btn">预览</el-button>
                  <el-button
                    size="mini"
                    :icon="report.favorited ? 'el-icon-star-on' : 'el-icon-star-off'"
                    :type="report.favorited ? 'warning' : ''"
                    @click="toggleFavorite(report)"
                    class="favorite-btn"
                  >
                    {{ report.favorited ? '已收藏' : '收藏' }}
                  </el-button>
                </div>
              </div>

              <!-- 子类别 -->
              <div class="subcategory" v-for="subcategory in category.subcategories" :key="subcategory.id">
                <div class="subcategory-header">
                  <div>{{ subcategory.name }}</div>
                  <div class="report-count">{{ subcategory.reports.length }}个报表</div>
                </div>
                <div class="subcategory-content">
                  <div class="report-item" v-for="report in subcategory.reports" :key="report.id">
                    <div class="report-name">{{ report.name }}</div>
                    <div class="report-actions">
                      <el-button size="mini" icon="el-icon-view" @click="previewReport(report)" class="preview-btn">预览</el-button>
                      <el-button
                        size="mini"
                        :icon="report.favorited ? 'el-icon-star-on' : 'el-icon-star-off'"
                        :type="report.favorited ? 'warning' : ''"
                        @click="toggleFavorite(report)"
                        class="favorite-btn"
                      >
                        {{ report.favorited ? '已收藏' : '收藏' }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- 空状态 -->
      <div class="empty-state" v-if="filteredCategories.length === 0">
        <i class="el-icon-search"></i>
        <p>未找到匹配的报表</p>
        <p class="el-text-muted">尝试调整搜索关键词或筛选条件</p>
        <el-button type="primary" @click="clearSearch" style="margin-top: 15px">清空搜索条件</el-button>
      </div>
    </div>

    <div class="footer">
      <p>© 2023 企业报表系统 | 共 {{ totalReports }} 个报表 | 已收藏 {{ favoriteCount }} 个</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectBusiness',
  data() {
    return {
      searchQuery: '',
      categories: [
        {
          id: 1,
          name: '销售报表',
          reports: [
            { id: 101, name: '月度销售报告', favorited: false },
            { id: 102, name: '区域销售分析', favorited: true },
            { id: 103, name: '产品销量TOP10', favorited: false }
          ],
          subcategories: [
            {
              id: 11,
              name: '客户分析',
              reports: [
                { id: 111, name: '客户购买行为', favorited: false },
                { id: 112, name: '客户细分报告', favorited: false },
                { id: 113, name: 'VIP客户消费趋势', favorited: true }
              ]
            }
          ]
        },
        {
          id: 12,
          name: '财务报表12',
          reports: [
            { id: 2001, name: '损益表', favorited: false },
            { id: 2002, name: '现金流量表', favorited: true },
            { id: 2003, name: '资产负债表', favorited: false },
            { id: 2004, name: '财务比率分析', favorited: false }
          ],
          subcategories: []
        },
        {
          id: 2,
          name: '财务报表',
          reports: [
            { id: 201, name: '损益表', favorited: false },
            { id: 202, name: '现金流量表', favorited: true },
            { id: 203, name: '资产负债表', favorited: false },
            { id: 204, name: '财务比率分析', favorited: false }
          ],
          subcategories: [
            {
              id: 21,
              name: '预算分析',
              reports: [
                { id: 211, name: '部门预算执行', favorited: false },
                { id: 212, name: '年度预算对比', favorited: false }
              ]
            },
            {
              id: 22,
              name: '成本分析',
              reports: [
                { id: 221, name: '生产成本明细', favorited: false },
                { id: 222, name: '运营成本分析', favorited: true }
              ]
            }
          ]
        },
        {
          id: 3,
          name: '运营报表',
          reports: [
            { id: 301, name: '生产效率分析', favorited: false },
            { id: 302, name: '库存周转率', favorited: true }
          ],
          subcategories: [
            {
              id: 31,
              name: '项目进度',
              reports: [
                { id: 311, name: '项目完成状态', favorited: false },
                { id: 312, name: '资源利用率', favorited: false },
                { id: 313, name: '项目风险评估', favorited: true }
              ]
            }
          ]
        },
        {
          id: 4,
          name: '人力资源报表',
          reports: [
            { id: 401, name: '员工满意度调查', favorited: false },
            { id: 402, name: '招聘效率分析', favorited: false },
            { id: 403, name: '员工离职率分析', favorited: false },
            { id: 404, name: '培训效果评估', favorited: true }
          ],
          subcategories: [
            {
              id: 41,
              name: '绩效评估',
              reports: [
                { id: 411, name: '季度绩效总结', favorited: true },
                { id: 412, name: '团队绩效对比', favorited: false }
              ]
            }
          ]
        },
        {
          id: 5,
          name: '市场分析报表',
          reports: [
            { id: 501, name: '市场份额分析', favorited: false },
            { id: 502, name: '竞争对手分析', favorited: true },
            { id: 503, name: '市场趋势预测', favorited: false }
          ],
          subcategories: []
        },
        {
          id: 6,
          name: 'IT系统报表',
          reports: [
            { id: 601, name: '系统可用性报告', favorited: false },
            { id: 602, name: '安全事件报告', favorited: false }
          ],
          subcategories: [
            {
              id: 61,
              name: '性能监控',
              reports: [
                { id: 611, name: '服务器负载', favorited: false },
                { id: 612, name: '网络流量分析', favorited: true },
                { id: 613, name: '数据库性能', favorited: false },
                { id: 614, name: 'API响应时间', favorited: false }
              ]
            }
          ]
        },
        {
          id: 7,
          name: '客户服务报表',
          reports: [
            { id: 701, name: '客户满意度调查', favorited: true },
            { id: 702, name: '服务响应时间分析', favorited: false },
            { id: 703, name: '问题解决率统计', favorited: false }
          ],
          subcategories: [
            {
              id: 71,
              name: '服务质量',
              reports: [
                { id: 711, name: '服务质量评估', favorited: false },
                { id: 712, name: '服务改进建议', favorited: true }
              ]
            }
          ]
        },
        {
          id: 8,
          name: '研发项目报表',
          reports: [
            { id: 801, name: '项目进度跟踪', favorited: false },
            { id: 802, name: '研发资源分配', favorited: true },
            { id: 803, name: '技术债务分析', favorited: false }
          ],
          subcategories: []
        },
        {
          id: 13,
          name: '财务报表13',
          reports: [
            { id: 1301, name: '损益表', favorited: false },
            { id: 1302, name: '现金流量表', favorited: true },
            { id: 1303, name: '资产负债表', favorited: false },
            { id: 1304, name: '财务比率分析', favorited: false }
          ],
          subcategories: []
        },
        {
          id: 14,
          name: '财务报表14',
          reports: [
            { id: 1401, name: '损益表', favorited: false },
            { id: 1402, name: '现金流量表', favorited: true },
            { id: 1403, name: '资产负债表', favorited: false },
            { id: 1404, name: '财务比率分析', favorited: false }
          ],
          subcategories: []
        },
        {
          id: 15,
          name: '财务报表15',
          reports: [
            { id: 1401, name: '损益表', favorited: false },
            { id: 1402, name: '现金流量表', favorited: true },
            { id: 1403, name: '资产负债表', favorited: false },
            { id: 1404, name: '财务比率分析', favorited: false }
          ],
          subcategories: []
        },
      ]
    };
  },
  computed: {
    // 计算总报表数
    totalReports() {
      let count = 0;
      this.categories.forEach(category => {
        count += category.reports.length;
        category.subcategories.forEach(subcategory => {
          count += subcategory.reports.length;
        });
      });
      return count;
    },

    // 计算收藏数量
    favoriteCount() {
      let count = 0;
      this.categories.forEach(category => {
        count += category.reports.filter(r => r.favorited).length;
        category.subcategories.forEach(subcategory => {
          count += subcategory.reports.filter(r => r.favorited).length;
        });
      });
      return count;
    },

    // 过滤分类（根据搜索关键词）
    filteredCategories() {
      if (!this.searchQuery) {
        return this.categories;
      }

      const query = this.searchQuery.toLowerCase();
      return this.categories
        .map(category => {
          // 深拷贝分类对象
          const copiedCategory = JSON.parse(JSON.stringify(category));

          // 过滤主分类报表
          copiedCategory.reports = copiedCategory.reports.filter(report => report.name.toLowerCase().includes(query));

          // 过滤子分类
          copiedCategory.subcategories = copiedCategory.subcategories
            .map(subcategory => {
              const copiedSubcategory = JSON.parse(JSON.stringify(subcategory));
              copiedSubcategory.reports = copiedSubcategory.reports.filter(report => report.name.toLowerCase().includes(query));
              return copiedSubcategory;
            })
            .filter(subcategory => subcategory.reports.length > 0);

          return copiedCategory;
        })
        .filter(category => category.reports.length > 0 || category.subcategories.length > 0);
    }
  },
  methods: {
    // 获取分类下总报表数（包括子分类）
    getTotalReports(category) {
      let count = category.reports.length;
      category.subcategories.forEach(sub => {
        count += sub.reports.length;
      });
      return count;
    },

    // 预览报表
    previewReport(report) {
      this.$message({
        message: `预览报表: ${report.name}`,
        type: 'info',
        duration: 1500
      });
      // 实际应用中这里应该打开预览对话框
    },

    // 切换收藏状态
    toggleFavorite(report) {
      report.favorited = !report.favorited;
      this.$message({
        message: report.favorited ? '已添加到收藏' : '已取消收藏',
        type: 'success',
        duration: 1500
      });
      // 实际应用中这里应该发送API请求更新服务器状态
    },

    // 执行搜索
    performSearch() {
      if (this.searchQuery.trim() === '') return;

      this.$message({
        message: `搜索关键词: ${this.searchQuery}`,
        type: 'info',
        duration: 1500
      });
    },

    // 清空搜索
    clearSearch() {
      this.searchQuery = '';
      this.$message({
        message: '已清空搜索条件',
        type: 'info',
        duration: 1500
      });
    },

    // 显示筛选对话框
    showFilterDialog() {
      this.$message({
        message: '打开筛选对话框',
        type: 'info'
      });
      // 实际应用中这里应该打开筛选对话框
    },

    // 创建新报表
    createNewReport() {
      this.$message({
        message: '创建新报表',
        type: 'info'
      });
      // 实际应用中这里应该打开创建报表的界面
    }
  }
};
</script>

<style scoped>
.report-container {
  width: 100%;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.header-title {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.header-title i {
  margin-right: 12px;
  color: #409eff;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.search-box {
  width: 300px;
}

/* 瀑布流布局 */
.waterfall-container {
  column-count: 4;
  column-gap: 20px;
}

.category-card {
  break-inside: avoid;
  margin-bottom: 20px;
  display: inline-block;
  width: 100%;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: white;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  background: linear-gradient(135deg, #409eff 0%, #64b5ff 100%);
  color: white;
}

.category-title {
  font-size: 18px;
  font-weight: 600;
}

.report-count {
  background: rgba(255, 255, 255, 0.25);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.category-content {
  padding: 0;
}

.report-list {
  padding: 15px 20px;
}

.report-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.report-item:last-child {
  border-bottom: none;
}

.report-name {
  font-weight: 500;
  color: #606266;
  flex: 1;
  padding-right: 15px;
}

.report-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.subcategory {
  margin-top: 15px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  overflow: hidden;
}

.subcategory-header {
  padding: 10px 15px;
  background: #f8fafd;
  font-weight: 500;
  color: #409eff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

.subcategory-content {
  padding: 10px 15px;
  background: white;
}

.footer {
  text-align: center;
  padding: 25px;
  margin-top: 50px;
  color: #909399;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
  column-span: all;
}

.empty-state i {
  font-size: 50px;
  margin-bottom: 15px;
  color: #c0c4cc;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .waterfall-container {
    column-count: 3;
  }
}

@media (max-width: 992px) {
  .waterfall-container {
    column-count: 2;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .search-box {
    width: 100%;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .waterfall-container {
    column-count: 1;
  }

  .header-title {
    justify-content: center;
  }
}

/* 按钮样式微调 */
.preview-btn {
  padding: 6px 10px;
}

.favorite-btn {
  padding: 6px 10px;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 收藏按钮动画 */
.favorite-btn .el-icon-star-on {
  color: #e6a23c;
}
</style>