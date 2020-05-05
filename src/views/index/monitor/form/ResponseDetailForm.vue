<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 80%;"
    >

      <el-table-column width="50" label="#" type="index" />
      <el-table-column width="200" :label="$t('indexMonitor.monitorExample.responseTime')" prop="receiveTime" />
      <el-table-column :label="$t('indexMonitor.monitorExample.responseContent')" prop="response" />
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="query.pageNo"
      :limit.sync="query.pageSize"
      @pagination="page"
    />
  </div>
</template>

<script>
import MonitorExampleApi from '@/api/MonitorExampleApi'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ResponseDetailForm',
  components: { Pagination },
  directives: { waves },
  props: {
    type: {
      default: 'create',
      type: String
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      loading: true,
      query: {
        sort: '+id',
        relaFid: ''
      },
      layout4: {
        xl: 4,
        lg: 4,
        md: 12,
        xs: 12
      },
      layout6: {
        xl: 6,
        lg: 6,
        md: 12,
        xs: 24
      },
      layout7: {
        xl: 7,
        lg: 7,
        md: 12,
        xs: 24
      },
      layout12: {
        xl: 12,
        lg: 12,
        md: 12,
        xs: 24
      },
      layout30: {
        xl: 18,
        lg: 18,
        md: 12,
        xs: 24
      },
      list: []
    }
  },
  created() {
    this.page()
  },
  methods: {
    page() {
      this.loading = true
      this.query.relaFid = this.$route.params.id
      MonitorExampleApi.responsePage(this.query).then(data => {
        this.list = data.records
        this.total = data.total
        this.loading = false
      })
    },
    /**
       * 页面动作
       */
    removeRow(index) {

    },
    addRow() {

    },
    cancel() {
      this.$router.back()
    },
    isCreate() {
      return this.type === 'create'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    }
  }
}
</script>
