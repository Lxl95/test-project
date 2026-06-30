<template>
  <div class="review-detail-page">
    <!-- Tab切换 -->
    <el-tabs v-model="activeTab" class="tabs" @tab-click="handleTabClick">
      <el-tab-pane label="会审邀请" name="invite">
        <!-- 点击折叠/展开：邀请人头部 -->
        <div class="invite-header" @click="showMemberList = !showMemberList">
          <div class="inviter-info">
            <p class="inviter">邀请人: {{ inviteInfo.name }}</p>
            <p class="time">{{ inviteInfo.time }}</p>
          </div>
          <i class="el-icon-arrow-down arrow-icon" :class="{rotate: !showMemberList}"></i>
          <span class="cancel-tag">已取消</span>
        </div>

        <!-- 会审人员列表：独立滚动、不超出页面 -->
        <div class="member-scroll-wrap" v-show="showMemberList">
          <div class="member-list">
            <div class="member-item" v-for="(item, index) in memberList" :key="index">
              <div class="item-left">
                <div class="status-icon" :class="item.statusClass">
                  <i :class="item.iconClass"></i>
                </div>
                <div class="info">
                  <p class="role">{{ item.role }}</p>
                  <p class="name">{{ item.name }}</p>
                  <p class="feedback" v-if="item.status === '未反馈'">反馈内容: {{ item.status }}</p>
                  <p class="feedback-time" v-else>{{ item.feedbackTime }}</p>
                </div>
              </div>
              <div class="item-right">
                <span class="status-text" :class="item.status === '参加' ? 'join' : 'unfeedback'">
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="会审详情" name="detail">
        <div class="empty-tip">暂无会审详情</div>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部按钮 -->
    <div class="footer-btn">
      <el-button type="primary" class="submit-btn" @click="startReview">发起图纸会审</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewDetail',
  data() {
    return {
      activeTab: 'invite',
      showMemberList: true, // 控制人员列表显示/隐藏
      inviteInfo: {
        name: '田霖',
        time: '2026-03-09 16:16:49'
      },
      memberList: [
        {
          role: '燃气公司领导',
          name: '柴忠帅',
          status: '未反馈',
          statusClass: 'yellow',
          iconClass: 'el-icon-success',
          feedbackTime: ''
        },
        {
          role: '燃气公司领导',
          name: '田霖',
          status: '未反馈',
          statusClass: 'yellow',
          iconClass: 'el-icon-success',
          feedbackTime: ''
        },
        {
          role: '燃气公司领导',
          name: '田霖',
          status: '参加',
          statusClass: 'blue',
          iconClass: 'el-icon-check',
          feedbackTime: '2026-03-09 16:16:49'
        },
        {
          role: '监理',
          name: '闫秉义',
          status: '未反馈',
          statusClass: 'yellow',
          iconClass: 'el-icon-success',
          feedbackTime: ''
        },
        { role: '施工员', name: '张三', status: '未反馈', statusClass: 'yellow', iconClass: 'el-icon-success' },
        { role: '施工员', name: '李四', status: '未反馈', statusClass: 'yellow', iconClass: 'el-icon-success' },
        { role: '施工员', name: '王五', status: '未反馈', statusClass: 'yellow', iconClass: 'el-icon-success' },
      ]
    }
  },
  methods: {
    handleTabClick(tab) {
      console.log('当前Tab:', tab.name)
    },
    startReview() {
      this.$message.success('发起图纸会审成功')
    }
  }
}
</script>

<style scoped lang="scss">
.review-detail-page {
  height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ::v-deep .el-tabs__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

/* 邀请人头部 */
.invite-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  position: relative;
  cursor: pointer;

  .inviter-info {
    .inviter {
      font-size: 18px;
      margin: 0 0 8px;
    }
    .time {
      font-size: 16px;
      color: #666;
      margin: 0;
    }
  }

  .arrow-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #999;
    transition: transform 0.3s;

    &.rotate {
      transform: translateY(-50%) rotate(-180deg);
    }
  }

  .cancel-tag {
    position: absolute;
    right: 0;
    top: 0;
    background-color: #ccc;
    color: #fff;
    padding: 2px 8px;
    font-size: 12px;
    transform: rotate(45deg) translate(25%, -10%);
    transform-origin: top right;
  }
}

/* 人员列表独立滚动容器 */
.member-scroll-wrap {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  border-bottom: 1px solid #eee;

  .item-left {
    display: flex;
    align-items: flex-start;

    .status-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      margin-top: 3px;

      &.yellow {
        background-color: #ffc107;
        i { color: #fff; font-size: 12px; }
      }
      &.blue {
        background-color: #409eff;
        i { color: #fff; font-size: 12px; }
      }
    }

    .info {
      .role { font-size: 17px; margin: 0 0 5px; }
      .name { font-size: 16px; color: #666; margin: 0 0 8px; }
      .feedback, .feedback-time { font-size: 15px; color: #666; margin: 0; }
    }
  }

  .item-right {
    .status-text {
      font-size: 17px;
      &.join { color: #333; }
      &.unfeedback { color: #666; }
    }
  }
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 30px 0;
}

.footer-btn {
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);

  .submit-btn {
    width: 100%;
    height: 45px;
    font-size: 17px;
  }
}
</style>