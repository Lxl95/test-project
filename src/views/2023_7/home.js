// 会议室列表数据
let meetingRoomList = [
  { id: 0, name: '会议室1' },
  { id: 0, name: '会议室2' },
  { id: 0, name: '会议室3' }
];
// 会议室1日程安排
let scheduleList0 = [
  { id: 1, title: '小破孩', userId: 3, beginDate: '2023-07-11 09:30', endDate: '2023-07-13 11:30', remark: '备注内容', status: '#f08f00' },
  { id: 2, title: '项目会议', userId: 2, beginDate: '2023-08-14 09:30', endDate: '2023-08-14 14:30', remark: '备注内容', status: '#6bb377' },
  { id: 3, title: '供应商接待', userId: 3, beginDate: '2023-09-18 10:00', endDate: '2023-09-18 12:30', remark: '备注内容', status: '#6bb377' },
  { id: 4, title: '部门周会', userId: 2, beginDate: '2023-10-18 13:30', endDate: '2023-10-19 15:30', remark: '备注内容', status: '#999' },
  { id: 5, title: '项目分析会', userId: 1, beginDate: '2023-11-29 14:30', endDate: '2023-11-29 17:00', remark: '备注内容', status: '#6bb377' }
];
// 会议室2日程安排
let scheduleList1 = [
  { id: 1, title: '小破孩', userId: 2, beginDate: '2023-08-03 09:30', endDate: '2023-08-05 11:30', remark: '备注内容', status: '#f08f00' },
  { id: 2, title: '项目会议', userId: 3, beginDate: '2023-09-10 09:30', endDate: '2023-09-11 14:30', remark: '备注内容', status: '#6bb377' },
  { id: 3, title: '供应商接待', userId: 1, beginDate: '2023-10-15 10:00', endDate: '2023-10-17 12:30', remark: '备注内容', status: '#6bb377' },
  { id: 4, title: '部门周会', userId: 1, beginDate: '2023-11-23 13:30', endDate: '2023-11-23 15:30', remark: '备注内容', status: '#999' },
  { id: 5, title: '项目分析会', userId: 2, beginDate: '2023-12-26 14:30', endDate: '2023-12-29 17:00', remark: '备注内容', status: '#6bb377' }
];
export default {
  meetingRoomList,
  scheduleList0,
  scheduleList1
};
