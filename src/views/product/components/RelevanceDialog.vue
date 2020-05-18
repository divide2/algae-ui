<template>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" width="60%" top="10vh">
    <el-row>
      <el-col :span="10">
        <el-form>
          <el-form-item :label="$t('formula.masterName')">
            <el-select v-model="formula.masterId" filterable @change="onFormulaSelect">
              <el-option v-for="item in masters" :key="item.id" :value="item.id" :label="item.formulaName" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-card>
      <div id="add-container" />
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="confirmRelevance">{{ $t('button.confirm') }}</el-button>
    </div>
    <el-drawer
      :visible.sync="drawer"
      direction="rtl">
      <el-card>
        <el-form label-width="120px" size="mini" :model="formula" class="demo-form-inline">
          <el-form-item :label="$t('formula.formulaName')">
            <!--            <el-input v-model="formula.formulaName"></el-input>-->
            {{ formula.formulaName }}
          </el-form-item>
          <el-form-item :label="$t('formula.formula')">
            {{ formula.formula }}
            <!--            <el-input v-model="formula.formula" type="textarea" autosize></el-input>-->
          </el-form-item>
        </el-form>
      </el-card>
    </el-drawer>
  </el-dialog>
</template>

<script>
import FormulaApi from '@/api/FormulaApi'
import { G6 } from './G6Config'
import { Minimap } from '@antv/g6'
import FormulaGroupApi from '@/api/FormulaGroupApi'

export default {
  name: 'RelevanceDialog',
  data() {
    return {
      drawer: false,
      i: 0,
      groupId: '',
      masters: [],
      graph: null,
      formula: {
        formula: '',
        formulaName: ''
      },
      checkedFormulaIds: [],
      dialogVisible: false
    }
  },
  async mounted() {
    this.groupId = this.$route.params.groupId
    const resp = await FormulaApi.findAllMaster()
    this.masters = resp.data
  },
  methods: {
    async confirmRelevance() {
      const data = this.graph.findDataById(1)
      this.mapTree(data, this.resolveChecked)
      await FormulaGroupApi.addChildFormula({
        groupId: this.groupId,
        formulaIds: this.checkedFormulaIds
      })
      this.dialogVisible = false
      this.$message.success(this.$t('message.success'))
    },
    resolveChecked(data) {
      if (data.payload.type === 'formula' && data.checked) {
        this.checkedFormulaIds.push(data.formulaId)
      }
    },
    show() {
      this.dialogVisible = true
    },
    mapTree(tree, fn, needIter = false) {
      if (needIter) {
        fn(tree, ++this.i)
        const children = tree.children
        if (children && children.length > 0) {
          children.forEach(child => this.mapTree(child, fn, true))
        }
      } else {
        fn(tree)
        const children = tree.children
        if (children && children.length > 0) {
          children.forEach(child => this.mapTree(child, fn))
        }
      }
    },
    initChecked(data, iter) {
      data.formulaId = data.id
      data.id = iter
      if (data.payload && data.payload.type === 'formula') {
        data.checked = false
      }
    },
    async onFormulaSelect(formulaMaster) {
      this.i = 0
      const { data } = await FormulaApi.findFormulaTreeByMaster(formulaMaster)
      this.mapTree(data, this.initChecked, true)
      if (!this.graph) {
        this.generateAddTree(data)
      } else {
        this.graph.changeData(data)
        this.graph.fitView()
      }
    },
    generateAddTree(data) {
      const minimap = new Minimap({
        size: [100, 100],
        className: 'minimap',
        type: 'delegate'
      })
      // const container = document.getElementById('add-container')
      // const container = this.$refs.container
      const container = document.getElementById('add-container')
      const width = container.scrollWidth
      const height = container.scrollHeight || 400
      const graph = new G6.TreeGraph({
        plugins: [minimap],
        container: 'add-container',
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
      graph.on('node:click', async evt => {
        const item = evt.item
        const data = item.getModel()
        const { attrs: { isCollapseShape, isCheckedShape } } = evt.target
        if (isCollapseShape) {
          const flag = item.get('group').find(element => element.get('name') === 'collapse-flag')
          data.collapsed = !data.collapsed
          flag.attr('text', data.collapsed ? '+' : '-')
          graph.layout()
        } else if (isCheckedShape) {
          const checkedFlag = item.get('group').find(element => element.get('name') === 'checked-flag')
          data.checked = !data.checked
          checkedFlag.attr('text', data.checked ? '✔' : '')
          // 如果被选中 获取数据
          if (data.checked) {
            const children = await this.findMasterTreeByFormula(data.formulaId)
            children.forEach(child => {
              this.mapTree(child, this.initChecked, true)
            })
            data.children = children
            data.collapsed = false
          } else {
            // 否则 删除
            data.children = []
          }
          graph.changeData()
        } else {
          this.drawer = true
          this.formula = data.payload
        }
      })
      graph.data(data)
      graph.render()
      graph.fitView()
      this.graph = graph
    },
    async findMasterTreeByFormula(formulaId) {
      const { data } = await FormulaApi.findMasterTreeByFormula(formulaId)
      return data
    }
  }
}
</script>

<style scoped>

</style>
