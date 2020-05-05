<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.name"
        :placeholder="$t('indexMonitor.indexManage.indexName')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="search"
      />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">
        {{ $t('button.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="create">
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
      <el-table-column width="250" :label="$t('indexMonitor.indexManage.indexName')" prop="name" />
      <el-table-column width="200" :label="$t('indexMonitor.indexManage.createTime')" prop="createTime" />
      <el-table-column width="230" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="detail(row)">
            {{ $t('button.detail') }}
          </el-button>
          <el-button type="primary" size="mini" @click="update(row)">
            {{ $t('button.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="remove(row)">
            {{ $t('button.remove') }}
          </el-button>
        </template>
      </el-table-column>
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
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import MonitorIndexApi from '@/api/MonitorIndexApi'

export default {
  name: 'IndexManage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      loading: true,
      runLoading: false,
      query: {
        sort: '+id',
        name: ''
      },
      rules: {
        name: [
          { required: true }
        ],
        vehicleType: [{ required: true }],
        address: [{ required: true }],
        at: [{ required: true }],
        response: [{ required: true },
          { validator: this.checkValidity, trigger: 'blur' }
        ]
      },
      createDialog: false,
      indexMonitor: {
        name: '',
        createTime: ''
      }

    }
  },
  created() {
    this.page()
  },
  methods: {
    page() {
      this.loading = true
      MonitorIndexApi.page(this.query).then(data => {
        this.list = data.records
        this.total = data.total
        this.loading = false
      })
    },
    create() {
      this.$router.push({ name: 'indexMonitorCreate' })
    },
    detail(row) {
      this.$router.push({ name: 'indexMonitorDetail', params: { id: row.fid }})
    },
    update(row) {
      this.$router.push({
        name: 'indexMonitorEdit', params: { id: row.fid }
      })
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await MonitorIndexApi.remove(row.fid)
      this.page()
      this.$message.success(this.$t('message.removeSuccess'))
    },
    async checkValidity(rule, value, callback) {
      try {
        // 检查报文是否满足云端解析要求
        // if (this.curUpdateInstanceId !== value) { await CaseApi.checkExist(value) }
        // callback()
      } catch (e) {
        callback(new Error(this.$t('message.noEffective')))
      }
    },
    search() {
      this.query.pageNo = 1
      this.page()
    }
  }
}
</script>
