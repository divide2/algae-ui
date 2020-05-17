<template>
  <el-card ref="root">
    <el-button type="success" size="small">
      {{ $t('button.run') }}
      <i class="el-icon-caret-right  el-icon--right" />
    </el-button>
    <el-card>
      <div id="container" />
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <el-row>
        <el-col :span="10">
          <el-form>
            <el-form-item :label="$t('formula.masterName')">
              <el-select v-model="formula.masterId" filterable>
                <el-option v-for="item in masters" :key="item.id" :value="item.id" :label="item.formulaName" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirmRelevance">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <ul
      v-if="optionSettings.show"
      class="el-dropdown-menu"
      :style="`position:absolute;left:${optionSettings.x}px;top: ${optionSettings.y}px`"
    >
      <li class="el-dropdown-menu__item" @click="relevance">{{ $t('button.relevance') }}</li>
      <li class="el-dropdown-menu__item" @click="remove">{{ $t('button.remove') }}</li>
    </ul>

  </el-card>
</template>
<script>
import FormulaApi from '@/api/FormulaApi'
import FormulaGroupApi from '@/api/FormulaGroupApi'
import G6, { Minimap } from '@antv/g6'

export default {
  data() {
    return {
      i: 0,
      groupId: '',
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
  mounted() {
    // this.groupId = this.$route.params.groupId
    this.register()
    this.findGroupFormulasTree()
    // this.findGroupFormulas()
    // this.findGroupValidatedFormulas()
  },
  methods: {
    register() {
    },
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
    },
    async findGroupFormulasTree() {
      const minimap = new Minimap({
        size: [100, 100],
        className: 'minimap',
        type: 'delegate'
      })
      const { data } = await FormulaApi.findGroupFormulasTree(this.groupId)
      this.mapTree(data, this.fillId)
      data.collapsed = false
      const container = document.getElementById('container')
      const width = container.scrollWidth
      const height = container.scrollHeight || 500
      const graph = new G6.TreeGraph({
        plugins: [minimap],
        container: 'container',
        width,
        height,
        renderer: 'svg',
        linkCenter: true,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
                const data = item.get('model')
                // const icon = item.get('group').find(element => element.get('name') === 'collapse-icon')
                if (collapsed) {
                  // icon.attr('symbol', EXPAND_ICON)
                } else {
                  // icon.attr('symbol', COLLAPSE_ICON)
                }
                data.collapsed = collapsed
                return true
              }
            },
            'drag-canvas',
            'zoom-canvas'
          ]
        },
        defaultNode: {
          type: 'rect'
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
            return 66
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

      graph.on('node:mouseleave', () => {
        this.optionSettings.show = false
      })
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
    async remove(data) {
      await this.$confirm(this.$t('message.confirmRemove'))
      const formulaId = data.payload.formulaId
      await FormulaGroupApi.removeChildFormula({ formulaId, formulaGroupId: this.groupId })
      await this.findGroupFormulasTree()
      this.$message.success('message.removeSuccess')
    },
    async relevance(data) {
      const resp = await FormulaApi.findAllMaster()
      this.dialogVisible = true
      this.masters = resp.data
    },
    confirmRelevance() {
    },
    toggle(data) {
      console.log(data)
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

