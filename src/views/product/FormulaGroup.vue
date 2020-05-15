<template>
  <el-card>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-create" @click="toAdd">
        {{ $t('button.create') }}
      </el-button>
    </div>

    <el-divider />
    <el-table :data="formulaGroups" border>
      <el-table-column label="#" type="index" />
      <el-table-column :label="$t('formulaGroup.formulaGroupName')" prop="formulaGroupName" />
      <el-table-column :label="$t('formulaGroup.formulaGroupDisplayName')" prop="formulaGroupDisplayName" />
      <el-table-column :label="$t('formulaGroup.formulaGroupCategory')" prop="formulaGroupCategory" />
      <el-table-column width="200" :label="$t('formulaGroup.formulaGroupCalcType')" prop="formulaGroupCalcType" />
      <el-table-column width="200" :label="$t('formulaGroup.formulaGroupDesc')" prop="formulaGroupDesc" />
      <el-table-column width="130" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="toFormula(row)">
            {{ $t('button.formula') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="150px" size="mini" :model="product" class="demo-form-inline">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('formulaGroup.formulaGroupName')+':'">
              <el-input v-model="formulaGroup.formulaGroupName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('formulaGroup.formulaGroupDisplayName')+':'">
              <el-input v-model="formulaGroup.formulaGroupDisplayName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('formulaGroup.formulaGroupDesc')+':'">
              <el-input v-model="formulaGroup.formulaGroupDesc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('formulaGroup.formulaGroupCalcType')+':'">
              <el-select v-model="formulaGroup.formulaGroupCalcType">
                <el-option value="iterate" label="iterate" />
                <el-option value="single" label="single" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('formulaGroup.formulaGroupCategory')+':'">
              <el-select v-model="formulaGroup.formulaGroupCategory">
                <el-option value="premium" label="premium" />
                <el-option value="illustration" label="illustration" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('formulaGroup.iterationTerminalMaster')+':'">
              <el-select v-model="formulaGroup.iterationTerminalMaster" filterable>
                <el-option v-for="item in masters" :key="item.id" :value="item.id" :label="item.formulaName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirmAdd">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import FormulaGroupApi from '@/api/FormulaGroupApi'
import FormulaApi from '@/api/FormulaApi'

export default {
  name: 'FormulaGroup',
  data() {
    return {
      id: '',
      dialogVisible: false,
      product: {},
      formulaGroup: {
        formulaGroupName: '',
        formulaGroupDisplayName: '',
        formulaGroupDesc: '',
        formulaGroupCalcType: '',
        formulaGroupCategory: '',
        iterationTerminalMaster: ''
      },
      formulaGroups: [],
      masters: []
    }
  },
  created() {
    this.id = this.$route.params.id
    // this.get()
    this.findFormulaGroups()
  },
  methods: {
    async toAdd() {
      this.dialogVisible = true
      const { data } = await FormulaApi.findAllMaster()
      this.masters = data
    },
    async confirmAdd() {
      this.formulaGroup.productId = this.id
      await FormulaGroupApi.add(this.formulaGroup)
      this.dialogVisible = false
      await this.findFormulaGroups()
    },
    async get() {
    },
    async findFormulaGroups() {
      const resp = await FormulaGroupApi.findFormulaGroups(this.id)
      this.formulaGroups = resp.data
    },
    toFormula(row) {
      this.$router.push({
        name: 'formula', params: { productId: this.id, groupId: row.id }
      })
    }
  }
}

</script>

