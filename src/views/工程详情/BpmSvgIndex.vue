<template>
  <div class="flow-chart">
    <!-- 节点 -->
    <div
      v-for="node in nodes"
      :key="node.id"
      :class="['flow-node', `status-${node.status}`]"
      :style="{ left: node.x + 'px', top: node.y + 'px' }"
    >
      {{ node.label }}
    </div>

    <!-- 连线（SVG + 箭头）-->
    <svg class="flow-lines" width="400" height="500">
      <!-- 定义箭头 -->
      <defs>
        <!-- 动态颜色箭头：使用 currentColor 继承连线颜色 -->
        <!-- <marker
          id="arrow"
          markerWidth="6"
          markerHeight="4"
          refX="5"
          refY="1.5"
          orient="auto"
        >
          <polygon points="0 0, 5 1.5, 0 3" fill="currentColor" />
        </marker> -->
         <!-- 定义3个颜色箭头，分别对应3种状态 -->
        <marker id="arrow-green" markerWidth="6" markerHeight="4" refX="5" refY="1.5" orient="auto">
          <polygon points="0 0, 5 1.5, 0 3" fill="#52c41a" />
        </marker>
        <marker id="arrow-blue" markerWidth="6" markerHeight="4" refX="5" refY="1.5" orient="auto">
          <polygon points="0 0, 5 1.5, 0 3" fill="#1890ff" />
        </marker>
        <marker id="arrow-gray" markerWidth="6" markerHeight="4" refX="5" refY="1.5" orient="auto">
          <polygon points="0 0, 5 1.5, 0 3" fill="#d9d9d9" />
        </marker>
      </defs>
      
      <path
        v-for="line in lines"
        :key="line.id"
        :d="line.path"
        :stroke="getLineColor(line.toNode)"
        :color="getLineColor(line.toNode)"
        stroke-width="2"
        fill="none"
        :marker-end="line.hasArrow ? getArrowMarker(line.toNode) : ''"
      />
    </svg>
      <!-- 右下角图例 -->
    <div class="legend">
      <div class="legend-item">
        <div class="legend-node status-wait"></div>
        <span>未开始</span>
      </div>
      <div class="legend-item">
        <div class="legend-node status-done"></div>
        <span>已完成</span>
      </div>
      <div class="legend-item">
        <div class="legend-node status-doing"></div>
        <span>处理中</span>
      </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'FlowChart',
  data() {
    return {
      nodes: [
        { id: 1, label: '项目立项', x: 200, y: 40, status: 'done' },
        { id: 2, label: '设计任务', x: 100, y: 150, status: 'done' },
        { id: 3, label: '施工任务', x: 300, y: 150, status: 'doing' },
        { id: 4, label: '图纸会审', x: 100, y: 220, status: 'done' },
        { id: 5, label: '技术交底', x: 200, y: 330, status: 'doing' },
        { id: 6, label: '工序', x: 200, y: 400, status: 'wait' },
        { id: 7, label: '竣工验收', x: 200, y: 465, status: 'wait' },
      ],
      lines: [
        // 1. 项目立项 → 设计任务（双折角 + 连接到节点正中间）
        { id: 1, path: 'M195 60 L195 100 L100 100 L100 130', hasArrow: true, toNode: 2 },
        // 2. 项目立项 → 施工任务（双折角 + 连接到节点正中间）
        { id: 2, path: 'M205 60 L205 100 L300 100 L300 130', hasArrow: true, toNode: 3 },
        // 3. 设计任务 → 图纸会审（新增，带箭头）
        { id: 3, path: 'M100 168 L100 203', hasArrow: true, toNode: 4},
        // 4. 图纸会审 → 技术交底（下 → 右 → 下，无箭头）
        { id: 4, path: 'M100 238 L100 270 L200 270 L200 290', hasArrow: false, toNode: 5 },
        // 5. 施工任务 → 技术交底（无箭头）
        { id: 5, path: 'M300 168 L300 270 L200 270', hasArrow: false, toNode: 5},
        // 6. 合并箭头：指向技术交底
        { id: 6, path: 'M200 290 L200 310', hasArrow: true, toNode: 5 },
        // 7. 技术交底 → 工序
        { id: 7, path: 'M200 348 L200 380', hasArrow: true, toNode: 6 },
        // 8. 工序 → 竣工验收
        { id: 8, path: 'M200 415 L200 445', hasArrow: true, toNode: 7 },
      ],
    };
  },
  methods: {
    // 获取对应颜色箭头
    getArrowMarker(nodeId) {
      const node = this.nodes.find(n => n.id === nodeId);
      if (!node) return 'url(#arrow-gray)';
      if (node.status === 'done') return 'url(#arrow-green)';
      if (node.status === 'doing') return 'url(#arrow-blue)';
      return 'url(#arrow-gray)';
    },
    // 根据目标节点ID获取对应状态颜色
    getLineColor(nodeId) {
      const node = this.nodes.find(n => n.id === nodeId);
      if (!node) return '#ccc';
      switch (node.status) {
        case 'done': return '#52c41a';
        case 'doing': return '#1890ff';
        case 'wait': return '#d9d9d9';
        default: return '#ccc';
      }
    },
    // 修改节点状态
    changeNodeStatus(nodeId, newStatus) {
      const node = this.nodes.find(n => n.id === nodeId);
      if (node) {
        node.status = newStatus;
      }
    },
  },
};
</script>

<style scoped>
.flow-chart {
  position: relative;
  width: 400px;
  height: 500px;
  border: 1px solid #eee;
  background: #fafafa;
}

.flow-node {
  position: absolute;
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 4px;
  background: #fff;
  font-size: 12px;
  transform: translate(-50%, -50%);
}

/* 状态颜色 */
.status-done {
  border-color: #52c41a;
  background-color: #f6ffed;
  color: #52c41a;
}
.status-doing {
  border-color: #1890ff;
  background-color: #e6f7ff;
  color: #1890ff;
}
.status-wait {
  border-color: #d9d9d9;
  background-color: #f5f5f5;
  color: #999;
}

.flow-lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
/* 图例样式 */
.legend {
  position: absolute;
  bottom: 10px;
  right: 20px;
  /* display: flex;
  gap: 12px;
  align-items: center; */
  font-size: 12px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
}
.legend-node {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border-width: 1px;
  border-style: solid;
}
</style>