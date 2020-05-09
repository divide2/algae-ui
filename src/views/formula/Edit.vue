<template>
  <el-card style="height: 100%;width: 100%;overflow:hidden">
    <div class="department-outer">
      <div class="view-box">
        <org-view
          v-if="data"
          :data="data"
          :zoom-handled="zoomHandled"
          @on-menu-click="handleMenuClick"
        ></org-view>
      </div>
    </div>
  </el-card>
</template>

<script>
import OrgView from './components/OrgView.vue'
import './index.less'

const menuDic = {
  edit: '编辑部门',
  detail: '查看部门',
  new: '新增子部门',
  delete: '删除部门'
}
export default {
  name: 'MapleTree',
  components: {
    OrgView
  },
  data() {
    return {
      data: null,
      zoom: 100
    }
  },
  computed: {
    zoomHandled() {
      return this.zoom / 100
    }
  },
  methods: {
    setDepartmentData(data) {
      data.isRoot = true
      return data
    },
    handleMenuClick({ data, key }) {
      this.$Message.success({
        duration: 5,
        content: `点击了《${data.label}》节点的'${menuDic[key]}'菜单`
      })
    },
    getDepartmentData() {
      /*  getOrgData().then(res => {
          const { data } = res
          this.data = data
        })*/
      this.data = {
        label: '公式',
        key: 1,
        children: [
          {
            key: 10,
            label: '标准保费',
            children: [
              { key: 2, label: 'LSD' },
              { key: 3, label: '年期' },
              { key: 4, label: '保额' }
            ]
          },
          {
            label: '年化保费',
            key: 5,
            children: [
              { key: 6, label: '年期' },
              { key: 7, label: '缴费频率' }
            ]
          }
        ]
      }
    }
  },
  mounted() {
    this.getDepartmentData()
  }
}
</script>

<style>
</style>