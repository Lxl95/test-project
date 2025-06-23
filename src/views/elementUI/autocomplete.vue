<template>
  <div class="grouped-autocomplete">
    <el-autocomplete
      v-model="selectedValue"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      @select="handleSelect"
      popper-class="grouped-autocomplete-popper"
    >
      <!-- 自定义下拉项模板 -->
      <template slot-scope="{ item }">
        <div 
          class="suggestion-item"
          :class="{ 'group-header': item.isHeader }"
        >
          <span v-if="item.isHeader">{{ item.label }}</span>
          <span v-else>{{ item.value }}</span>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedValue: '',
      // 原始分组数据
      groups: [
        {
          label: '热门城市',
          options: [
            { value: '北京' },
            { value: '上海' },
            { value: '广州' }
          ]
        },
        {
          label: '其他城市',
          options: [
            { value: '成都' },
            { value: '杭州' },
            { value: '武汉' }
          ]
        }
      ],
      // 处理后的扁平化数据（包含分组标题）
      flatSuggestions: []
    }
  },
  created() {
    // 初始化时处理数据结构
    this.processGroupData()
  },
  methods: {
    // 处理分组数据为扁平结构
    processGroupData() {
      this.flatSuggestions = this.groups.reduce((acc, group) => {
        // 添加分组标题项
        acc.push({
          isHeader: true,
          label: group.label,
          disabled: true // 标记不可选
        })
        // 添加分组子项
        acc.push(...group.options.map(opt => ({
          ...opt,
          group: group.label,
          isHeader: false
        })))
        return acc
      }, [])
      console.log(this.flatSuggestions);
    },

    // 获取建议列表
    querySearch(queryString, cb) {
      let results = queryString
        ? this.flatSuggestions.filter(item => {
            // 过滤逻辑：标题项保留，子项匹配输入
            return item.isHeader || 
              item.value.toLowerCase().includes(queryString.toLowerCase())
          })
        : this.flatSuggestions

      // 优化显示：如果分组下无子项，隐藏标题
      results = this.filterEmptyGroups(results)
      cb(results)
    },

    // 过滤空分组
    filterEmptyGroups(list) {
      return list.filter((item, index) => {
        if (item.isHeader) {
          // 检查下一个元素是否是当前分组的子项
          const nextItem = list[index + 1]
          return nextItem && !nextItem.isHeader && nextItem.group === item.label
        }
        return true
      })
    },

    // 处理选中事件
    handleSelect(item) {
      if (item.disabled) return // 阻止选择标题项
      this.selectedValue = item.value
    }
  }
}
</script>

<style lang="scss">
.grouped-autocomplete-popper {
  /* 分组标题样式 */
  .group-header {
    padding: 8px 15px;
    font-size: 12px;
    color: #999;
    background-color: #f5f7fa;
    cursor: default;

    &:not(:first-child) {
      border-top: 1px solid #ebeef5;
    }
  }

  /* 普通项样式 */
  .suggestion-item:not(.group-header) {
   