<template>
  <el-card>
    <el-button type="success" size="small">
      {{ $t('button.run') }}
      <i class="el-icon-caret-right  el-icon--right" />
    </el-button>
    <el-card>
      <div id="container"></div>
    </el-card>
  </el-card>
</template>
<script>
import FormulaApi from '@/api/FormulaApi'
import FormulaGroupApi from '@/api/FormulaGroupApi'
import G6 from '@antv/g6'

export default {
  data() {
    return {
      groupId: '',
      zoom: 100,
      formulas: '',
      tree: {},
      drawer: false,
      dialogVisible: false,
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
    this.groupId = this.$route.params.groupId
    this.findGroupFormulasTree()
    this.findGroupFormulas()
    this.findGroupValidatedFormulas()
  },
  methods: {
    handleMenuClick({ data, key }) {
      this[key](data)
    },
    async findGroupFormulasTree() {
      // const { data } = await FormulaApi.findGroupFormulasTree(this.groupId)
      const data = {
        id: '1',
        label: '公式',
        children: [
          {
            id: '2',
            label: '保费',
            children: [
              {
                id: '3',
                label: '保额'
              },
              {
                id: '4',
                label: '缴费年期'
              }
            ]
          },
          {
            id: '5',
            label: '总保费',
            children: [
              {
                id: '3',
                label: '保额'
              },
              {
                id: '4',
                label: '缴费年期'
              }
            ]
          }
        ]
      }
      data.isRoot = true
      const width = document.getElementById('container').scrollWidth
      const height = document.getElementById('container').scrollHeight || 800
      const graph = new G6.TreeGraph({
        container: 'container',
        width,
        height,
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
                console.log(item)
                const data = item.get('model').data
                data.collapsed = collapsed
                return true
              }
            },
            'drag-canvas',
            'zoom-canvas'
          ]
        },
        defaultNode: {
          size: 26,
          anchorPoints: [
            [0, 0.5],
            [1, 0.5]
          ],
          style: {
            fill: '#C6E5FF',
            stroke: '#5B8FF9'
          }
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
            if (d.payload) {
              return d.id + '-' + d.payload.masterId
            }
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
            return 100
          }
        }
      })

      graph.node(function(node) {
        return {
          label: node.label,
          labelCfg: {
            offset: 10,
            position: node.children && node.children.length > 0 ? 'left' : 'right'
          }
        }
      })
      graph.data(data)
      graph.render()
      graph.fitView()
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
    async delete(data) {
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

