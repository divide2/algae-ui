<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.name"
        :placeholder="$t('product.productCode')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="search"
      />
      <el-button v-waves class="filter-item" type="primary" @click="search">{{ $t('button.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="toAdd">{{ $t('button.create') }}</el-button>
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
      <el-table-column :label="$t('product.id')" prop="id" />
      <el-table-column :label="$t('product.name')" prop="name" />
      <el-table-column :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="toValidate(row)">
            {{ $t('button.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size" @pagination="page" />
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="120px" size="mini" :model="product" class="demo-form-inline">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('product.productCode')+':'">
              <el-input v-model="product.productCode" />
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
      query: {
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.page()
  },
  methods: {
    async page() {
      this.loading = true
      const data = await ProductApi.find(this.query)
      this.list = data.content
      this.total = data.totalElements
      this.loading = false
    },
    toAdd() {
      // this.dialogVisible = true
      this.$router.push({
        name: 'productAdd'
      })
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
    toValidate(row) {
      this.$router.push({
        name: 'productValidate', params: { id: row.id }
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
