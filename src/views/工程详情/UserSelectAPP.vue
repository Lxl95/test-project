<template>
  <div class="person-select-page">
    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="搜索人员/角色"
        class="search-input"
      />
      <button class="search-btn" @click="handleSearch">搜索</button>
    </div>

    <!-- 人员列表（两级结构） -->
    <div class="person-list">
      <div
        v-for="role in filteredRoleList"
        :key="role.roleKey"
        class="role-group"
      >
        <!-- 角色组标题（折叠/展开） -->
        <div class="role-title" @click="toggleRoleExpand(role.roleKey)">
          <span class="role-name">{{ role.roleName }}</span>
          <span class="expand-icon">
            {{ role.expanded ? '▼' : '▶' }}
          </span>
        </div>

        <!-- 人员列表（展开时显示） -->
        <div v-if="role.expanded" class="person-items">
          <div
            v-for="person in role.personList"
            :key="person.id"
            class="person-item"
            @click="togglePersonSelect(person, role.roleKey)"
          >
            <input
              :type="isMultiple ? 'checkbox' : 'radio'"
              :checked="person.selected"
              class="select-radio"
              readonly
            />
            <div class="person-info">
              <div class="person-name">{{ person.name }}</div>
              <div class="person-desc">{{ person.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部筛选切换栏 -->
    <div class="filter-bar">
      <button class="filter-btn" @click="switchPersonList">
        {{ currentListType === 'primary' ? '工程' : '全部' }}人员
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PersonSelect',
  props: {
    // 控制单选/多选：true=多选，false=单选
    isMultiple: {
      type: Boolean,
      default: true
    },
    // 初始选中人员ID列表
    defaultSelected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchKeyword: '',
      currentListType: 'primary', // primary/secondary
      // 主人员列表
      primaryPersonList: [
        {
          roleKey: 'engineerManager',
          roleName: '工程经理',
          expanded: true,
          personList: [
            { id: 1, name: '胡荣海', desc: '天津圆通燃气有限公司', selected: false }
          ]
        },
        {
          roleKey: 'techEngineer',
          roleName: '工程技术员',
          expanded: false,
          personList: [
            { id: 2, name: '杨信凯-2', desc: '天津墨缘建设集团有限公司', selected: false }
          ]
        },
        {
          roleKey: 'teamLeader',
          roleName: '施工班组长',
          expanded: true,
          personList: [
            { id: 3, name: '杨信凯-2', desc: '天津墨缘建设集团有限公司', selected: true }
          ]
        },
        {
          roleKey: 'projectManager',
          roleName: '项目经理',
          expanded: false,
          personList: [
            { id: 4, name: '杨信凯-2', desc: '天津墨缘建设集团有限公司', selected: false }
          ]
        },
        {
          roleKey: 'supervisor',
          roleName: '监理',
          expanded: true,
          personList: [
            { id: 5, name: '闫秉义', desc: '北京嘉和华创工程有限公司', selected: true }
          ]
        },
        {
          roleKey: 'designer',
          roleName: '设计员',
          expanded: false,
          personList: [
            { id: 6, name: '刘国辉', desc: '中泓河北工程技术有限公司', selected: false }
          ]
        }
      ],
      // 备用人员列表（示例）
      secondaryPersonList: [
        {
          roleKey: 'qa',
          roleName: '质量员',
          expanded: true,
          personList: [
            { id: 7, name: '张三', desc: 'XX质检公司', selected: false }
          ]
        }
      ]
    }
  },
  computed: {
    // 当前显示的角色列表
    roleList() {
      return this.currentListType === 'primary' ? this.primaryPersonList : this.secondaryPersonList
    },
    // 过滤后的角色列表（根据搜索关键词）
    filteredRoleList() {
      if (!this.searchKeyword) return this.roleList
      const keyword = this.searchKeyword.trim().toLowerCase()
      return this.roleList.map(role => {
        const filteredPersons = role.personList.filter(p => 
          p.name.toLowerCase().includes(keyword) || 
          p.desc.toLowerCase().includes(keyword)
        )
        return {
          ...role,
          personList: filteredPersons,
          expanded: filteredPersons.length > 0 // 有结果时自动展开
        }
      }).filter(role => role.personList.length > 0)
    }
  },
  watch: {
    // 监听默认选中项，初始化选中状态
    defaultSelected: {
      handler(val) {
        this.initSelectedPersons(val)
      },
      immediate: true
    }
  },
  methods: {
    // api/PSysUser/ytTOrgUser
    // 初始化选中人员
    initSelectedPersons(selectedIds) {
      this.roleList.forEach(role => {
        role.personList.forEach(p => {
          p.selected = selectedIds.includes(p.id)
        })
      })
    },
    // 切换角色组展开/折叠
    toggleRoleExpand(roleKey) {
      const role = this.roleList.find(r => r.roleKey === roleKey)
      if (role) role.expanded = !role.expanded
    },
    // 切换人员选中状态
    togglePersonSelect(person, roleKey) {
      if (this.isMultiple) {
        // 多选：直接切换选中状态
        person.selected = !person.selected
      } else {
        // 单选：先取消所有选中，再选中当前项
        this.roleList.forEach(role => {
          role.personList.forEach(p => p.selected = false)
        })
        person.selected = true
      }
      this.$emit('change', this.getSelectedPersons())
    },
    // 执行搜索
    handleSearch() {
      // 搜索逻辑已在computed中实现，此处可加防抖等优化
    },
    // 切换人员列表
    switchPersonList() {
      this.currentListType = this.currentListType === 'primary' ? 'secondary' : 'primary'
      this.searchKeyword = '' // 切换时清空搜索
    },
    // 获取当前选中的人员列表
    getSelectedPersons() {
      const selected = []
      this.roleList.forEach(role => {
        role.personList.forEach(p => {
          if (p.selected) selected.push(p)
        })
      })
      return selected
    }
  }
}
</script>

<style scoped>
.person-select-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* background-color: #f5f5f5; */
}
.search-bar {
  display: flex;
  padding: 12px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}
.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
.search-btn {
  margin-left: 8px;
  padding: 8px 16px;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 4px;
}
.person-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px;
}
.role-group {
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 4px;
}
.role-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #bbb;
  background-color: rgb(242 244 246);
}
.expand-icon {
  color: #999;
  font-size: 12px;
}
.person-items {
  padding: 0 12px;
}
.person-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.person-item:last-child {
  border-bottom: none;
}
.select-radio {
  margin-right: 12px;
}
.person-info {
  flex: 1;
}
.person-name {
  font-size: 15px;
  color: #333;
}
.person-desc {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}
.filter-bar {
  padding: 12px;
  background-color: #fff;
  border-top: 1px solid #eee;
}
.filter-btn {
  width: 100%;
  padding: 12px;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 15px;
}
</style>