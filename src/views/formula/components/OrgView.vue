<template>
  <div
    ref="dragWrapper"
    class="org-tree-drag-wrapper"
    @mousedown="mousedownView"
    @contextmenu="handleDocumentContextmenu"
  >
    <div class="org-tree-wrapper" :style="orgTreeStyle">
      <v-org-tree
        v-if="data"
        :data="data"
        :node-render="nodeRender"
        collapsable
        horizontal
        @on-node-click="handleNodeClick"
      ></v-org-tree>
    </div>
  </div>
</template>

<script type="jsx">
import { off, on } from '@/libs/tools'

const menuList = [
  {
    key: 'edit',
    label: '编辑部门'
  },
  {
    key: 'detail',
    label: '查看部门'
  },
  {
    key: 'new',
    label: '新增子部门'
  },
  {
    key: 'delete',
    label: '删除部门'
  }
]
export default {
  name: 'OrgView',
  props: {
    zoomHandled: {
      type: Number,
      default: 1
    },
    data: Object
  },
  data() {
    return {
      currentContextMenuId: '',
      orgTreeOffsetLeft: 0,
      orgTreeOffsetTop: 0,
      initPageX: 0,
      initPageY: 0,
      oldMarginLeft: 0,
      oldMarginTop: 0,
      canMove: false
    }
  },
  computed: {
    orgTreeStyle() {
      return {
        transform: `translate(-50%, -50%) scale(${this.zoomHandled}, ${
          this.zoomHandled
        })`,
        marginLeft: `${this.orgTreeOffsetLeft}px`,
        marginTop: `${this.orgTreeOffsetTop}px`
      }
    }
  },
  methods: {
    handleNodeClick(e, data, expand) {
    },
    closeMenu() {
      this.currentContextMenuId = ''
    },
    getBgColor(data) {
      return this.currentContextMenuId === data.id
        ? data.isRoot
          ? '#0d7fe8'
          : '#5d6c7b'
        : ''
    },
    nodeRender(h, data) {
      return (
        <div
          on-mousedown={event => event.stopPropagation()}
          on-contextmenu={this.contextmenu.bind(this, data)}
        >
          <el-dropdown
            trigger="click"
            class="context-menu"
            on-command={this.handleContextMenuClick.bind(this, data)}
            nativeOn-click={this.handleDropdownClick}
            style={{
              transform: `scale(${1 / this.zoomHandled}, ${1 /
              this.zoomHandled})`
            }}
          >
            <span class={['custom-org-node', data.children && data.children.length ? 'has-children-label' : '']}>
              {data.label}
            </span>
            <el-dropdown-menu slot="dropdown">
              {menuList.map(item => {
                return (
                  <el-dropdown-item command={item.key}>{item.label}</el-dropdown-item>
                )
              })}
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      )
    },
    contextmenu(data, $event) {
      let event = $event || window.event
      event.preventDefault
        ? event.preventDefault()
        : (event.returnValue = false)
      this.currentContextMenuId = data.id
    },
    setDepartmentData(data) {
      data.isRoot = true
      this.departmentData = data
    },
    mousedownView(event) {
      this.canMove = true
      this.initPageX = event.pageX
      this.initPageY = event.pageY
      this.oldMarginLeft = this.orgTreeOffsetLeft
      this.oldMarginTop = this.orgTreeOffsetTop
      on(document, 'mousemove', this.mousemoveView)
      on(document, 'mouseup', this.mouseupView)
    },
    mousemoveView(event) {
      if (!this.canMove) return
      const { pageX, pageY } = event
      this.orgTreeOffsetLeft = this.oldMarginLeft + pageX - this.initPageX
      this.orgTreeOffsetTop = this.oldMarginTop + pageY - this.initPageY
    },
    mouseupView() {
      this.canMove = false
      off(document, 'mousemove', this.mousemoveView)
      off(document, 'mouseup', this.mouseupView)
    },
    handleDropdownClick(event) {
      event.stopPropagation()
    },
    handleDocumentContextmenu() {
      this.canMove = false
    },
    handleContextMenuClick(data, key) {
      this.$emit('on-menu-click', { data, key })
    }
  },
  mounted() {
    on(document, 'contextmenu', this.handleDocumentContextmenu)
  },
  beforeDestroy() {
    off(document, 'contextmenu', this.handleDocumentContextmenu)
  }
}
</script>

<style>
</style>
