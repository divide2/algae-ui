<template>
  <el-card ref="root">
    <el-button type="success" size="small">
      {{ $t('button.run') }}
      <i class="el-icon-caret-right  el-icon--right" />
    </el-button>
    <el-card>
      <div id="container" />
    </el-card>
    <ul
      v-if="optionSettings.show"
      class="el-dropdown-menu"
      :style="`position:absolute;left:${optionSettings.x}px;top: ${optionSettings.y}px`"
    >
      <li class="el-dropdown-menu__item" @click="relevance">{{ $t('button.relevance') }}</li>
      <li class="el-dropdown-menu__item" @click="toggle">{{ $t('button.toggle') }}</li>
      <li class="el-dropdown-menu__item" @click="remove">{{ $t('button.remove') }}</li>
    </ul>
    <relevance-dialog ref="relevanceDialog" />
  </el-card>
</template>
<script>
import FormulaApi from '@/api/FormulaApi'
import FormulaGroupApi from '@/api/FormulaGroupApi'
import { G6 } from './components/G6Config'
import RelevanceDialog from '@/views/product/components/RelevanceDialog'
import { Minimap } from '@antv/g6'

export default {
  components: { RelevanceDialog },
  data() {
    return {
      i: 0,
      groupId: '',
      graph: null,
      treeData: null,
      zoom: 100,
      formulas: '',
      tree: {},
      drawer: false,
      dialogVisible: false,
      optionSettings: {
        show: false,
        x: 0,
        y: 0
      },
      currentNode: {},
      masters: [],
      formula: {
        formulaName: '',
        formulaId: '',
        masterId: '',
        masterName: '',
        masterDesc: '',
        references: []
      },
      validatedFormulasIds: []
    }
  },
  async mounted() {
    this.groupId = this.$route.params.groupId
    // this.register()
    await this.findGroupValidatedFormulas()
    const data = await this.findGroupFormulasTree()
    this.generateTree(data)
    await this.findGroupFormulas()
  },
  methods: {

    handleMenuClick({ data, key }) {
      this[key](data)
    },
    mapTree(tree, fn) {
      fn(tree, ++this.i)
      const children = tree.children
      if (children && children.length > 0) {
        children.forEach(child => this.mapTree(child, fn))
      }
    },
    fillId(data, i) {
      data.formulaId = data.id
      data.collapsed = true
      data.id = i
      if (data.payload && this.validatedFormulasIds.includes(data.payload.masterId)) {
        data.fill = '#a8f1b3'
      }
    },
    async findGroupFormulasTree() {
      const { data } = await FormulaApi.findGroupFormulasTree(this.groupId)
      this.mapTree(data, this.fillId)
      data.collapsed = false
      return data
    },
    async findGroupFormulas() {
      const { data } = await FormulaApi.findGroupFormulas(this.groupId)
      this.formulas = data
    },
    async findGroupValidatedFormulas() {
      const { data } = await FormulaApi.findGroupValidatedFormulas(this.groupId)
      this.validatedFormulasIds = data.map(it => it.masterId)
    },
    edit(data) {
      this.formula = data.payload
      this.formula.references = data.children.map(it => it.id)
    },
    async remove() {
      this.optionSettings.show = false
      await this.$confirm(this.$t('message.confirmRemove'))
      const formulaId = this.currentNode.payload.formulaId
      await FormulaGroupApi.removeChildFormula({ formulaId, formulaGroupId: this.groupId })
      // const data = await this.findGroupFormulasTree()
      // this.graph.changeData(data)
      // this.graph.fitView()
      this.graph.remove(this.graph.findById(this.currentNode.id))
      this.$message.success(this.$t('message.removeSuccess'))
    },
    async relevance() {
      this.$refs.relevanceDialog.show()
    },
    async toggle() {
      await FormulaGroupApi.addChildFormulaMaster({
        formulaGroupId: this.groupId,
        formulaMasterId: this.currentNode.payload.masterId
      })
      this.$message.success(this.$t('message.success'))
      this.optionSettings.show = false
      const nodeData = this.graph.findDataById(this.currentNode.id)
      if (nodeData.fill === '#fff') {
        nodeData.fill = '#a8f1b3'
      } else {
        nodeData.fill = '#fff'
      }
      this.graph.refresh()
    },
    generateTree(data) {
      const minimap = new Minimap({
        size: [100, 100],
        className: 'minimap',
        type: 'delegate'
      })
      const container = document.getElementById('container')
      const width = container.scrollWidth
      const height = container.scrollHeight || 500
      const graph = new G6.TreeGraph({
        plugins: [minimap],
        container: 'container',
        width,
        height,
        modes: {
          default: [
            'drag-canvas',
            'zoom-canvas'
          ]
        },
        defaultNode: {
          type: 'tree-node',
          anchorPoints: [
            [0, 0.5],
            [1, 0.5]
          ]
          // type: 'dom-node',
          // size: [120, 40]
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            stroke: '#A3B1BF'
          }
        },
        layout: {
          type: 'compactBox',
          direction: 'LR',
          getId: function getId(d) {
            return d.id
          },
          getHeight: function getHeight() {
            return 16
          },
          getWidth: function getWidth() {
            return 16
          },
          getVGap: function getVGap() {
            return 10
          },
          getHGap: function getHGap() {
            return 150
          }
        }
      })
      graph.data(data)
      graph.render()
      graph.fitView()
      graph.on('node:contextmenu', evt => {
        evt.preventDefault()
        evt.stopPropagation()
        const X = this.$refs.root.$el.getBoundingClientRect().left + document.documentElement.scrollLeft
        const Y = this.$refs.root.$el.getBoundingClientRect().top + document.documentElement.scrollTop
        this.optionSettings.show = true
        this.optionSettings.x = evt.clientX - X
        this.optionSettings.y = evt.clientY - Y
        this.currentNode = evt.item.getModel()
      })
      graph.on('node:click', ({ item, target }) => {
        const data = item.getModel()
        const { attrs: { isCollapseShape, isCheckedShape } } = target
        if (isCollapseShape) {
          const flag = item.get('group').find(element => element.get('name') === 'collapse-flag')
          data.collapsed = !data.collapsed
          flag.attr('text', data.collapsed ? '+' : '-')
          graph.layout()
        }
        if (isCheckedShape) {
          const checked = item.get('group').find(element => element.get('name') === 'checked-flag')
          data.checked = !data.checked
          checked.attr('text', data.checked ? '✔' : '')
          graph.layout()
        }
      })
      graph.on('node:mouseleave', () => {
        this.optionSettings.show = false
      })
      this.graph = graph
    }
  }
}

</script>

<style>

.g6-minimap-container {
  border: 1px solid #e2e2e2;
}

.g6-minimap-viewport {
  border: 2px solid rgb(25, 128, 255);
}
</style>

