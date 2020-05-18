<template>
  <el-card>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-create" @click="toAdd">
        {{ $t('button.create') }}
      </el-button>
    </div>
    <el-table :data="masters" border>
      <el-table-column label="#" type="index" />
      <el-table-column :label="$t('formula.formulaName')" prop="formulaName" />
      <el-table-column width="200" :label="$t('formula.formulaDesc')" prop="formulaDesc" />
      <el-table-column width="230" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" @click="toUpdate(row)">
            {{ $t('button.update') }}
          </el-button>
          <el-button type="primary" size="mini" @click="toFormula(row)">
            {{ $t('button.formula') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="150px" size="mini" :model="master" class="demo-form-inline">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('formula.formulaName')+':'">
              <el-input v-model="master.formulaName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('formula.formulaDesc')+':'">
              <el-input v-model="master.formulaDesc"></el-input>
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
  name: 'FormulaMasterList',
  data() {
    return {
      dialogVisible: false,
      dialogType: 'add',
      masters: [],
      master: {
        formulaName: '',
        formulaDesc: ''
      }
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
    }
  }
}
</script>

<style scoped>

</style>
