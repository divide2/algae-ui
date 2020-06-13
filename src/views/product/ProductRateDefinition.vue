<template>
  <el-card>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="toAdd">
        {{ $t('button.create') }}
      </el-button>
    </div>
    <el-table :data="rateDefinitions" border>
      <el-table-column label="#" type="index" />
      <el-table-column width="200" :label="$t('rateDefinition.rateName')" prop="rateName" />
      <el-table-column :label="$t('rateDefinition.dbTableName')" prop="dbTableName" />
      <el-table-column :label="$t('rateDefinition.dbColumnName')" prop="dbColumnName" />
      <el-table-column :label="$t('rateDefinition.factors')" prop="factors">
        <template slot-scope="{ row }">
          {{ row.factors.join(' ,') }}
        </template>
      </el-table-column>
      <el-table-column width="200" :label="$t('rateDefinition.searchRateSqlTemplate')" prop="searchRateSqlTemplate" />
      <el-table-column width="130" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="toUpdate(row)">
            {{ $t('button.update') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="150px" size="mini" :model="rateDefinition" class="demo-form-inline">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('rateDefinition.rateName')+':'">
              <el-select v-model="rateDefinition.rateName">
                <el-option v-for="it in rateNames" :key="it" :value="it" :label="it" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('rateDefinition.factors')+':'">
              <el-select v-model="rateDefinition.factors" multiple filterable>
                <el-option value="productCode" label="productCode" />
                <el-option value="gender" label="gender" />
                <el-option value="premiumYear" label="premiumYear" />
                <el-option value="smoking" label="smoking" />
                <el-option value="paymentTerm" label="paymentTerm" />
                <el-option value="age" label="age" />
                <el-option value="agentCate" label="agentCate" />
                <el-option value="emFactor" label="emFactor" />
                <el-option value="sumAssured" label="sumAssured" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('rateDefinition.dbTableName')+':'">
              <el-select v-model="rateDefinition.dbTableName">
                <el-option v-for="it in dbTables" :key="it" :value="it" :label="it" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('rateDefinition.dbColumnName')+':'">
              <el-select v-model="rateDefinition.dbColumnName">
                <el-option v-for="it in dbColumns" :key="it" :value="it" :label="it" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item :label="$t('rateDefinition.searchRateSqlTemplate')+':'">
            <el-input v-model="rateDefinition.searchRateSqlTemplate" type="textarea" autosize filterable />
          </el-form-item>
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
import RateDefinitionApi from '@/api/RateDefinitionApi'

const dbTables = [
  '"actuary"."t_tml_bonus_rate"',
  '"actuary"."t_tml_bonus_rate_high"',
  '"actuary"."t_tml_bonus_rate_low"',
  '"actuary"."t_gcv_rate"',
  '"actuary"."t_premium_rate"',
  '"actuary"."t_cd_rate"',
  '"actuary"."t_cd_rate_low"',
  '"actuary"."t_cd_rate_high"',
  '"actuary"."t_em_fee"',
  '"actuary"."t_premium_discnt_rate"'
]
const dbColumns = [
  '"bonus_rate"',
  '"gcv_rate"',
  '"premium_rate"',
  '"cd_rate"',
  '"sa_rate"',
  '"discount"',
  '"em_rate"',
  '"lsd_rate"'
]

const rateNames = [
  'EM_LOADING_RATE',
  'T_TML_BONUS_RATE',
  'T_TML_BONUS_RATE_HIGH',
  'T_TML_BONUS_RATE_LOW',
  'T_CASH_VALUE',
  'T_PREMIUM_RATE',
  'T_CD_RATE',
  'T_SA_RATE',
  'T_CD_RATE_LOW',
  'T_SA_RATE_LOW',
  'T_CD_RATE_HIGH',
  'T_SA_RATE_HIGH',
  'DISCOUNT_RATE',
  'DISCOUNT_RATE_V3',
  'LSD_RATE'
]
export default {
  name: 'RateDefinition',
  data() {
    return {
      id: '',
      dialogType: 'add',
      dialogVisible: false,
      product: {},
      rateNames,
      dbColumns,
      dbTables,
      rateDefinition: {
        dbColumnName: '',
        dbTableName: '',
        factors: [],
        rateName: '',
        searchRateSqlTemplate: ''
      },
      rateDefinitions: []
    }
  },
  created() {
    this.id = this.$route.params.id
    // this.get()
    this.findRateDefinitions()
  },
  methods: {
    async toAdd() {
      this.dialogVisible = true
    },
    toUpdate(row) {
      this.dialogType = 'update'
      this.dialogVisible = true
      this.rateDefinition = Object.assign({}, row)
    },
    async confirmAdd() {
      this.rateDefinition.productId = this.id
      if (this.dialogType === 'add') {
        await RateDefinitionApi.add(this.rateDefinition)
      } else {
        await RateDefinitionApi.update(this.rateDefinition)
      }
      await this.findRateDefinitions()
      this.dialogVisible = false
    },
    async get() {
    },
    async findRateDefinitions() {
      const resp = await RateDefinitionApi.list(this.id)
      this.rateDefinitions = resp.data
    }
  }
}

</script>

