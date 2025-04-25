<template>
  <button @click="exportExcel">导出Excel</button>
</template>

<script>
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default {
  methods: {
    exportExcel() {
  const data = [
    // { 姓名: '张三', 年龄: 25, 入职日期: '2023-01-15', 薪资: 5000.50 },
    // { 姓名: '李四', 年龄: 30, 入职日期: '2021-05-20', 薪资: 8000.75 }
  ];
  
  const ws = XLSX.utils.json_to_sheet(data);
  
  // 设置列宽
  ws['!cols'] = [
    { wch: 15 },  // 姓名列
    { wch: 10 },  // 年龄列
    { wch: 15 },  // 入职日期列
    { wch: 15 }   // 薪资列
  ];
  
  // 设置单元格格式
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      
      if (C === 2) { // 年龄列(索引从0开始)
        ws[cell_ref].t = 'n'; // 数字类型
        ws[cell_ref].z = '0'; // 整数格式
      } else if (C === 3) { // 入职日期列
        ws[cell_ref].t = 'd'; // 日期类型
        ws[cell_ref].z = 'yyyy-mm-dd'; // 日期格式
      } else if (C === 4) { // 薪资列
        ws[cell_ref].t = 'n'; // 数字类型
        ws[cell_ref].z = '#,##0.00'; // 货币格式，两位小数
      }
    }
  }
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "员工数据");
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout]), '员工数据.xlsx');
}
  }
}
</script>