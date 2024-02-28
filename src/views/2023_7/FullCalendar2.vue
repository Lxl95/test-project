<template>
  <el-container style="width: 100%; flex-direction: column">
    <div class="tag-tip">
      <el-tag size="small" color="#f08f00">审核中</el-tag>
      <el-tag size="small" color="#6bb377">已审核</el-tag>
      <el-tag size="small" color="#999">已结算</el-tag>
    </div>
    <el-row type="flex" justify="space-between">
      <el-col :span="4">
        <div class="room-content">
          <div class="room-title">会议室列表</div>
          <div class="room-list" :class="{ 'active-list': index === activeNum }" v-for="(item, index) in meetingRoomList" :key="index" @click="chooseRoom(index)">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="calendar-box">
          <full-calendar ref="fullCalendar" style="height: 100%" :options="calendarOptions"></full-calendar>
        </div>
      </el-col>
    </el-row>
    <!--日程新增弹窗start-->
    <el-dialog title="会议新增" :visible.sync="dialogVisible" :before-close="close" width="45%">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" size="small" class="demo-ruleForm">
        <el-form-item label="会议主题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="会议室使用人" prop="userId">
          <el-select v-model="form.userId" clearable filterable placeholder="请选择会议室使用人">
            <el-option v-for="item in userList" :key="item.userId" :label="item.name" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议开始时间" required>
          <el-col :span="11">
            <el-form-item prop="startDate" style="margin-bottom: 0">
              <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="form.startDate" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="startTime" style="margin-bottom: 0">
              <el-time-select
                placeholder="选择时间"
                v-model="form.startTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '23:30 '
                }"
                style="width: 100%"
              ></el-time-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="会议结束时间" required>
          <el-col :span="11">
            <el-form-item prop="endDate" style="margin-bottom: 0">
              <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="form.endDate" style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="endTime" style="margin-bottom: 0">
              <el-time-select
                placeholder="选择时间"
                v-model="form.endTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '23:30 ',
                  minTime: form.startTime
                }"
                style="width: 100%"
              ></el-time-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="会议备注" prop="desc">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('form')">取消</el-button>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--日程新增弹窗end-->
  </el-container>
</template>

<script>
// 引入日历组件
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
// 引入js数据
import array from './home.js';

export default {
  name: 'Home',
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data() {
    return {
      activeNum: 0,
      dialogVisible: false,
      meetingRoomList: [],
      subList: [],
      userList: [
        {
          userId: 1,
          name: '吕小布'
        },
        {
          userId: 2,
          name: '曾小贤'
        },
        {
          userId: 3,
          name: '胡一菲'
        }
      ],
      form: {
        title: '',
        userId: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        remark: ''
      },
      rules: {
        title: [{ required: true, message: '请输入会议主题', trigger: 'blur' }],
        userId: [{ required: true, message: '请选择会议室使用人', trigger: 'change' }],
        startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
        remark: [{ required: true, message: '请填写会议备注', trigger: 'blur' }]
      },
      calendarOptions: {
        //   timeGridPlugin  可显示每日时间段
        height: 700,
        plugins: [dayGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGrid'
          // right: 'agendaWeek,dayGridWeek,dayGrid'
        },
        buttonText: {
          // 设置按钮
          today: '今天',
          month: '月',
          week: '周',
          dayGrid: '天'
        },
        // allDaySlot: false,
        editable: true,
        selectable: true,
        navLinks: true,
        // displayEventEnd: true,//所有视图显示结束时间
        initialView: 'dayGridMonth', // 设置默认显示月，可选周、日
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        select: this.handleDateSelect,
        // timezone
        // 设置日程
        events: [
          // {
          // 	id: 1,
          // 	title: '09:30~11:30 小破孩',
          // 	start: '2020-12-11',
          // 	end: '2020-12-13',
          // 	color: '#f08f00',
          // },
          // {
          // 	id: 2,
          // 	title: '9:30~14:30 项目会议',
          // 	start: '2020-12-14',
          // 	end: '2020-12-14',
          // 	color: '#6bb377',
          // },
        ],
        eventColor: '#f08f00', // 修改日程背景色
        locale: 'zh-cn', // 设置语言
        weekNumberCalculation: 'ISO', // 周数
        customButtons: {
          prev: {
            // this overrides the prev button
            text: 'PREV',
            click: () => {
              this.prev();
            }
          },
          next: {
            // this overrides the next button
            text: 'PREV',
            click: () => {
              this.next();
            }
          },
          today: {
            text: '今天',
            click: () => {
              this.today();
            }
          }
        }
      }
    };
  },
  mounted() {
    // 获取用户信息
    this.calendarApi = this.$refs.fullCalendar.getApi();
    this.meetingRoomList = array.meetingRoomList;
    this.getReservationList(array.scheduleList0);
  },
  methods: {
    getReservationList(arrayData) {
      let newArr = [];
      this.subList = arrayData;
      arrayData.forEach(item => {
        newArr.push({
          start: this.dealWithTime(item.beginDate),
          end: this.addDate(this.dealWithTime(item.endDate), 1),
          color: item.status,
          id: item.id,
          title: `${this.getTitle(item.beginDate, item.endDate)} ${item.title}`
        });
      });
      this.calendarOptions.events = newArr;
    },
    // 切换教室
    chooseRoom(index) {
      this.activeNum = index;
      // 查询该会议室下面的会议事件
      if (index === 0) {
        this.getReservationList(array.scheduleList0);
      } else if (index === 1) {
        this.getReservationList(array.scheduleList1);
      }
    },
    // 日期加1天
    addDate(date, days) {
      var d = new Date(date);
      d.setDate(d.getDate() + days);
      var mon = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
      let endD = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      return `${d.getFullYear()}-${mon}-${endD}`;
    },
    // 获取会议事件title
    getTitle(date1, date2) {
      let start = date1.substring(11, 16);
      let end = date2.substring(11, 16);
      return `${start}~${end}`;
    },
    getShowTime(beginDate, endDate) {
      this.form.startDate = this.dealWithTime(beginDate);
      this.form.startTime = this.getHoursMin(beginDate);
      this.form.endDate = this.dealWithTime(endDate);
      this.form.endTime = this.getHoursMin(endDate);
    },
    // 获取时分时间
    getHoursMin(value) {
      return value.substring(11, 16);
    },
    // 处理会议时间格式
    dealWithTime(date) {
      let newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date)[0];
      return newDate;
    },
    // 点击日历
    handleDateClick: function (arg) {
      this.$forceUpdate();
      console.log(arg, '事件1');
      this.dialogVisible = true;
    },
    // 日历日程点击事件
    handleEventClick(calEvent) {
      console.log(calEvent, '事件2');
      this.dialogVisible = true;
      let id = calEvent.event.id;
      let info = this.subList.filter(item => {
        return item.id == id;
      });
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(info[0]));
        // 处理时间回显
        this.getShowTime(this.form.beginDate, this.form.endDate);
        console.log(info[0], '数据');
      });
    },
    handleEvents(events) {
      console.log(events, '事件3');
    },
    handleDateSelect(selectInfo) {
      console.log(selectInfo, '事件4');
    },
    // 切换上一个按钮
    prev() {
      this.calendarApi.prev();
    },
    // 切换下一个按钮事件
    next() {
      this.calendarApi.next();
    },
    // 点击今天按钮
    today() {
      this.calendarApi.today();
    },
    // 提交数据
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.startDate = `${this.form.startDate} ${this.form.startTime}`;
          this.form.endDate = `${this.form.endDate} ${this.form.endTime}`;
          console.log(this.form, '数据');
          this.dialogVisible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    //关闭弹窗，重置表单
    close() {
      this.dialogVisible = false;
      this.$refs['form'].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.calendar-box {
  height: 710px;
  overflow-y: scroll;
}
.tag-tip {
  text-align: right;
  margin-bottom: 20px;
}
//左侧会议室列表
.room-content {
  box-shadow: 0 0 5px #999;
  padding-top: 15px;
  text-align: center;
  .room-title {
    font-size: 16px;
    font-weight: bold;
    border-bottom: 2px solid #3aa1ff;
    padding-bottom: 15px;
  }
  .room-list {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    i {
      position: absolute;
      top: 14px;
      right: 15px;
    }
  }
  .room-list:last-child {
    border: none;
  }
}
.active-list,
.room-list:hover {
  background-color: #3aa1ff;
  color: #fff;
}
.line {
  text-align: center;
}
</style>
