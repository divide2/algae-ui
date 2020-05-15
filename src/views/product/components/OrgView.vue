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
      />
    </div>
  </div>
</template>

<script type="jsx">
import { off, on } from '@/libs/tools'

const menuList = [
  /*
  {
    key: 'addChild',
    label: '添加公式',
    valid: (data) => data.id === '0'
  },
  */
  {
    key: 'relevance',
    label: '关联公式',
    valid: (data) => data.id === '0'
  },
  {
    key: 'toggle',
    label: '切换显示',
    valid: (data) => data.id !== '0'
  },
  {
    key: 'delete',
    label: '删除',
    valid: (data) => data.id !== '0'
  }
]
export default {
  name: 'OrgView',
  props: {
    zoomHandled: {
      type: Number,
      default: 1
    },
    data: {
      type: Object,
      required: true
    },
    validatedItems: {
      type: Array,
      default: () => []
    }
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
  mounted() {
    on(document, 'contextmenu', this.handleDocumentContextmenu)
  },
  beforeDestroy() {
    off(document, 'contextmenu', this.handleDocumentContextmenu)
  },
  methods: {
    handleNodeClick(e, data, expand) {
      console.log(data)
    },
    closeMenu() {
      this.currentContextMenuId = ''
    },
    getBgColor(data) {
      return this.validatedItems.includes(data.id) ? '#10655b' : '#999'
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
          >
            <span style={{ backgroundColor: this.getBgColor(data) }} class={['custom-org-node', data.children && data.children.length ? 'has-children-label' : '']}>
              {data.label}
            </span>
            <el-dropdown-menu slot="dropdown">
              {menuList.filter(item => item.valid(data)).map(item => {
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
      console.log(data)
      const event = $event || window.event
      event.preventDefault
        ? event.preventDefault()
        : (event.returnValue = false)
      this.currentContextMenuId = data.id
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
  }
}
</script>

<style>
</style>
