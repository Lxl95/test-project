<template>
  <VueDiagram divClassName="vue-diagram" :initDiagram="initDiagram" :nodeDataArray="nodeDataArray" :linkDataArray="linkDataArray" :modelData="modelData" @modelChange="handleModelChange" />
</template>

<script>
import go from 'gojs';
import { VueDiagram } from 'gojs-vue';
export default {
    name: 'go-js',
  components: {
    VueDiagram
  },
  data: () => {
    return {
      nodeDataArray: [
        { key: 'Alpha', color: 'lightblue' },
        { key: 'Beta', color: 'orange' },
        { key: 'Gamma', color: 'lightgreen' },
        { key: 'Delta', color: 'pink' }
      ],
      linkDataArray: [
        { key: -1, from: 'Alpha', to: 'Beta' },
        { key: -2, from: 'Alpha', to: 'Gamma' },
        { key: -3, from: 'Beta', to: 'Beta' },
        { key: -4, from: 'Gamma', to: 'Delta' },
        { key: -5, from: 'Delta', to: 'Alpha' }
      ],
      modelData: {
        canRelink: true
      }
    };
  },
  methods: {
    initDiagram() {
      const $ = go.GraphObject.make;
      const diagram = $(go.Diagram, {
        'undoManager.isEnabled': true,
        model: $(go.GraphLinksModel, {
          linkKeyProperty: 'key'
        })
      });
      diagram.nodeTemplate = $(
        go.Node,
        'Auto',
        $(go.Shape, 'RoundedRectangle', { strokeWidth: 0, fill: 'white', portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer' }, new go.Binding('fill', 'color')),
        $(
          go.TextBlock,
          {
            margin: 8,
            font: 'bold 14px sans-serif',
            stroke: '#333'
          },
          new go.Binding('text', 'key')
        )
      );

      diagram.linkTemplate = $(
        go.Link,
        new go.Binding('relinkableFrom', 'canRelink').ofModel(),
        new go.Binding('relinkableTo', 'canRelink').ofModel(),
        $(go.Shape),
        $(go.Shape, { toArrow: 'Standard' })
      );

      return diagram;
    },
    handleModelChange(data) {
        console.log(data);
      const insertedNodeKeys = data.insertedNodeKeys;
      const modifiedNodeData = data.modifiedNodeData;
      const removedNodeKeys = data.removedNodeKeys;
      const insertedLinkKeys = data.insertedLinkKeys;
      const modifiedLinkData = data.modifiedLinkData;
      const removedLinkKeys = data.removedLinkKeys;

      // ... make state changes
    }
  }
};
</script>

<style scoped>
.gojs-diagram {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
