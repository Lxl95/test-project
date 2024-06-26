<template>
  <div>
    <FullCalendar class="fullCalendar" ref="fullCalendar" :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import listPlugin from '@fullcalendar/list';
import timelinePlugin from '@fullcalendar/timeline';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

export default {
  components: {
    FullCalendar // 像使用自定义组件一样使用
  },
  data() {
    return {
      calendarApi: null,
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, multiMonthPlugin, listPlugin, timelinePlugin, resourceTimelinePlugin], // 需要用哪个插件引入后放到这个数组里
        initialDate: new Date(), // 日历第一次加载时显示的初始日期。可以解析为Date的任何职包括ISO8601日期字符串，例如"2014-02-01"。
        initialView: 'resourceTimelineWeek', // 日历加载时的初始视图，默认值为'dayGridMonth'，可以为任何可用视图的值，如例如'dayGridWeek'，'timeGridDay'，'listWeek', 'multiMonthYear'
        // timeGridFourDay 只展示四天
        // initialView: 'timeGridFourDay'
        // views: {
        //   timeGridFourDay: {
        //     type: 'timeGrid',
        //     duration: { days: 4 },
        //     buttonText: '4 day'
        //   }
        // },
        locale: 'zh-cn', // 设置日历的语言，中文为 “zh-cn”
        firstDay: '1', // 设置每周的第一天，默认值取决于当前语言环境，该值为代表星期几的数字，且值必须为整数，星期日=0
        weekNumberCalculation: 'ISO', // 指定"ISO"结果为ISO8601周数。指定"ISO"将firstDay的默认值更改为1（Monday）
        buttonText: {
          // 文本将显示在headerToolbar / footerToolbar的按钮上。不支持HTML注入。所有特殊字符将被转义。
          today: '今天',
          year: '年',
          month: '月',
          week: '周',
          day: '天'
        },

        headerToolbar: {
          // 在日历顶部定义按钮和标题。将headerToolbar选项设置为false不会显示任何标题工具栏。可以为对象提供属性start/center/end或left/center/right。这些属性包含带有逗号/空格分隔值的字符串。用逗号分隔的值将相邻显示。用空格分隔的值之间会显示一个很小的间隙。
          left: 'prev,next today',
          center: 'title',
          // right: 'dayGridMonth,dayGridWeek,dayGridDay'
          right: 'listMonth,listWeek,listDay'
          // right: 'timeGridWeek,timeGridDay'
        },
        allDaySlot: false, // 周、日视图时，all-day不显示
        eventTimeFormat: {
          // 在每个事件上显示的时间的格式
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        events: [
          {
            // 将在日历上显示的事件对象， events 可以是数组、json、函数。具体可以查看官方文档
            title: '标题',
            resourceId: 'a',
            calenderName: 'lxl',
            start: new Date('2023-8-5'),
            end: new Date('2023-8-25'), // 这里要注意，end为可选参数，无end参数时该事件仅在当天展示
            backgroundColor: '#FDEBC9', // 该事件的背景颜色
            borderColor: '#FDEBC9', // 该事件的边框颜色
            textColor: '#F9AE26' // 该事件的文字颜色
          }
        ],
        resourceAreaColumns: [
          {
            field: 'title',
            headerContent: '日程'
          },
          {
            field: 'calenderName',
            headerContent: 'calenderName'
          }
        ],
        resources: [
          // {
          //   title: '标题',
          //   id: 'a'
          //   // eventBackgroundColor: '#FDEBC9', // 该事件的背景颜色
          //   // eventBorderColor: '#FDEBC9', // 该事件的边框颜色
          //   // eventTextColor: '#F9AE26' // 该事件的文字颜色
          // }
        ],
        customButtons: {
          // 定义可在headerToolbar / footerToolbar中使用的自定义按钮
          today: {
            text: '今天', // 按钮的展示文本
            click: this.todayClick // 点击按钮触发的事件，这里要注意的是当按钮绑定了事件之后该按钮原本自带的事件将会失效
          },
          next: {
            click: this.nextClick
          },
          prev: {
            click: this.prevClick
          }
        },
        eventClick: this.handleDateClick, // 点击事件时，触发该回调
        eventMouseEnter: this.handleMouseEnter, // 鼠标悬停在事件上时，触发该回调
        eventMouseLeave: this.handleMouseLeave, // 鼠标移除时，触发该回调
        dateClick: this.handleDateClick // 当用户单击日期或时间时,触发该回调，触发此回调，您必须加载interaction插件
      }
    };
  },
  mounted() {
    // 这里有两点要注意，想要调用插件的方法，要在组件上设置ref
    // 并且在组件未加载的时候this.$refs中是没有fullCalendar的，所以未加载的时候调用方法会报错
    this.calendarApi = this.$refs.fullCalendar.getApi();
    this.calendarOptions.resources = this.calendarOptions.events.map(event => {
      return {
        id: event.resourceId,
        calenderName: event.calenderName,
        title: event.resourceId
      };
    });
  },
  methods: {
    handleDateClick(dateClickInfo) {
      console.log(dateClickInfo);
    },
    handleMouseEnter(mouseEnterInfo) {
      console.log(mouseEnterInfo.event.startStr);
      // 提示：mouseEnterInfo.event.startStr 可以获取当前事件的开始事件
    },
    handleMouseLeave(mouseEnterInfo) {
      console.log(mouseEnterInfo);
    },
    todayClick(mouseEvent, htmlElement) {
      this.calendarApi.today(); // 将日历移动到当前日期。
      this.calendarApi.getDate(); // 返回日期的日历的当前日期
    },
    nextClick(mouseEvent, htmlElement) {
      this.calendarApi.next(); // 将日历向前移动一步（例如，一个月或一周）。
      // 如果dayGridMonth查看日历，则将日历向前移动一个月。
      // 如果日历位于dayGridWeek或中timeGridWeek，则将日历向前移动一周。
      // 如果日历位于dayGridDay或中timeGridDay，则将日历向前移动一天。
    },
    prevClick(mouseEvent, htmlElement) {
      this.calendarApi.prev(); // 将日历后退一步（例如，一个月或一周）。
      // 如果dayGridMonth查看日历，则将日历后移一个月。
      // 如果日历位于dayGridWeek或中timeGridWeek，则将日历后移一周。
      // 如果日历位于dayGridDay或中timeGridDay，则将日历移回一天。
    }
  }
};
</script>
