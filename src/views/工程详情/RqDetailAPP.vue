<template>
  <div class="project-dashboard">
    <!-- 顶部标题栏 -->
    <el-header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="title">{{ projectInfo.projectName }}</h1>
          <div class="project-info">
            <span class="project-code">{{ projectInfo.projectCode }}</span>
            <el-tag :type="getStatusType(projectInfo.status)" size="small">
              {{ projectInfo.status }}
            </el-tag>
          </div>
        </div>
        <div class="header-right">
          <div class="progress-container">
            <span class="progress-label">当前进度：</span>
            <el-progress 
              :percentage="projectInfo.progress" 
              :stroke-width="10"
              :color="customColors"
              class="progress-bar"
            />
            <span class="progress-text">{{ projectInfo.progress }}%</span>
          </div>
        </div>
      </div>
    </el-header>

    <div class="main-content">
      <!-- 左侧信息面板 -->
      <div class="left-panel">
        <!-- 工程基本信息卡片 -->
        <el-card class="info-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="el-icon-info"></i>
              工程基本信息
            </span>
          </div>
          <div class="basic-info">
            <div class="info-row">
              <div class="info-item">
                <div class="info-label">
                  <i class="el-icon-location"></i>
                  工程地址
                </div>
                <div class="info-value">{{ projectInfo.address }}</div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <div class="info-label">
                  <i class="el-icon-date"></i>
                  开工日期
                </div>
                <div class="info-value">{{ formatDate(projectInfo.startDate) }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <i class="el-icon-date"></i>
                  计划完工
                </div>
                <div class="info-value">{{ formatDate(projectInfo.endDate) }}</div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <div class="info-label">
                  <i class="el-icon-time"></i>
                  工期天数
                </div>
                <div class="info-value">{{ projectInfo.duration }} 天</div>
              </div>
              <div class="info-item">
                <div class="info-label">
                  <i class="el-icon-sunny"></i>
                  已施工
                </div>
                <div class="info-value">{{ projectInfo.elapsedDays }} 天</div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 单位与人员信息卡片 -->
        <el-card class="info-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="el-icon-office-building"></i>
              相关单位与人员
            </span>
          </div>
          <div class="unit-section">
            <h3 class="section-title">相关单位</h3>
            <div class="units-grid">
              <div 
                v-for="(unit, index) in units" 
                :key="'unit-' + index"
                class="unit-card"
              >
                <div class="unit-type">{{ unit.type }}</div>
                <div class="unit-name">{{ unit.name }}</div>
                <div class="unit-contact">
                  <div class="contact-item">
                    <i class="el-icon-user"></i>
                    <span>{{ unit.contact }}</span>
                  </div>
                  <div class="contact-item">
                    <i class="el-icon-phone"></i>
                    <span>{{ unit.phone }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="personnel-section">
            <h3 class="section-title">相关人员</h3>
            <div class="personnel-grid">
              <div 
                v-for="(person, index) in personnel" 
                :key="'person-' + index"
                class="person-card"
              >
                <div class="person-avatar">
                  <el-avatar :size="45" :src="person.avatar">
                    {{ person.name.charAt(0) }}
                  </el-avatar>
                </div>
                <div class="person-info">
                  <div class="person-name">{{ person.name }}</div>
                  <div class="person-role">{{ person.role }}</div>
                  <div class="person-actions">
                    <el-button 
                      type="text" 
                      size="mini" 
                      icon="el-icon-phone"
                      @click="callPerson(person.phone)"
                      title="拨打电话"
                    ></el-button>
                    <el-button 
                      type="text" 
                      size="mini" 
                      icon="el-icon-message"
                      @click="messagePerson(person.phone)"
                      title="发送消息"
                    ></el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 工程统计卡片 -->
        <el-card class="info-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="el-icon-data-analysis"></i>
              工程统计
            </span>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ stats.totalProcesses }}</div>
              <div class="stat-label">总工序数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.completedProcesses }}</div>
              <div class="stat-label">已完成</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.inProgress }}</div>
              <div class="stat-label">进行中</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.notStarted }}</div>
              <div class="stat-label">未开始</div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧工序展示区域 -->
      <div class="right-panel">
        <el-card class="process-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="el-icon-s-operation"></i>
              工序详情
            </span>
          </div>
          
          <!-- 工序Tab切换 -->
          <div class="process-tabs-container">
            <el-tabs 
              v-model="activeProcessId" 
              type="card" 
              class="process-tabs"
              @tab-click="handleTabClick"
            >
              <el-tab-pane 
                v-for="process in allProcesses" 
                :key="process.id"
                :label="generateTabLabel(process)"
                :name="process.id"
              >
                <!-- 工序详情内容 -->
                <div class="process-detail-content">
                  <!-- 工序基本信息卡片 -->
                  <el-card class="detail-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="detail-title">
                        <i class="el-icon-tickets"></i>
                        工序基本信息
                      </span>
                      <el-tag 
                        :type="getStatusType(process.status)" 
                        size="small"
                        class="process-status-tag"
                      >
                        {{ process.status }}
                      </el-tag>
                    </div>
                    <div class="detail-content">
                      <div class="process-basic-grid">
                        <div class="basic-item">
                          <div class="basic-label">工序编号</div>
                          <div class="basic-value">{{ process.code }}</div>
                        </div>
                        <div class="basic-item">
                          <div class="basic-label">负责人</div>
                          <div class="basic-value">{{ process.manager }}</div>
                        </div>
                        <div class="basic-item">
                          <div class="basic-label">开始时间</div>
                          <div class="basic-value">{{ formatDate(process.startTime) }}</div>
                        </div>
                        <div class="basic-item">
                          <div class="basic-label">结束时间</div>
                          <div class="basic-value">{{ formatDate(process.endTime) }}</div>
                        </div>
                        <div class="basic-item full-width">
                          <div class="basic-label">工序进度</div>
                          <div class="basic-progress">
                            <el-progress 
                              :percentage="process.progress" 
                              :stroke-width="8"
                              :color="customColors"
                              :show-text="false"
                            />
                            <span class="progress-percent">{{ process.progress }}%</span>
                          </div>
                        </div>
                        <div class="basic-item full-width">
                          <div class="basic-label">工序描述</div>
                          <div class="basic-description">{{ process.description }}</div>
                        </div>
                        <div class="basic-item full-width">
                          <div class="basic-label">备注</div>
                          <div class="basic-remark">{{ process.remark || '暂无备注' }}</div>
                        </div>
                      </div>
                    </div>
                  </el-card>

                  <!-- 施工任务列表卡片 -->
                  <el-card class="detail-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="detail-title">
                        <i class="el-icon-s-order"></i>
                        施工任务列表
                        <span class="task-count">({{ process.tasks ? process.tasks.length : 0 }})</span>
                      </span>
                      <el-button 
                        type="primary" 
                        size="mini" 
                        icon="el-icon-plus"
                        class="add-task-btn"
                        @click="addTask(process)"
                      >
                        新增任务
                      </el-button>
                    </div>
                    <div class="detail-content">
                      <div v-if="!process.tasks || process.tasks.length === 0" class="empty-tasks">
                        <el-empty description="暂无施工任务" :image-size="80"></el-empty>
                      </div>
                      <div v-else class="tasks-container">
                        <div 
                          v-for="(task, index) in process.tasks" 
                          :key="index"
                          class="task-card"
                          :class="{ 
                            'task-completed': task.status === '已完成',
                            'task-delayed': task.status === '已延期',
                            'task-in-progress': task.status === '进行中'
                          }"
                        >
                          <div class="task-header">
                            <div class="task-title">
                              <i class="el-icon-s-flag"></i>
                              {{ task.taskName }}
                            </div>
                            <div class="task-right">
                              <el-tag 
                                :type="getStatusType(task.status)" 
                                size="mini"
                                class="task-status"
                              >
                                {{ task.status }}
                              </el-tag>
                              <div class="task-priority" v-if="task.priority">
                                <i class="el-icon-warning" :class="`priority-${task.priority}`"></i>
                              </div>
                            </div>
                          </div>
                          <div class="task-content">
                            <div class="task-info">
                              <div class="info-row">
                                <span class="info-label">执行人：</span>
                                <span class="info-value">{{ task.assignee }}</span>
                              </div>
                              <div class="info-row">
                                <span class="info-label">计划时间：</span>
                                <span class="info-value">{{ task.planTime }}</span>
                              </div>
                              <div v-if="task.actualTime" class="info-row">
                                <span class="info-label">实际完成：</span>
                                <span class="info-value">{{ task.actualTime }}</span>
                              </div>
                              <div v-if="task.estimatedHours" class="info-row">
                                <span class="info-label">预估工时：</span>
                                <span class="info-value">{{ task.estimatedHours }} 小时</span>
                              </div>
                            </div>
                            <div class="task-actions">
                              <el-button 
                                type="text" 
                                size="mini"
                                @click="viewTaskDetail(task)"
                              >
                                <i class="el-icon-view"></i> 详情
                              </el-button>
                              <el-button 
                                type="text" 
                                size="mini"
                                @click="reportTask(task)"
                              >
                                <i class="el-icon-edit"></i> 汇报
                              </el-button>
                              <el-button 
                                type="text" 
                                size="mini"
                                @click="completeTask(task, process)"
                                v-if="task.status !== '已完成'"
                              >
                                <i class="el-icon-check"></i> 完成
                              </el-button>
                            </div>
                          </div>
                          <div class="task-footer" v-if="task.notes">
                            <i class="el-icon-chat-line-round"></i>
                            <span class="task-notes">{{ task.notes }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-card>

                  <!-- 工序图片列表卡片 -->
                  <el-card class="detail-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="detail-title">
                        <i class="el-icon-picture"></i>
                        工序图片列表
                        <span class="image-count">({{ process.images ? process.images.length : 0 }})</span>
                      </span>
                      <el-upload
                        class="upload-btn"
                        action="#"
                        :multiple="true"
                        :show-file-list="false"
                        :before-upload="(file) => beforeImageUpload(file, process)"
                      >
                        <el-button 
                          type="primary" 
                          size="mini" 
                          icon="el-icon-upload"
                        >
                          上传图片
                        </el-button>
                      </el-upload>
                    </div>
                    <div class="detail-content">
                      <div v-if="!process.images || process.images.length === 0" class="empty-images">
                        <el-empty description="暂无工序图片" :image-size="80"></el-empty>
                      </div>
                      <div v-else class="images-container">
                        <div 
                          v-for="(image, index) in process.images" 
                          :key="index"
                          class="image-card"
                        >
                          <div class="image-wrapper" @click="previewImage(index, process)">
                            <el-image
                              :src="image.url"
                              fit="cover"
                              class="process-image"
                              :preview-src-list="getPreviewList(process)"
                            >
                              <div slot="error" class="image-error">
                                <i class="el-icon-picture-outline"></i>
                                <span>加载失败</span>
                              </div>
                            </el-image>
                            <div class="image-overlay">
                              <i class="el-icon-zoom-in"></i>
                            </div>
                            <div class="image-tag" v-if="image.tag">
                              <el-tag size="mini" type="info">{{ image.tag }}</el-tag>
                            </div>
                          </div>
                          <div class="image-info">
                            <div class="image-name">{{ image.name }}</div>
                            <div class="image-meta">
                              <span class="image-time">{{ formatDate(image.time) }}</span>
                              <span class="image-size">{{ image.size || '--' }}</span>
                            </div>
                            <div class="image-uploader">
                              <i class="el-icon-user"></i>
                              <span>{{ image.uploader || '未知' }}</span>
                            </div>
                            <div class="image-actions">
                              <el-button 
                                type="text" 
                                size="mini"
                                @click.stop="deleteImage(image, process)"
                              >
                                <i class="el-icon-delete"></i>
                              </el-button>
                              <el-button 
                                type="text" 
                                size="mini"
                                @click.stop="downloadImage(image)"
                              >
                                <i class="el-icon-download"></i>
                              </el-button>
                              <el-button 
                                type="text" 
                                size="mini"
                                @click.stop="editImageInfo(image)"
                              >
                                <i class="el-icon-edit"></i>
                              </el-button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="image-upload-tip">
                        <i class="el-icon-info"></i>
                        支持上传JPG、PNG格式图片，单张不超过5MB
                      </div>
                    </div>
                  </el-card>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          
          <!-- 当没有工序时显示 -->
          <div v-if="allProcesses.length === 0" class="empty-processes">
            <el-empty description="暂无工序信息" :image-size="100"></el-empty>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectDashboard',
  
  data() {
    return {
      // 工程基本信息
      projectInfo: {
        projectName: 'XX大厦建设工程',
        projectCode: 'GC2024001',
        address: '上海市浦东新区世纪大道100号',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        progress: 65,
        status: '进行中',
        duration: 351,
        elapsedDays: 215
      },
      
      // 单位信息
      units: [
        {
          type: '建设单位',
          name: '上海城市建设集团有限公司',
          contact: '张经理',
          phone: '13800138000'
        },
        {
          type: '设计单位',
          name: '华东建筑设计研究院',
          contact: '李工',
          phone: '13800138001'
        },
        {
          type: '监理单位',
          name: '上海工程建设监理有限公司',
          contact: '王监理',
          phone: '13800138002'
        },
        {
          type: '施工单位',
          name: '中建三局集团有限公司',
          contact: '赵总工',
          phone: '13800138003'
        }
      ],
      
      // 人员信息
      personnel: [
        {
          name: '张三',
          role: '项目经理',
          phone: '13800138004',
          avatar: ''
        },
        {
          name: '李四',
          role: '技术负责人',
          phone: '13800138005',
          avatar: ''
        },
        {
          name: '王五',
          role: '安全员',
          phone: '13800138006',
          avatar: ''
        },
        {
          name: '赵六',
          role: '质量员',
          phone: '13800138007',
          avatar: ''
        }
      ],
      
      // 工程统计
      stats: {
        totalProcesses: 0,
        completedProcesses: 0,
        inProgress: 0,
        notStarted: 0
      },
      
      // 所有工序数据（扁平化结构）
      allProcesses: [],
      
      // 原始工序数据（三级结构）
      processData: [
        {
          id: '1',
          label: '土建工程',
          level: 1,
          children: [
            {
              id: '1-1',
              label: '基础工程',
              level: 2,
              children: [
                {
                  id: '1-1-1',
                  label: '桩基施工',
                  level: 3,
                  code: 'P001',
                  manager: '李工',
                  startTime: '2024-01-20',
                  endTime: '2024-02-20',
                  progress: 100,
                  status: '已完成',
                  description: '完成全部桩基施工，共计200根钻孔灌注桩',
                  remark: '施工质量符合设计要求，检测合格率100%',
                  tasks: [
                    {
                      taskName: '测量放线',
                      assignee: '王五',
                      planTime: '2024-01-20',
                      actualTime: '2024-01-21',
                      status: '已完成',
                      estimatedHours: 8
                    },
                    {
                      taskName: '桩基钻孔',
                      assignee: '赵六',
                      planTime: '2024-01-25',
                      actualTime: '2024-02-10',
                      status: '已完成',
                      estimatedHours: 120,
                      priority: 'high'
                    },
                    {
                      taskName: '钢筋笼安装',
                      assignee: '孙七',
                      planTime: '2024-02-05',
                      status: '进行中',
                      estimatedHours: 48,
                      notes: '需要重点关注焊接质量'
                    }
                  ],
                  images: [
                    {
                      name: '桩基完成图',
                      url: 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=桩基施工',
                      time: '2024-02-20',
                      size: '2.3MB',
                      uploader: '李工',
                      tag: '施工完成'
                    },
                    {
                      name: '质量检测',
                      url: 'https://via.placeholder.com/300x200/50E3C2/FFFFFF?text=质量检测',
                      time: '2024-02-18',
                      size: '1.8MB',
                      uploader: '王监理',
                      tag: '质量检查'
                    }
                  ]
                },
                {
                  id: '1-1-2',
                  label: '基坑开挖',
                  level: 3,
                  code: 'P002',
                  manager: '张工',
                  startTime: '2024-02-21',
                  endTime: '2024-03-15',
                  progress: 80,
                  status: '进行中',
                  description: '正在进行基坑支护和土方开挖，已完成80%工作量',
                  remark: '注意基坑降水和支护安全',
                  tasks: [
                    {
                      taskName: '土方开挖',
                      assignee: '张三',
                      planTime: '2024-02-21',
                      status: '进行中',
                      estimatedHours: 160
                    },
                    {
                      taskName: '基坑支护',
                      assignee: '李四',
                      planTime: '2024-03-01',
                      status: '未开始',
                      estimatedHours: 96,
                      priority: 'medium'
                    }
                  ],
                  images: [
                    {
                      name: '基坑全景',
                      url: 'https://via.placeholder.com/300x200/7ED321/FFFFFF?text=基坑开挖',
                      time: '2024-03-05',
                      size: '3.1MB',
                      uploader: '张工'
                    }
                  ]
                },
                {
                  id: '1-1-3',
                  label: '基础垫层',
                  level: 3,
                  code: 'P003',
                  manager: '王工',
                  startTime: '2024-03-16',
                  endTime: '2024-03-25',
                  progress: 0,
                  status: '未开始',
                  description: '等待基坑验收后进行基础垫层施工',
                  tasks: [],
                  images: []
                }
              ]
            },
            {
              id: '1-2',
              label: '主体结构',
              level: 2,
              children: [
                {
                  id: '1-2-1',
                  label: '钢筋工程',
                  level: 3,
                  code: 'P004',
                  manager: '赵工',
                  startTime: '2024-03-26',
                  endTime: '2024-04-30',
                  progress: 50,
                  status: '进行中',
                  description: '正在进行钢筋绑扎和安装，已完成50%工作量',
                  tasks: [
                    {
                      taskName: '钢筋下料',
                      assignee: '钱工',
                      planTime: '2024-03-26',
                      status: '已完成',
                      estimatedHours: 40
                    },
                    {
                      taskName: '钢筋绑扎',
                      assignee: '孙工',
                      planTime: '2024-04-01',
                      status: '进行中',
                      estimatedHours: 120
                    }
                  ],
                  images: []
                },
                {
                  id: '1-2-2',
                  label: '模板工程',
                  level: 3,
                  code: 'P005',
                  manager: '周工',
                  startTime: '2024-05-01',
                  endTime: '2024-05-20',
                  progress: 0,
                  status: '未开始',
                  description: '等待钢筋工程完成70%后开始',
                  tasks: [],
                  images: []
                }
              ]
            }
          ]
        },
        {
          id: '2',
          label: '安装工程',
          level: 1,
          children: [
            {
              id: '2-1',
              label: '电气工程',
              level: 2,
              children: [
                {
                  id: '2-1-1',
                  label: '预埋管线',
                  level: 3,
                  code: 'E001',
                  manager: '孙工',
                  startTime: '2024-04-01',
                  endTime: '2024-05-31',
                  progress: 30,
                  status: '进行中',
                  description: '正在进行预埋管线施工',
                  tasks: [
                    {
                      taskName: '管线预埋',
                      assignee: '吴工',
                      planTime: '2024-04-01',
                      status: '进行中',
                      estimatedHours: 80
                    }
                  ],
                  images: []
                }
              ]
            }
          ]
        }
      ],
      
      // 当前激活的工序ID
      activeProcessId: '',
      
      // 自定义进度条颜色
      customColors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ]
    };
  },
  
  computed: {
    // 当前激活的工序
    activeProcess() {
      return this.allProcesses.find(p => p.id === this.activeProcessId) || this.allProcesses[0];
    }
  },
  
  methods: {
    // 提取所有三级工序（扁平化）
    extractAllProcesses(data) {
      const processes = [];
      
      const traverse = (nodes) => {
        if (!nodes) return;
        
        for (const node of nodes) {
          if (node.level === 3) {
            // 深拷贝节点，避免修改原始数据
            const process = JSON.parse(JSON.stringify(node));
            // 确保tasks和images存在
            process.tasks = process.tasks || [];
            process.images = process.images || [];
            processes.push(process);
          }
          
          if (node.children && node.children.length > 0) {
            traverse(node.children);
          }
        }
      };
      
      traverse(data);
      return processes;
    },
    
    // 更新统计信息
    updateStats() {
      this.stats.totalProcesses = this.allProcesses.length;
      this.stats.completedProcesses = this.allProcesses.filter(p => p.status === '已完成').length;
      this.stats.inProgress = this.allProcesses.filter(p => p.status === '进行中').length;
      this.stats.notStarted = this.allProcesses.filter(p => p.status === '未开始').length;
    },
    
    // 生成Tab标签
    generateTabLabel(process) {
      let prefix = '';
      if (process.code) {
        prefix = process.code + ' ';
      }
      return prefix + process.label;
    },
    
    // 获取状态对应的标签类型
    getStatusType(status) {
      const statusMap = {
        '已完成': 'success',
        '进行中': 'primary',
        '未开始': 'info',
        '已延期': 'danger',
        '暂停中': 'warning'
      };
      return statusMap[status] || 'info';
    },
    
    // 格式化日期
    formatDate(date) {
      if (!date) return '-';
      return date;
    },
    
    // 处理Tab点击
    handleTabClick(tab) {
      console.log('切换到工序:', tab.name);
    },
    
    // 查看任务详情
    viewTaskDetail(task) {
      this.$message.info(`查看任务：${task.taskName}`);
      // 实际项目中这里可以打开任务详情弹窗
    },
    
    // 汇报任务
    reportTask(task) {
      this.$message.info(`汇报任务：${task.taskName}`);
      // 实际项目中这里可以打开任务汇报表单
    },
    
    // 完成任务
    completeTask(task, process) {
      this.$confirm('确认完成此任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        task.status = '已完成';
        this.$message.success('任务标记为已完成');
        
        // 更新工序进度（示例逻辑）
        const completedTasks = process.tasks.filter(t => t.status === '已完成').length;
        process.progress = Math.round((completedTasks / process.tasks.length) * 100);
      }).catch(() => {});
    },
    
    // 新增任务
    addTask(process) {
      this.$prompt('请输入任务名称', '新增任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '任务名称不能为空'
      }).then(({ value }) => {
        const newTask = {
          taskName: value,
          assignee: '待分配',
          planTime: this.formatDate(new Date()),
          status: '未开始',
          estimatedHours: 8
        };
        
        if (!process.tasks) {
          process.tasks = [];
        }
        process.tasks.push(newTask);
        
        this.$message.success('新增任务成功');
      }).catch(() => {});
    },
    
    // 获取图片预览列表
    getPreviewList(process) {
      if (process && process.images) {
        return process.images.map(img => img.url);
      }
      return [];
    },
    
    // 预览图片
    previewImage(index, process) {
      // 通过预览列表自动实现预览
    },
    
    // 删除图片
    deleteImage(image, process) {
      this.$confirm('确定删除这张图片吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const imgIndex = process.images.findIndex(img => img === image);
        if (imgIndex !== -1) {
          process.images.splice(imgIndex, 1);
          this.$message.success('图片已删除');
        }
      }).catch(() => {});
    },
    
    // 下载图片
    downloadImage(image) {
      this.$message.info(`下载图片：${image.name}`);
      // 实际项目中这里实现图片下载功能
    },
    
    // 编辑图片信息
    editImageInfo(image) {
      this.$prompt('请输入图片描述', '编辑图片信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: image.name
      }).then(({ value }) => {
        image.name = value;
        this.$message.success('图片信息已更新');
      }).catch(() => {});
    },
    
    // 上传前校验
    beforeImageUpload(file, process) {
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 5;
      
      if (!isImage) {
        this.$message.error('只能上传图片文件！');
        return false;
      }
      if (!isLt5M) {
        this.$message.error('图片大小不能超过5MB！');
        return false;
      }
      
      // 模拟上传成功
      const newImage = {
        name: file.name,
        url: URL.createObjectURL(file),
        time: new Date().toISOString().split('T')[0],
        size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
        uploader: '当前用户'
      };
      
      if (!process.images) {
        process.images = [];
      }
      process.images.push(newImage);
      
      this.$message.success('图片上传成功！');
      return false; // 阻止默认上传
    },
    
    // 拨打电话
    callPerson(phone) {
      this.$message.info(`拨打 ${phone}`);
      // 实际项目中这里可以调用拨打电话功能
    },
    
    // 发送消息
    messagePerson(phone) {
      this.$message.info(`发送消息给 ${phone}`);
      // 实际项目中这里可以调用发送短信功能
    }
  },
  
  mounted() {
    // 提取所有三级工序
    this.allProcesses = this.extractAllProcesses(this.processData);
    
    // 更新统计信息
    this.updateStats();
    
    // 设置默认激活的Tab
    if (this.allProcesses.length > 0) {
      this.activeProcessId = this.allProcesses[0].id;
    }
  }
};
</script>

<style scoped>
.project-dashboard {
  height: 100vh;
  background-color: #f5f7fa;
  overflow: auto;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0 24px;
  height: 80px !important;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-left {
  flex: 1;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 5px;
}

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-code {
  font-size: 14px;
  opacity: 0.9;
}

.header-right {
  width: 300px;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-label {
  font-size: 14px;
  white-space: nowrap;
}

.progress-bar {
  flex: 1;
  min-width: 150px;
}

.progress-text {
  font-weight: 600;
  font-size: 14px;
  min-width: 40px;
  text-align: center;
}

.main-content {
  display: flex;
  padding: 20px;
  height: calc(100vh - 80px);
  overflow: hidden;
  gap: 20px;
}

.left-panel {
  width: 35%;
  min-width: 350px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-panel {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}

.info-card,
.process-card {
  border-radius: 12px;
  border: 1px solid #e4e7ed;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title i {
  font-size: 18px;
}

.basic-info {
  padding: 5px 0;
}

.info-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  flex: 1;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.info-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.info-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

/* 单位与人员样式 */
.unit-section,
.personnel-section {
  margin-bottom: 20px;
}

.unit-section:last-child,
.personnel-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.units-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.unit-card {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409EFF;
  transition: all 0.3s;
}

.unit-card:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.unit-type {
  font-size: 12px;
  color: #409EFF;
  margin-bottom: 4px;
  font-weight: 500;
}

.unit-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  line-height: 1.4;
}

.unit-contact {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-item {
  font-size: 12px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 6px;
}

.personnel-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.person-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  gap: 12px;
  transition: all 0.3s;
}

.person-card:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.person-avatar {
  flex-shrink: 0;
}

.person-info {
  flex: 1;
  min-width: 0;
}

.person-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.person-role {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.person-actions {
  display: flex;
  gap: 4px;
}

.person-actions .el-button {
  padding: 2px 6px;
}

/* 统计卡片样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #409EFF;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

/* 工序Tab样式 */
.process-tabs-container {
  margin-top: 10px;
}

.process-tabs {
  min-height: 600px;
}

.process-tabs >>> .el-tabs__header {
  margin-bottom: 0;
}

.process-tabs >>> .el-tabs__content {
  padding: 20px 0;
  min-height: 500px;
}

.process-status-tag {
  float: right;
}

/* 工序详情内容 */
.process-detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-card {
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.detail-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.detail-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-count,
.image-count {
  font-size: 13px;
  color: #909399;
  font-weight: normal;
}

.add-task-btn,
.upload-btn {
  float: right;
}

.detail-content {
  padding: 5px 0;
}

/* 工序基本信息 */
.process-basic-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.basic-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.basic-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.basic-item.full-width {
  grid-column: span 2;
}

.basic-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.basic-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.basic-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.basic-progress .el-progress {
  flex: 1;
}

.progress-percent {
  font-size: 14px;
  font-weight: 600;
  color: #409EFF;
  min-width: 40px;
}

.basic-description,
.basic-remark {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

/* 施工任务卡片 */
.empty-tasks {
  padding: 40px 0;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409EFF;
  transition: all 0.3s;
}

.task-card:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.task-card.task-completed {
  border-left-color: #67C23A;
  background: #f0f9eb;
}

.task-card.task-delayed {
  border-left-color: #F56C6C;
  background: #fef0f0;
}

.task-card.task-in-progress {
  border-left-color: #409EFF;
  background: #ecf5ff;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-priority .priority-high {
  color: #F56C6C;
}

.task-priority .priority-medium {
  color: #E6A23C;
}

.task-priority .priority-low {
  color: #909399;
}

.task-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.task-info {
  flex: 1;
}

.task-info .info-row {
  display: flex;
  margin-bottom: 4px;
  font-size: 13px;
  gap: 0;
}

.task-info .info-row:last-child {
  margin-bottom: 0;
}

.task-info .info-label {
  color: #909399;
  min-width: 70px;
  margin-bottom: 0;
}

.task-info .info-value {
  color: #606266;
  font-weight: 500;
}

.task-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.task-actions .el-button {
  padding: 2px 6px;
}

.task-footer {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #e4e7ed;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 6px;
}

.task-notes {
  flex: 1;
  font-style: italic;
}

/* 工序图片卡片 */
.empty-images {
  padding: 40px 0;
}

.images-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.image-card {
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.image-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.image-wrapper {
  position: relative;
  height: 140px;
  cursor: pointer;
  overflow: hidden;
}

.process-image {
  width: 100%;
  height: 100%;
  display: block;
  transition: transform 0.3s;
}

.image-wrapper:hover .process-image {
  transform: scale(1.05);
}

.image-error {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  gap: 8px;
}

.image-error i {
  font-size: 24px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-wrapper:hover .image-overlay {
  opacity: 1;
}

.image-overlay i {
  color: white;
  font-size: 24px;
}

.image-tag {
  position: absolute;
  top: 8px;
  right: 8px;
}

.image-info {
  padding: 12px;
}

.image-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #909399;
  margin-bottom: 6px;
}

.image-uploader {
  font-size: 11px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.image-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #e4e7ed;
  padding-top: 8px;
}

.image-actions .el-button {
  padding: 2px 6px;
}

.image-upload-tip {
  font-size: 12px;
  color: #909399;
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.empty-processes {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f8f9fa;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .main-content {
    flex-direction: column;
    height: auto;
  }
  
  .left-panel {
    width: 100%;
    min-width: auto;
  }
  
  .units-grid,
  .personnel-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 992px) {
  .process-tabs >>> .el-tabs__nav-wrap {
    overflow-x: auto;
  }
  
  .process-tabs >>> .el-tabs__nav-scroll {
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .process-tabs >>> .el-tabs__nav {
    display: flex;
    flex-wrap: nowrap;
  }
}

@media screen and (max-width: 768px) {
  .header {
    height: auto !important;
    padding: 12px;
  }
  
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .header-right {
    width: 100%;
  }
  
  .main-content {
    padding: 12px;
  }
  
  .units-grid,
  .personnel-grid,
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .process-basic-grid {
    grid-template-columns: 1fr;
  }
  
  .basic-item.full-width {
    grid-column: span 1;
  }
  
  .images-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .task-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .task-actions {
    align-self: flex-end;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>