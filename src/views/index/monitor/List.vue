<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.name"
        :placeholder="$t('indexMonitor.monitorExample.appVersion')"
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
      <el-table-column width="200" :label="$t('indexMonitor.monitorExample.versionType')" prop="versionType">
        <template slot-scope="{row}">{{ versionTypeMap[row.versionType] }}</template>
      </el-table-column>
      <el-table-column width="250" :label="$t('indexMonitor.monitorExample.appVersion')" prop="appVersion" />
      <el-table-column width="350" :label="$t('indexMonitor.monitorExample.monitorTime')" prop="startTime">
        <template slot-scope="{row}">{{ row.startTime }} - {{ row.endTime }}</template>
      </el-table-column>
      <el-table-column width="146" :label="$t('indexMonitor.monitorExample.monitorDuration')" prop="duration" />
      <el-table-column width="140" :label="$t('indexMonitor.monitorExample.runStatus')" prop="status">
        <template slot-scope="{row}">{{ monitorStatus[row.status] }}</template>
      </el-table-column>
      <el-table-column width="295" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="detail(row)">
            {{ $t('button.detail') }}
          </el-button>
          <el-button v-if="row.status == 0" type="primary" size="mini" @click="update(row)">
            {{ $t('button.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="remove(row)">
            {{ $t('button.remove') }}
          </el-button>
          <el-button v-if="row.status == 1" size="mini" plain type="danger" @click="stop(row)">
            {{ $t('button.stop') }}
          </el-button>
          <el-button v-if="row.status == 0" size="mini" plain type="success" :disabled="isDisable" @click="start(row)">
            {{ $t('button.run') }}
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
import MonitorExampleApi from '@/api/MonitorExampleApi'

export default {
  name: 'MonitorManage',
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
      },
      versionTypeMap: {
        1: '正式版本',
        2: '分支版本'
      },
      monitorStatus: {
        0: '未开始',
        1: '进行中',
        2: '已完成',
        3: '已终止'
      },
      isDisable: false
    }
  },
  created() {
    this.page()
  },
  methods: {
    page() {
      this.loading = true
      MonitorExampleApi.page(this.query).then(data => {
        this.list = data.records
        this.total = data.total
        this.loading = false
      })
    },
    create() {
      this.$router.push({ name: 'monitorCreate' })
    },
    detail(row) {
      this.$router.push({ name: 'monitorDetail', params: { id: row.fid }})
    },
    update(row) {
      this.$router.push({
        name: 'monitorEdit', params: { id: row.fid }
      })
    },
    start(row) {
      this.isDisable = true
      MonitorExampleApi.execute(row.fid)
      this.page()
      this.isDisable = false
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await MonitorExampleApi.remove(row.fid)
      this.page()
      this.$message.success(this.$t('message.removeSuccess'))
    },
    async stop(row) {
      this.loading = true
      await MonitorExampleApi.stop(row.fid)
      this.page()
      this.loading = false
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
