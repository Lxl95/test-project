<template>
  <div>
    <el-button type="primary" @click="handleExport">导出 Excel</el-button>
  </div>
</template>

<script>
import XLSX from 'xlsx'   // 使用 xlsx-style
import FileSaver from 'file-saver'

export default {
  methods: {
    handleExport() {
      // ---------- 1. 准备数据 ----------
      const tableData = [
        { name: '张三', department: '技术部', score: 95 },
        { name: '李四', department: '产品部', score: 88 },
        { name: '王五', department: '设计部', score: 92 }
      ]

      const now = new Date()
      const dateStr =
        now.getFullYear() +
        '年' +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        '月' +
        now.getDate().toString().padStart(2, '0') +
        '日'

      const tableHeaders = ['姓名', '部门', '分数']
      const positions = ['项目经理', '开发工程师', '测试工程师', '运维工程师'] // 岗位列表

      const colCount = tableHeaders.length

      // ---------- 2. 构建二维数组（行数据） ----------
      const rows = []

      // 第1行：大标题（合并所有列）
      const titleRow = Array(colCount).fill('')
      titleRow[0] = '员工信息统计表'
      rows.push(titleRow)

      // 第2行：编号 + 日期（编号在最左，日期在最右）
      const infoRow = Array(colCount).fill('')
      infoRow[0] = '编号：001'
      infoRow[colCount - 1] = '日期：' + dateStr
      rows.push(infoRow)

      // 第3行：表头
      rows.push(tableHeaders)

      // 数据行
      tableData.forEach(item => {
        rows.push([item.name, item.department, item.score])
      })

      // 取消空行，直接在数据下方添加岗位行（横向排列）
      const posRow = Array(colCount).fill('')
      // 将岗位名称依次填入各列（如果岗位数超过列数，则只填前 colCount 个）
      positions.forEach((pos, index) => {
        if (index < colCount) {
          posRow[index] = pos
        }
      })
      rows.push(posRow)

      // ---------- 3. 创建工作簿并设置样式 ----------
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(rows)

      // 设置列宽（适当加宽，以便右侧留白）
      ws['!cols'] = [
        { wch: 25 },
        { wch: 20 },
        { wch: 15 }
      ]

      // 合并标题行（第1行，索引0）
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } }
      ]

      // ---------- 4. 添加样式（使用 xlsx-style） ----------
      // 获取所有单元格的范围
      const range = XLSX.utils.decode_range(ws['!ref'])

      // 遍历所有单元格，设置默认对齐方式（左对齐、垂直居中）
      for (let R = range.s.r; R <= range.e.r; R++) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const addr = XLSX.utils.encode_cell({ r: R, c: C })
          if (!ws[addr]) continue
          if (!ws[addr].s) ws[addr].s = {}
          // 默认左对齐、垂直居中
          ws[addr].s.alignment = {
            horizontal: 'left',
            vertical: 'center'
          }
        }
      }

      // 设置表头（第3行，索引2）样式：加粗、背景色、居中
      const headerRowIndex = 2
      for (let C = 0; C < colCount; C++) {
        const addr = XLSX.utils.encode_cell({ r: headerRowIndex, c: C })
        if (!ws[addr]) continue
        ws[addr].s = {
          font: { bold: true },
          fill: {
            fgColor: { rgb: 'D3D3D3' } // 浅灰色背景
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          }
        }
      }

      // 标题行（第1行）居中、加粗、大字号
      const titleAddr = XLSX.utils.encode_cell({ r: 0, c: 0 })
      if (ws[titleAddr]) {
        ws[titleAddr].s = {
          font: { bold: true, sz: 16 },
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          }
        }
      }

      // 岗位行（最后一行）左对齐，右侧留白（列宽已设，内容靠左即可）
      const lastRowIndex = rows.length - 1
      for (let C = 0; C < colCount; C++) {
        const addr = XLSX.utils.encode_cell({ r: lastRowIndex, c: C })
        if (ws[addr]) {
          if (!ws[addr].s) ws[addr].s = {}
          ws[addr].s.alignment = {
            horizontal: 'left',
            vertical: 'center'
          }
          // 可加粗或加大字体以突出，按需设置
          ws[addr].s.font = { bold: true }
        }
      }

      // ---------- 5. 导出文件 ----------
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          '员工信息统计表.xlsx'
        )
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>