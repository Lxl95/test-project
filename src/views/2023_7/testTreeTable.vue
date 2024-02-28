<template>
  <div>
    <el-table
      ref="myTable"
      :data="tableData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectChange"
      @select-all="handleSelectAll"
    >
      <el-table-column type="selection" width="50" :selectable="selectable"></el-table-column>
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isAllCheck: false,
      tableData: [
        {
          id: '1',
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          children: [
            {
              id: '1-1',
              date: '2016-05-04',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1517 弄'
            },
            {
              id: '1-2',
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄',
              children: [
                {
                  id: '1-2-1',
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄',
                  children: [
                    {
                      id: '1-2-1-1',
                      date: '2016-05-01',
                      name: '王小虎',
                      address: '上海市普陀区金沙江路 1519 弄'
                    }
                  ]
                },
                {
                  id: 32,
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
                }
              ]
            },
            {
              id: '1-3',
              date: '2016-05-03',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1516 弄'
            }
          ]
        }
      ]
    };
  },
  methods: {
    selectable(row, index) {
      if (row.children && row.children.length > 0) {
        return false;
      } else {
        return true;
      }
    },
    handleSelectChange(val) {
      console.log(
        'val',
        val.map(node => node.id)
      );
    },
    handleSelectAll() {
      if (this.isAllCheck) {
        this.$refs.myTable.clearSelection();
      } else {
        this.setAllCheck(this.tableData);
      }
      this.isAllCheck = !this.isAllCheck;
    },
    setAllCheck(arr) {
      arr.forEach(row => {
        if (row.children && row.children.length > 0) {
          this.setAllCheck(row.children);
        } else {
          this.$refs.myTable.toggleRowSelection(row, true);
        }
      });
    }
  }
};
</script>
