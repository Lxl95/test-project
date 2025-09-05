// 业务流程数据：包含分类、颜色、子流程及数量
const processData = [
    {
      name: '准备工作',
      color: '#4CAF50', // 绿色
      children: [
        { name: '施工任务委托书', count: 1 },
        { name: '施工派工单', count: 1 },
        { name: '图纸会审及设计交底', count: 1 },
        { name: '施工技术及安全交底', count: 1 },
      ]
    },
    {
      name: '开工准备',
      color: '#4CAF50',
      children: [
        { name: '测量放线', count: 1 },
        { name: '测量放线报验单', count: 1 },
        { name: '施工组织设计', count: 1 },
        { name: '开工报告', count: 1 },
        { name: '开工报审单', count: 1 },
      ]
    },
    {
      name: '沟槽开挖',
      color: '#4CAF50',
      children: [
        { name: '管沟开挖', count: 1 },
        { name: '管沟开挖报验单', count: 1 },
      ]
    },
    {
      name: '管道焊接',
      color: '#2196F3', // 蓝色
      children: [
        { name: 'PE管热熔焊接', count: 4 },
        { name: 'PE管电熔焊接', count: 1 },
        { name: '钢制管道焊接', count: 0 },
        { name: '钢管焊缝表面质量检查', count: 0 },
        { name: '单线图', count: 0 },
        { name: '翻边切削检查记录', count: 0 },
        { name: '管道焊接报验单', count: 0 },
      ]
    },
    {
      name: '管道安装',
      color: '#4CAF50',
      children: [
        { name: '管道安装检查记录', count: 1 },
        { name: '管道安装报验单', count: 1 },
      ]
    },
    {
      name: '埋地阀门安装',
      color: '#9E9E9E', // 灰色
      children: [
        { name: '埋地阀门试验', count: 0 },
        { name: '埋地阀门安装', count: 0 },
        { name: '埋地阀门安装报验单', count: 0 },
      ]
    },
    {
      name: '管沟回填',
      color: '#2196F3',
      children: [
        { name: 'PE管示踪线导通性检测', count: 0 },
        { name: '管沟回填检查记录', count: 1 },
        { name: '管沟回填报验单', count: 1 },
      ]
    },
    {
      name: '隐蔽工程',
      color: '#2196F3',
      children: [
        { name: '隐蔽工程验收记录', count: 2 },
        { name: '隐蔽工程封闭记录', count: 2 },
        { name: '隐蔽工程报验单', count: 1 },
      ]
    },
    {
      name: '管道吹扫试压',
      color: '#4CAF50',
      children: [
        { name: '管道吹扫', count: 1 },
        { name: '管道强度试验', count: 1 },
        { name: '管道严密性试验', count: 1 },
        { name: '吹扫试压报验单', count: 1 },
      ]
    },
    {
      name: '竣工管理',
      color: '#9E9E9E',
      children: [
        { name: '竣工自检及预验收', count: 0 },
        { name: '竣工验收', count: 0 },
      ]
    },
    {
      name: '合规检查',
      color: '#2196F3',
      children: [
        { name: '监理旁站', count: 3 },
        { name: '巡检记录', count: 0 },
        { name: '巡检整改', count: 0 },
        { name: '安全质量检查', count: 0 },
        { name: '现场签证', count: 0 },
        { name: '临电作业票', count: 1 },
        { name: '带气作业票', count: 0 },
        { name: '吊装作业票', count: 0 },
        { name: '动火作业票', count: 0 },
        { name: '动土作业票', count: 1 },
        { name: '高空作业票', count: 0 },
        { name: '受限空间作业票', count: 0 },
      ]
    }
  ];