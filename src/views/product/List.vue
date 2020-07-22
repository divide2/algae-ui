<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.imei"
        :placeholder="$t('product.productCode')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="search" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">
        {{ $t('button.search') }}
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-create" @click="toAdd">
        {{ $t('button.create') }}
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="#" type="index" />
      <el-table-column :label="$t('product.productCode')" prop="productCode" />
      <el-table-column :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="toFormulaGroup(row)">
            {{ $t('button.formulaGroup') }}
          </el-button>
          <el-button size="mini" type="info" @click="toRateDefinition(row)">
            {{ $t('button.rateDefinition') }}
          </el-button>
          <el-button size="mini" type="info" @click="toRule(row)">
            {{ $t('button.rule') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page" />
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="120px" size="mini" :model="product" class="demo-form-inline">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('product.productCode')+':'">
              <el-input v-model="product.productCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirmAdd">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import ProductApi from '@/api/ProductApi' // secondary package based on el-pagination

export default {
  name: 'Product',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      loading: true,
      dialogVisible: false,
      product: {
        productCode: ''
      },
      query: {}
    }
  },
  created() {
    this.page()
  },
  methods: {
    async page() {
      this.loading = true
      const data = await ProductApi.list(this.query)
      this.list = data.data
      this.loading = false
    },
    toAdd() {
      this.dialogVisible = true
    },
    async confirmAdd() {
      await ProductApi.add(this.product)
      await this.page()
      this.$message.success('message.success')
    },
    toFormulaGroup(row) {
      this.$router.push({
        name: 'formulaGroup', params: { id: row.id }
      })
    },
    toRateDefinition(row) {
      this.$router.push({
        name: 'rateDefinition', params: { id: row.id }
      })
    },
    toRule(row) {
      this.$router.push({
        name: 'rule', params: { id: row.id }
      })
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await this.page()
      this.$message.success(this.$t('message.deleteSuccess'))
    },
    search() {
      this.query.pageNo = 1
      this.page()
    }
  }
}
</script>
