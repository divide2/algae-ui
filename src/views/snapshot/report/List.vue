<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.appVersion" :placeholder="$t('snapshot.instance.appVersion')" style="width: 200px;" class="filter-item" @keyup.enter.native="search" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">
        {{ $t('button.search') }}
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
      <el-table-column :label="$t('snapshot.instance.appVersion')" prop="appVersion" />
      <el-table-column :label="$t('snapshot.instance.appVersionType')" prop="appVersionType" />
      <el-table-column :label="$t('snapshot.instance.startTime')" prop="startTime" />
      <el-table-column :label="$t('snapshot.instance.endTime')" prop="endTime" />
      <el-table-column :label="$t('snapshot.testReport.duration')" prop="duration" />
      <el-table-column :label="$t('table.action')" width="300">
        <template slot-scope="{row}">
          <el-button size="mini" @click="toDetail(row)">
            {{ $t('button.detail') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import TestReportApi from '@/api/TestReportApi'

// arr to obj, such as { CN : "China", US : "USA" }
export default {
  name: 'InstanceTestReportList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      query: {
        status: undefined,
        name: undefined,
        sort: '+id'
      }
    }
  },
  created() {
    this.page()
  },
  methods: {
    page() {
      this.loading = true
      TestReportApi.page(this.query).then(data => {
        this.list = data.records
        this.total = data.total
        this.loading = false
      })
    },
    search() {
      this.query.pageNo = 1
      this.page()
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await TestReportApi.remove(row.id)
      this.page()
      this.$message.success(this.$t('message.removeSuccess'))
    },
    toDetail(row) {
      this.$router.push({
        name: 'snapshotTestReportDetail', params: { id: row.id }
      })
    }
  }
}
</script>
