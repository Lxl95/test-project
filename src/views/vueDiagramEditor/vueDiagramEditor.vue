<template>
  <div>
    <VueDiagramEditor
    ref="diagram"
    :node-color="nodeColor"
    :node-pulsable="nodePulsable"
    @select-node="selectNode"
    @created-link="createdLink"
  >
    <!-- <pre slot="node" slot-scope="{node}">{{ format(node) }}</pre> -->
    <pre slot="node" slot-scope="{}"></pre>
  </VueDiagramEditor>
  <el-button type="primary" @click="addTable">addTable</el-button>
  <el-button type="primary" @click="addLink">addLink</el-button>
  <el-button type="primary" @click="Save">Save</el-button>
  <el-table :data="NodeListData" border style="width: 100%">
      <el-table-column prop="id" label="表Id" width=""/>
      <el-table-column prop="title" label="表名" width=""/>
      
  </el-table>
  <el-table :data="LinkListData" border style="width: 100%;margin-top:20px">
      <el-table-column label="起始表Id" prop="start_id" width=""/>
      <el-table-column label="起始表字段名" prop="start_port" width=""/>
      <el-table-column label="目标表Id" prop="end_id" width=""/>
      <el-table-column label="目标表字段名" prop="end_port" width=""/>
      
  </el-table>
  </div>
</template>

<script>
import VueDiagramEditor from 'vue-diagram-editor';
import 'vue-diagram-editor/dist/vue-diagram-editor.css';
// import VueDiagramEditor from './source/index.js';
// import './source/style.scss';
export default {
  name: 'simple-example',
  components: {
    VueDiagramEditor
  },
  data: () => ({
    NodeListData: [],
    LinkListData: [],
    nodes: {
      'node-1': {
        id: 'node-1',
        title: 'Table1',
        size: {
          width: 200,
          height: 220
        },
        StringArray: [ 'kk', 'mm'],
        portsOut: {
          default: 'id',
          title: 'my-title',
          name: 'my-name',
          age: 'my-age',
          school: 'my-school',
        }
      },
      'node-2': {
        id: 'node-2',
        title: 'Table2',
        size: {
          width: 200,
          height: 220
        },
        coordinates: {
          x: 280,
          y: 100
        },
        portsIn: {
          default: 'id',
          name: 'my-name',
          age: 'my-age',
          school: 'my-school',
        },
        portsOut: {
          default: 'id',
          name: 'my-name',
          age: 'my-age',
          school: 'my-school',
        }
      },
    },
    links: {
      'link-1': {
        id: 'link-1',
        start_id: 'node-1',
        start_port: 'default',
        end_id: 'node-2',
        end_port: 'default'
      }
    }
  }),
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$refs.diagram.setModel({
        nodes: this.nodes,
        links: this.links
      });
      this.NodeListData = []
      this.LinkListData = []

      Object.entries(this.nodes).forEach(([key, value]) => {
          this.NodeListData.push(value)
      });

      Object.entries(this.links).forEach(([key, value]) => {
          this.LinkListData.push(value)
      });

    },
    format(node) {
      console.log(node);
      return JSON.stringify(node, null, 2);
    },
    nodeColor(node) {
      if (node.coordinates.x > 200) {
        return '#0f0';
      }
      if (node.coordinates.y > 200) {
        return '#f00';
      }

      return '#00f';
    },

    nodePulsable(node) {
      return node.coordinates.y > 200;
    },
    createdLink(link){
      console.log(link);
    },
    selectNode(node){
      console.log(node);
    },
    addTable() {
      this.$refs.diagram.addNode({
        id: 'node-3',
        title: 'Table3',
        size: {
          width: 200,
          height: 220
        },
        coordinates: {
          x: 560,
          y: 100
        },
        portsIn: {
          default: 'default',
          title: 'my-title',
          name: 'my-name',
          age: 'my-age',
          school: 'my-school',
        },
        portsOut: {
          default: 'default',
          title: 'my-title',
          name: 'my-name',
          age: 'my-age',
          school: 'my-school',
        }
      });
    },
    addLink() {
      this.$refs.diagram.addLink({
        id: 'link-2',
        start_id: 'node-1',
        start_port: 'name',
        end_id: 'node-2',
        end_port: 'age'
      });
    },
    Save() {
      console.log(this.$refs.diagram);
      console.log(this.$refs.diagram.$children[0].nodes);
      console.log(this.$refs.diagram.$children[0].links);
      this.NodeListData = []
      this.LinkListData = []

      Object.entries(this.$refs.diagram.$children[0].nodes).forEach(([key, value]) => {
          this.NodeListData.push(value)
      });

      Object.entries(this.$refs.diagram.$children[0].links).forEach(([key, value]) => {
          this.LinkListData.push(value)
      });

    }
  }
};
</script>