<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="selection" label="选择" width="180">
        <template slot="header" slot-scope="scope">
          <div>
            <el-checkbox
              v-model="selection"
              :indeterminate="isIndeterminate"
              @click.prevent.stop.native="
                handleSelectedFn('selection', 'isIndeterminate', scope)
              "
            >
            </el-checkbox>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            <el-checkbox
              v-model="scope.row.selection"
              @click.prevent.stop.native="
                handleListSelectedFn('selection', 'isIndeterminate', scope)
              "
            >
            </el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址" width="180">
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="180"></el-table-column>
      <el-table-column prop="isRight" label="是否通过" width="180">
        <template slot="header" slot-scope="scope">
          <div>
            {{ '是否通过' }}
            <el-checkbox
              v-model="pass"
              :indeterminate="isIndeterminate1"
              @click.prevent.stop.native="
                handleSelectedFn('pass', 'isIndeterminate1', scope)
              "
            >
            </el-checkbox>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            <el-checkbox
              v-model="scope.row.pass"
              @click.prevent.stop.native="
                handleListSelectedFn('pass', 'isIndeterminate1', scope)
              "
            >
            </el-checkbox>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button type="primary" @click="getTableDataFn">确定</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          name: '张三',
          address: '3',
          phone: '1',
          selection: false,
          pass: false
        },
        {
          name: '李四',
          address: '3',
          phone: '1',
          selection: false,
          pass: false
        },
        {
          name: '王五',
          address: '3',
          phone: '1',
          selection: false,
          pass: false
        },
        {
          name: '赵六',
          address: '3',
          phone: '1',
          selection: false,
          pass: false
        }
      ],
      pass: false,
      selection: false,
      isIndeterminate: false,
      isIndeterminate1: false
    }
  },
  methods: {
    handleSelectedFn(selectionvalue, isIndeterminatevalue) {
      // 点击table头部全选框
      // 头部全选框状态改变
      this[selectionvalue] = !this[selectionvalue]
      // 列表选择框状态改变
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i][selectionvalue] = this[selectionvalue]
        this[isIndeterminatevalue] = false
      }
    },
    handleListSelectedFn(selectionvalue, isIndeterminatevalue, scope) {
      // 点击table列表内的选择框
      // table列表内选择框状态改变
      this.tableData[scope.$index][selectionvalue] =
        !this.tableData[scope.$index][selectionvalue]
      // 判断是否在全选状态下
      let statusSelectio = this.allSelectionFn(selectionvalue)
      if (statusSelectio) {
        // 列表全部被选中,头部变更为选中状态
        this[selectionvalue] = true
        this[isIndeterminatevalue] = false
        return false
      }
      // 列表有选中且非全选，头部全选框待定状态
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i][selectionvalue] === true) {
          this[isIndeterminatevalue] = true
          return false
        }
      }
      // 列表有没有选中，头部全选框未选状态
      this[isIndeterminatevalue] = false
      this[selectionvalue] = false
    },
    allSelectionFn(selectionvalue) {
      // 判断是否在全选状态下
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i][selectionvalue] !== true) {
          return false
        }
      }
      return true
    },
    getTableDataFn() {
      for (let i = 0; i < this.tableData.length; i++) {
        console.log('selection:', this.tableData[i].selection)
        console.log('pass:', this.tableData[i].pass)
      }
    }
  }
}
</script>
