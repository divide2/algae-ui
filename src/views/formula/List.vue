<template>
  <el-card>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" @click="toAdd">
        {{ $t('button.create') }}
      </el-button>
    </div>
    <el-table :data="masters" border>
      <el-table-column label="#" type="index" />
      <el-table-column :label="$t('formula.formulaName')" prop="formulaName" />
      <el-table-column width="200" :label="$t('formula.formulaDesc')" prop="formulaDesc" />
      <el-table-column width="280" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" @click="toUpdate(row)">
            {{ $t('button.update') }}
          </el-button>
          <el-button type="primary" size="mini" @click="toFormula(row)">
            {{ $t('button.formula') }}
          </el-button>
          <el-button type="primary" size="mini" @click="viewRelatedFormula(row)">
            {{ $t('button.viewRelatedFormula') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="150px" size="mini" :model="master" class="demo-form-inline">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('formula.formulaName')+':'">
              <el-input v-model="master.formulaName" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('formula.formulaDesc')+':'">
              <el-input v-model="master.formulaDesc" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="viewFormulaDialog" width="80%">
      <el-table :data="relatedFormulas" border>
        <el-table-column label="#" type="index" />
        <el-table-column width="230" :label="$t('formula.formulaName')" prop="formulaName" />
        <el-table-column :label="$t('formula.formula')">
          <template slot-scope="scope">
            <span v-html="scope.row.formula" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('formula.formulaInitValue')">
          <template slot-scope="scope">
            <span v-html="scope.row.formulaInitValue" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script>
import FormulaApi from '@/api/FormulaApi'

export default {
  name: 'FormulaMasterList',
  data() {
    return {
      dialogVisible: false,
      dialogType: 'add',
      masters: [],
      master: {
        formulaName: '',
        formulaDesc: ''
      },
      relatedFormulas: [],
      viewFormulaDialog: false
    }
  },
  mounted() {
    this.findMasters()
  },
  methods: {
    async findMasters() {
      const { data } = await FormulaApi.findAllMaster()
      this.masters = data
    },
    toFormula({ id }) {
      this.$router.push({
        name: 'masterFormulas',
        params: { id }
      })
    },
    toUpdate(row) {
      this.dialogType = 'update'
      this.dialogVisible = true
      this.master = Object.assign({}, row)
    },
    toAdd() {
      this.dialogVisible = true
      this.master = {}
    },
    async confirm() {
      if (this.dialogType === 'update') {
        await FormulaApi.updateMaster(this.master)
      } else {
        await FormulaApi.addMaster(this.master)
      }
      await this.findMasters()
      this.dialogVisible = false
    },
    async viewRelatedFormula(row) {
      const { data } = await FormulaApi.findMasterRelatedFormulas(row.id)
      data.forEach(it => {
        const reg = new RegExp(`(${row.formulaName})`, 'g')
        // const group = reg.exec(it.formula)
        // const initValueGroup = reg.exec(it.formulaInitValue)
        it.formula = it.formula.replace(reg, `<span style="color: mediumvioletred">${row.formulaName}</span>`)
        it.formulaInitValue = it.formulaInitValue.replace(reg, `<span style="color: mediumvioletred">${row.formulaName}</span>`)
      })
      this.relatedFormulas = data
      this.viewFormulaDialog = true
    }
  }
}
</script>

<style scoped>

</style>
