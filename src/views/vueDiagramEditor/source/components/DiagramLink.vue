<template>
  <g
    @mouseenter="hovered = true"
    @mouseleave="hovered=false"
    @mousedown="$emit('mousedown', $event)"
  >
    <path
      :d="curve"
      :style="largeStrokeStyle"
      stroke-width="8"
      fill="none"
    />
    <path
      :d="curve"
      style="stroke:rgb(0,0,0);"
      stroke-width="2"
      fill="none"
    />
    <!-- 面板 -->
      <foreignObject
        v-if="hovered"
        :x="contextMenuX"
        :y="contextMenuY"
        width="60px"
        height="120px"
      >
        <div class="panel">
          <el-button size="mini" type="danger" circle icon="el-icon-delete" @click="deletePath()" />
          <!-- <i class="el-icon-delete" @click="deletePath()"></i> -->
        </div>
      </foreignObject>
  </g>
</template>
<script>
import Link from '../models/Link';
import Node from '../models/Node';

export default {
  name: "DiagramLink",
  props: {
    link: {type: Link, required: true},
    nodeStart: {type: Node, required: true},
    nodeEnd: {type: Node, required: true},
    selected: {type: Boolean, default: false},
    contextMenuX: {type: Number, default: 0},
    contextMenuY: {type: Number, default: 0},
  },

  data: () => ({
    hovered: false,
  }),

  computed: {
    
    startCoordinates() {
      return this.nodeStart.getPortCoordinates('out', this.link.start_port);
    },
    endCoordinates() {
      return this.nodeEnd.getPortCoordinates('in', this.link.end_port);
    },
    x1() {
      return this.startCoordinates.x - 2;
    },

    y1() {
      return this.startCoordinates.y;
    },

    x2() {
      return this.endCoordinates.x + 1;
    },

    y2() {
      return this.endCoordinates.y;
    },

    curve() {
      let x1 = Math.trunc(this.x1),
        y1 = Math.trunc(this.y1),
        x2 = Math.trunc(this.x2),
        y2 = Math.trunc(this.y2);

      let distance = Math.trunc(4 * Math.sqrt(Math.abs(x1 - x2))) + 10;
      return `M${x1},${y1} C${x1 + distance},${y1} ${x2 - distance},${y2} ${x2},${y2}`;
    },

    largeStrokeStyle() {
      if (this.selected) {
        return this.hovered ? 'stroke:rgba(0,0,255,0.6);' : 'stroke:rgba(0,0,255,0.4);';
      }
      return this.hovered ? 'stroke:rgba(255,0,0,0.5);' : 'stroke:rgba(255,0,0,0.0);';
    }
  },
  methods: {
    deletePath() {
      if (this.link && this.link.id) {
          this.$emit('deletePath', this.link.id);
        }
    },
    // 显示删除按钮
    showPanel(event) {
      console.log(event);
      this.hovered = true;
      this.contextMenuX = event.offsetX;
      this.contextMenuY = event.offsetY;
    },
  }
  
};
</script>
