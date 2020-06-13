<template>
  <el-card>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-create" @click="toAdd">
        {{ $t('button.create') }}
      </el-button>
    </div>

    <el-divider />
    <el-table :data="formulas" border>
      <el-table-column label="#" type="index" />
      <el-table-column :label="$t('formula.formulaName')" prop="formulaName" />
      <el-table-column :label="$t('formula.formula')" prop="formula" />
      <el-table-column :label="$t('formula.formulaInitValue')" prop="formulaInitValue" />
      <el-table-column width="200" :label="$t('formula.formulaValueType')" prop="formulaValueType" />
      <el-table-column width="200" :label="$t('formula.formulaVersion')" prop="formulaVersion" />
      <el-table-column width="130" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" @click="toUpdate(row)">
            {{ $t('button.update') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="150px" size="mini" :model="formula" class="demo-form-inline">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('formula.formulaName')+':'">
              <el-input v-model="formula.formulaName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('formula.formulaValueType')+':'">
              <el-select v-model="formula.formulaValueType">
                <el-option value="fixed" label="fixed" />
                <el-option value="changing" label="changing" />
                <el-option value="input" label="input" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item :label="$t('formula.formula')+':'">
            <el-input v-model="formula.formula"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item :label="$t('formula.formulaInitValue')+':'">
            <el-input v-model="formula.formulaInitValue"></el-input>
          </el-form-item>
        </el-row>
        <el-row>

        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('formula.formulaVersion')+':'">
              <el-input v-model="formula.formulaVersion"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('formula.reference')+':'">
              <el-select v-model="formula.references" filterable multiple>
                <el-option v-for="item in masters" :key="item.id" :value="item.id" :label="item.formulaName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import FormulaApi from '@/api/FormulaApi'

export default {
  name: 'MasterFormulas',
  data() {
    return {
      dialogVisible: false,
      dialogType: 'add',
      masterId: '',
      formulas: [],
      formula: {
        formulaName: '',
        formula: '',
        formulaInitValue: '',
        formulaValueType: '',
        formulaVersion: '',
        references: []
      },
      masters: []
    }
  },
  async mounted() {
    this.masterId = this.$route.params.id
    const { data } = await FormulaApi.findAllMaster()
    this.masters = data
    await this.findAllFormulas()
  },
  methods: {
    async findAllFormulas() {
      const resp = await FormulaApi.findFormulaByMaster(this.masterId)
      this.formulas = resp.data
    },
    toAdd() {
      this.dialogVisible = true
    },
    async confirm() {
      this.formula.masterId = this.masterId
      if (this.dialogType === 'add') {
        await FormulaApi.addFormula(this.formula)
      } else {
        await FormulaApi.updateFormula(this.formula)
      }
      await this.findAllFormulas()
      this.$message.success(this.$t('message.success'))
      this.dialogVisible = false
    },
    toUpdate(row) {
      this.dialogVisible = true
      this.dialogType = 'update'
      this.formula = Object.assign({}, row)
    }
  }
}
</script>

<style scoped>

</style>
