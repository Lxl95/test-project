<template>
  <div>
    <h1>在线数据库设计编辑器</h1>
    <v-stage ref="stage" :config="stageConfig">
      <v-layer ref="layer">
        <!-- 表节点 -->
        <v-group
          v-for="table in tables"
          :key="table.id"
          :config="{
            x: table.x,
            y: table.y,
            draggable: true
          }"
        >
          <!-- 表的外框 -->
          <v-rect
            :config="{
              width: 200,
              height: 100,
              fill: '#ffffff',
              stroke: '#333',
              strokeWidth: 2
            }"
          />
          <!-- 表名 -->
          <v-text
            :config="{
              x: 10,
              y: 10,
              text: table.name,
              fontSize: 14,
              fill: '#333'
            }"
          />
          <!-- 字段列表 -->
          <v-group
            v-for="(field, index) in table.fields"
            :key="field.name"
            :config="{
              x: 10,
              y: 30 + index * 20
            }"
          >
            <v-text
              :config="{
                text: `${field.name}: ${field.type}`,
                fontSize: 12,
                fill: '#333'
              }"
            />
          </v-group>
        </v-group>

        <!-- 表之间的连线 -->
        <v-line
          v-for="link in links"
          :key="`${link.from}-${link.to}`"
          :config="{
            points: link.points,
            stroke: '#333',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round'
          }"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>

export default {
  data() {
    return {
      stageConfig: {
        width: window.innerWidth,
        height: 600
      },
      tables: [
        {
          id: 'users',
          name: 'users',
          x: 50,
          y: 50,
          fields: [
            { name: 'id', type: 'INT' },
            { name: 'name', type: 'VARCHAR' },
            { name: 'email', type: 'VARCHAR' }
          ]
        },
        {
          id: 'orders',
          name: 'orders',
          x: 300,
          y: 50,
          fields: [
            { name: 'id', type: 'INT' },
            { name: 'product', type: 'VARCHAR' },
            { name: 'quantity', type: 'INT' }
          ]
        }
      ],
      links: [
        {
            from: 'users',
            to: 'orders',
            points: [
              50 + 200, 50 + 50, // 从 users 表的右侧中心
              300, 50 + 50 // 到 orders 表的左侧中心
            ]
          }
      ]
    };
  },
  mounted() {
    this.updateLinks();
    this.$refs.stage.getStage().on('dragmove', this.updateLinks);
  },
  methods: {
    // 更新连线
    updateLinks() {
      const stage = this.$refs.stage.getStage();
      const usersTable = stage.findOne('#users');
      const ordersTable = stage.findOne('#orders');
      console.log(usersTable);
      console.log(ordersTable);

      if (usersTable && ordersTable) {
        const usersPos = usersTable.getAbsolutePosition();
        const ordersPos = ordersTable.getAbsolutePosition();

        this.links = [
          {
            from: 'users',
            to: 'orders',
            points: [
              usersPos.x + 200, usersPos.y + 50, // 从 users 表的右侧中心
              ordersPos.x, ordersPos.y + 50 // 到 orders 表的左侧中心
            ]
          }
        ];
      }
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