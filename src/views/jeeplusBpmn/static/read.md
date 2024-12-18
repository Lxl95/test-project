Palette：左侧元素工具栏，可以通过点击或者拖拽触发添加新元素
Shapes：所有 Bpmn.js 可见节点，Moddle 描述文件内可发现均继承自 Element
Connections：所有节点之间的连线，Bpmn.js 中连线的类型均为 SequenceFlow
ContentPad：用鼠标选中一个元素时会出现，主要是操作该元素的上下文以及节点自身的类型等
PopupMenu：默认在鼠标点击 ContentPad 中的扳手图表时出现，主要用于控制选中元素类型的调整等

示例图：https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c18d9a5ad307428ba33b9ea74ca6a9e2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1444&h=939&s=133315&e=png&b=fefefe


1. 左侧工具栏配置 node_modules\jeeplus-bpmn\lib\features\palette\PaletteProvider.js
2. 