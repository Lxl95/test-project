<template>
  <div>
    <h1>在线数据库设计编辑器</h1>
    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script>
import go from 'gojs';

export default {
  name: 'DatabaseDesignEditor',
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      const $ = go.GraphObject.make;

      // 创建画布
      const diagram = $(go.Diagram, this.$refs.editorContainer, {
        grid: $(go.Panel, 'Grid', { gridCellSize: new go.Size(10, 10) }),
        'undoManager.isEnabled': true // 启用撤销/重做
      });

      // 定义表节点模板
      diagram.nodeTemplate =
        $(go.Node, 'Auto',
          $(go.Shape, 'Rectangle', {
            fill: '#ffffff',
            stroke: '#333',
            strokeWidth: 2
          }),
          $(go.Panel, 'Vertical',
            $(go.TextBlock, {
              margin: 5,
              font: 'bold 14px sans-serif',
              textAlign: 'center'
            }, new go.Binding('text', 'name')),
            $(go.Panel, 'Table',
              {
                defaultAlignment: go.Spot.Left,
                defaultStretch: go.GraphObject.Horizontal
              },
              $(go.TextBlock, 'Fields:', {
                row: 0,
                column: 0,
                margin: new go.Margin(5, 0, 0, 5),
                font: 'bold 12px sans-serif'
              }),
              $(go.Panel, 'Vertical',
                {
                  row: 1,
                  column: 0,
                  margin: new go.Margin(0, 5, 5, 5)
                },
                new go.Binding('Panel', 'fields', function(fields) {
                  return fields.map(field =>
                    $(go.TextBlock, {
                      text: `${field.name}: ${field.type}`,
                      margin: new go.Margin(2, 0)
                    })
                  );
                })
              )
            )
          )
        );

      // 定义连线模板
      diagram.linkTemplate =
        $(go.Link,
          $(go.Shape, {
            stroke: '#333',
            strokeWidth: 2
          }),
          $(go.Shape, {
            toArrow: 'Standard',
            fill: '#333',
            stroke: null
          })
        );

      // 示例数据
      const model = $(go.GraphLinksModel);
      model.nodeDataArray = [
        {
          key: 'users',
          name: 'users',
          fields: [
            { name: 'id', type: 'INT' },
            { name: 'name', type: 'VARCHAR' },
            { name: 'email', type: 'VARCHAR' }
          ],
          loc: '0 0'
        },
        {
          key: 'orders',
          name: 'orders',
          fields: [
            { name: 'id', type: 'INT' },
            { name: 'product', type: 'VARCHAR' },
            { name: 'quantity', type: 'INT' }
          ],
          loc: '300 0'
        }
      ];
      model.linkDataArray = [
        { from: 'users', to: 'orders' }
      ];

      // 加载数据
      diagram.model = model;
    }
  }
};
</script>

<style>
.editor-container {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  background-color: #f8f9fa;
}
</style>