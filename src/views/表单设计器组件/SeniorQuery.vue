<template>
  <div>
    <el-button type="primary" icon="el-icon-search" class="action-btn" v-popover:popover>高级查询</el-button>
    <div class="condition-tags">
      <div v-for="(condition, index) in conditions" :key="index" :class="['condition-tag', condition.highlight ? 'highlight' : '']">
        <el-tooltip v-if="condition.valueDisplay && condition.valueDisplay.length > 20" :content="condition.valueDisplay" placement="top" effect="dark">
          <span class="tag-span">{{ condition.group }} · {{ condition.label }}: {{ condition.valueDisplay }}</span>
        </el-tooltip>
        <span v-else>{{ condition.group }} · {{ condition.label }}: {{ condition.valueDisplay }}</span>
        <i class="el-icon-close close" @click="removeCondition(index)"></i>
      </div>
      <div v-if="conditions.length === 0" class="empty-tip">暂无查询条件，点击"高级查询"按钮添加条件</div>
    </div>
    <el-button type="text" @click="clearAllConditions" :disabled="conditions.length === 0">清空所有条件</el-button>
    <!-- 高级查询Popover -->
    <el-popover ref="popover" placement="bottom" width="540" trigger="click">
      <div class="popover-content">
        <!-- 档案组 -->
        <div class="group-section">
          <div class="group-title">
            <!-- <i class="fas fa-folder-open"></i> -->
            档案组
          </div>
          <div class="query-form">
            <div class="form-group">
              <label>姓名</label>
              <el-input v-model="archiveForm.name" placeholder="请输入姓名"></el-input>
            </div>
            <div class="form-group">
              <label>年龄范围</label>
              <div style="display: flex; gap: 10px">
                <el-input v-model="archiveForm.minAge" placeholder="最小年龄" type="number"></el-input>
                <el-input v-model="archiveForm.maxAge" placeholder="最大年龄" type="number"></el-input>
              </div>
            </div>
            <div class="form-group">
              <label>性别</label>
              <el-select v-model="archiveForm.gender" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </div>
            <div class="form-group">
              <label>部门</label>
              <el-select v-model="archiveForm.department" multiple collapse-tags placeholder="请选择部门">
                <el-option label="技术部123456789" value="技术部123456789"></el-option>
                <el-option label="市场部123456789" value="市场部123456789"></el-option>
                <el-option label="财务部123456789" value="财务部123456789"></el-option>
                <el-option label="人事部123456789" value="人事部123456789"></el-option>
                <el-option label="行政部123456789" value="行政部123456789"></el-option>
              </el-select>
            </div>
            <div class="form-group">
              <label>职位</label>
              <el-input v-model="archiveForm.position" placeholder="请输入职位"></el-input>
            </div>
            <div class="form-group">
              <label>在职状态</label>
              <el-select v-model="archiveForm.status" placeholder="请选择状态">
                <el-option label="在职" value="在职"></el-option>
                <el-option label="离职" value="离职"></el-option>
                <el-option label="休假" value="休假"></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <!-- 费用组 -->
        <div class="group-section">
          <div class="group-title">
            <!-- <i class="fas fa-money-bill-wave"></i> -->
            费用组
          </div>
          <div class="query-form">
            <div class="form-group">
              <label>薪资范围</label>
              <div style="display: flex; gap: 10px">
                <el-input v-model="expenseForm.minSalary" placeholder="最低薪资" type="number">
                  <template slot="prepend">¥</template>
                </el-input>
                <el-input v-model="expenseForm.maxSalary" placeholder="最高薪资" type="number">
                  <template slot="prepend">¥</template>
                </el-input>
              </div>
            </div>
            <div class="form-group">
              <label>报销金额</label>
              <el-input v-model="expenseForm.reimburse" placeholder="请输入报销金额" type="number">
                <template slot="prepend">¥</template>
              </el-input>
            </div>
            <div class="form-group">
              <label>费用类型</label>
              <el-select v-model="expenseForm.expenseType" placeholder="请选择费用类型">
                <el-option label="交通费" value="交通费"></el-option>
                <el-option label="餐饮费" value="餐饮费"></el-option>
                <el-option label="住宿费" value="住宿费"></el-option>
                <el-option label="办公用品" value="办公用品"></el-option>
                <el-option label="差旅费" value="差旅费"></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="popover-footer">
          <el-button type="text" @click="resetForm">重置条件</el-button>
          <div>
            <el-button @click="closePopover">取消</el-button>
            <el-button type="primary" @click="addConditions">应用条件</el-button>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script>
export default {
  props: {},
  components: {},
  name: 'Query',
  data() {
    return {
      conditions: [],
      // 档案组表单
      archiveForm: {
        name: '',
        minAge: '',
        maxAge: '',
        gender: '',
        department: '',
        position: '',
        status: ''
      },
      // 费用组表单
      expenseForm: {
        minSalary: '',
        maxSalary: '',
        reimburse: '',
        expenseType: ''
      }
    };
  },
  computed: {},
  mounted() {
  },
  methods: {

    // 添加查询条件
    addConditions() {
      this.conditions = [];
      // 添加档案组条件
      if (this.archiveForm.name) {
        this.addCondition('档案组', '姓名', '包含', this.archiveForm.name, 'name');
      }
      if (this.archiveForm.minAge) {
        this.addCondition('档案组', '最小年龄', '>=', this.archiveForm.minAge, 'age', true);
      }
      if (this.archiveForm.maxAge) {
        this.addCondition('档案组', '最大年龄', '<=', this.archiveForm.maxAge, 'age', true);
      }
      if (this.archiveForm.gender) {
        this.addCondition('档案组', '性别', '=', this.archiveForm.gender, 'gender');
      }
      if (this.archiveForm.department && this.archiveForm.department.length > 0) {
        this.addCondition('档案组', '部门', '=', this.archiveForm.department.join(','), 'department');
      }
      if (this.archiveForm.position) {
        this.addCondition('档案组', '职位', '包含', this.archiveForm.position, 'position');
      }
      if (this.archiveForm.status) {
        this.addCondition('档案组', '状态', '=', this.archiveForm.status, 'status');
      }

      // 添加费用组条件
      if (this.expenseForm.minSalary) {
        this.addCondition('费用组', '最低薪资', '>=', this.expenseForm.minSalary, 'salary', false, '¥');
      }
      if (this.expenseForm.maxSalary) {
        this.addCondition('费用组', '最高薪资', '<=', this.expenseForm.maxSalary, 'salary', false, '¥');
      }
      if (this.expenseForm.reimburse) {
        this.addCondition('费用组', '报销金额', '=', this.expenseForm.reimburse, 'reimburse', false, '¥');
      }
      if (this.expenseForm.expenseType) {
        this.addCondition('费用组', '费用类型', '=', this.expenseForm.expenseType, 'expenseType');
      }

      this.closePopover();
      this.$message.success('查询条件已添加');
    },

    // 添加单个条件
    addCondition(group, label, operator, value, field, isNumber = false, prefix = '') {
      const condition = {
        group,
        label,
        operator,
        value,
        field,
        valueDisplay: prefix + value
      };
      // 添加条件
      this.conditions.push(condition);
    },

    // 移除单个条件
    removeCondition(index) {
      this.conditions.splice(index, 1);
      this.$message.info('已移除查询条件');
    },

    // 清空所有条件
    clearAllConditions() {
      this.conditions = [];
      this.$message.info('已清空所有查询条件');
    },

    // 重置表单
    resetForm() {
      this.archiveForm = {
        name: '',
        minAge: '',
        maxAge: '',
        gender: '',
        department: '',
        position: '',
        status: ''
      };
      this.expenseForm = {
        minSalary: '',
        maxSalary: '',
        reimburse: '',
        expenseType: ''
      };
      this.$message.info('已重置查询条件');
    },

    // 关闭Popover
    closePopover() {
      this.$refs.popover.doClose();
    }
  }
};
</script>
  <style scoped>
.condition-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 15px;
  min-height: 42px;
}
.condition-tag {
  display: flex;
  align-items: center;
  background: linear-gradient(120deg, #e6f7ff 0%, #bae7ff 100%);
  border: 1px solid #91d5ff;
  border-radius: 20px;
  padding: 6px 15px;
  color: #096dd9;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(145, 213, 255, 0.2);
  transition: all 0.3s;
}
.condition-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(145, 213, 255, 0.3);
}
.condition-tag .close {
  cursor: pointer;
  margin-left: 8px;
  color: #8c8c8c;
  font-size: 16px;
  transition: all 0.2s;
}
.condition-tag .close:hover {
  color: #f5222d;
  transform: scale(1.2);
}
.tag-span {
  display: inline-block;
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popover-content {
  width: 500px;
  padding: 15px 20px;
}
.group-title {
  font-size: 17px;
  color: #1890ff;
  padding: 8px 0;
  margin: 10px 0 15px;
  border-bottom: 2px solid #e6f7ff;
  display: flex;
  align-items: center;
  gap: 8px;
}
.query-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #595959;
  font-weight: 500;
  font-size: 14px;
}
.form-group .el-input,
.form-group .el-select {
  width: 100%;
}
.popover-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
.empty-tip {
  text-align: center;
  color: #bfbfbf;
  padding: 20px 0;
  font-size: 14px;
}

.action-btn {
  transition: all 0.3s;
}
.action-btn:hover {
  transform: scale(1.05);
}
</style>