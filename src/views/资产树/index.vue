<template>
  <div class="asset-container">
    <!-- 左侧：位置树 -->
    <div class="col left-col">
      <div class="col-header">位置</div>
      <el-input
        v-model="locationFilter"
        placeholder="搜索位置"
        clearable
        size="mini"
        style="margin:8px"
      ></el-input>
      <div class="tree-wrap">
        <el-tree
          :data="locationTree"
          :props="treeProps"
          node-key="id"
          default-expand-all
          @node-click="handleLocationClick"
          :filter-node-method="filterLocationNode"
          ref="locationTree"
        ></el-tree>
      </div>
    </div>

    <!-- 中间：资产树 -->
    <div class="col mid-col">
      <div class="col-header">资产</div>
      <el-input
        v-model="assetFilter"
        placeholder="搜索资产"
        clearable
        size="mini"
        style="margin:8px"
      ></el-input>
      <div class="tree-wrap">
        <el-tree
          :data="assetTree"
          :props="treeProps"
          node-key="id"
          default-expand-all
          @node-click="handleAssetClick"
          :filter-node-method="filterAssetNode"
          ref="assetTree"
        >
          <template slot-scope="{ node }">
            <span>
              <i :class="getNodeIcon(node.data.type)"></i>
              {{ node.data.label }}
            </span>
          </template>
        </el-tree>
      </div>
    </div>

    <!-- 右侧：资产详情 -->
    <div class="col right-col">
      <div v-if="currentAsset" class="detail-wrap">
        <div class="detail-title">{{ currentAsset.label }}</div>
        <el-row :gutter="16">
          <el-col :span="18">
            <el-form label-width="100px" size="mini">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="级别">{{ currentAsset.level }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="供应商">{{ currentAsset.supplier }}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="类别">{{ currentAsset.category }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="制造商">{{ currentAsset.factory }}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="型号">{{ currentAsset.model }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="序列号">{{ currentAsset.sn }}</el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="状态">{{ currentAsset.status }}</el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="关键性">{{ currentAsset.keyLevel }}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="6">
            <div class="asset-img">
              <img v-if="currentAsset.imgUrl" :src="currentAsset.imgUrl" alt="铭牌"/>
              <div v-else>暂无图片</div>
            </div>
          </el-col>
        </el-row>

        <el-tabs v-model="activeTab" style="margin-top:10px;">
          <el-tab-pane label="维护" name="maintain"></el-tab-pane>
          <el-tab-pane label="文档" name="doc"></el-tab-pane>
          <el-tab-pane label="维护计划" name="plan"></el-tab-pane>
          <el-tab-pane label="物料" name="material"></el-tab-pane>
          <el-tab-pane label="特征" name="feature"></el-tab-pane>
        </el-tabs>

        <div class="order-block">
          <div class="order-head">
            <span>工单</span>
            <el-button size="mini" type="primary" icon="el-icon-plus">添加</el-button>
          </div>
          <el-table :data="workOrderList" border size="mini">
            <el-table-column prop="time" label="时间"></el-table-column>
            <el-table-column prop="title" label="工单名称"></el-table-column>
          </el-table>
        </div>
      </div>
      <div v-else class="empty-text">请在中间资产树选择资产查看详情</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      treeProps: { children: 'children', label: 'label' },
      locationFilter: '',
      assetFilter: '',
      locationTree: [
        { label: 'CN-PLC 絮凝沉淀池', id: 1 },
        { label: 'CN-PNC 排泥池', id: 2 },
        { label: 'CN-TSB 中途提升泵房', id: 3 },
        { label: 'CN-QFBZ 庆丰泵站', id: 4 },
        { label: 'SG 上冈水厂', id: 5 }
      ],
      assetTree: [],
      currentAsset: null,
      activeTab: 'maintain',
      workOrderList: [],
      assetSourceData: [
        {
          parentLocId: 3,
          label: 'CN-TSB 中途提升泵房',
          id: 100,
          type: 'room',
          children: [
            {
              label: 'CN-TSB-01ZJ 提升泵一号机组',
              id: 101,
              type: 'unit',
              children: [
                { label: 'CN-TSB-01ZJ-DF 闸阀', id: 1011, type: 'valve' },
                {
                  label: 'CN-TSB-01ZJ-DJ 电机',
                  id: 1012,
                  type: 'motor',
                  level: 'DDJX电动机械',
                  supplier: '',
                  category: '',
                  factory: 'SUP0003西门子电机（中国）有限公司',
                  model: '1LG0310-6AB78-Z',
                  sn: '1106/800005880456/001',
                  status: '1',
                  keyLevel: 'A关键',
                  imgUrl: ''
                },
                { label: 'CN-TSB-01ZJ-SB 水泵', id: 1013, type: 'pump' }
              ]
            },
            {
              label: 'CN-TSB-02ZJ 提升泵二号机组',
              id: 102,
              type: 'unit',
              children: [
                { label: 'CN-TSB-02ZJ-DJ 电机', id: 1022, type: 'motor' }
              ]
            }
          ]
        }
      ]
    }
  },
  watch: {
    locationFilter(val) { this.$refs.locationTree.filter(val) },
    assetFilter(val) { this.$refs.assetTree.filter(val) }
  },
  methods: {
    filterLocationNode(value, data) {
      if (!value) return true
      return data.label.includes(value)
    },
    filterAssetNode(value, data) {
      if (!value) return true
      return data.label.includes(value)
    },
    handleLocationClick(node) {
      const locId = node.id
      this.assetTree = this.assetSourceData.filter(item => item.parentLocId === locId)
      this.currentAsset = null
      this.workOrderList = []
    },
    handleAssetClick(node) {
      this.currentAsset = node
      // this.currentAsset = node.data
      console.log(node);
      this.workOrderList = [
        { time: '2026-06-18 01:00', title: '中途提升泵房1号电机定期维护' },
        { time: '2025-12-18 01:00', title: '中途提升泵房1号电机定期维护' },
        { time: '2025-11-09 01:00', title: '中途提升泵房1号电机大修' }
      ]
    },
    getNodeIcon(type) {
      const iconMap = {
        room: 'el-icon-office-building',
        unit: 'el-icon-s-grid',
        motor: 'el-icon-cpu',
        pump: 'el-icon-odometer',
        valve: 'el-icon-setting'
      }
      return iconMap[type] || 'el-icon-document'
    }
  }
}
</script>

<style scoped lang="scss">
.asset-container {
  display: flex;
  height: calc(100vh - 56px);
  width: 100%;
  overflow: hidden;
}
.col {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e4e7ed;
  overflow: hidden;
}
.left-col {
  width: 260px;
  flex-shrink: 0;
}
.mid-col {
  width: 340px;
  flex-shrink: 0;
}
.right-col {
  flex: 1;
}
.col-header {
  background: #409eff;
  color: #fff;
  padding: 8px 12px;
  font-weight: bold;
}
.tree-wrap {
  flex: 1;
  overflow-y: auto;
}
.detail-wrap {
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
  overflow-y: auto;
}
.detail-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}
.asset-img {
  border: 1px solid #eee;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 100%;
    max-height: 100%;
  }
}
.order-block {
  margin-top: 16px;
}
.order-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: bold;
}
.empty-text {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
</style>