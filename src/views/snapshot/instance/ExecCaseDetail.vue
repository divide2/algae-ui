<template>
  <el-card>
    <el-form label-width="200px" size="mini" :model="instance" class="demo-form-inline">
      <el-divider content-position="left">{{ $t('message.basicInformation') }}</el-divider>
      <el-card>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.instanceId')+':'">
              {{ instance.instanceId }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.appVersionType')+':'">
              {{ instance.appVersionType }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.appVersion')+':'">
              {{ instance.appVersion }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.createTime')+':'">
              {{ instance.createTime }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('snapshot.instance.testLink')+':'">
              {{ instance.testLink }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-divider content-position="left">{{ $t('message.testExecutionInformation') }}</el-divider>
    <el-form label-width="200px" size="mini" :model="instanceExec" class="demo-form-inline">
      <el-card>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.instanceExecName')+':'">
              {{ instanceExec.instanceExecName }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="imei:">
              {{ instanceExec.imei }}
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.startTime')+':'">
              {{ instanceExec.createTime }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.endTime')+':'">
              {{ instanceExec.endTime }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.duration')+':'">
              {{ instanceExec.duration }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.status')+':'">
              {{ $t(`status.snapshot.instanceExec.${instanceExec.status.toLowerCase()}`) }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.analysis')" prop="analysis">
              <el-select v-model="instanceExec.analysis" filterable allow-create default-first-option placeholder="Please select">
                <el-option v-for="analysis in analyses" :key="analysis" :value="analysis"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item style="margin-left: -120px;">
              <el-button type="primary" @click="confirmUpdate">
                {{ $t('button.update') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.passScore')+':'">
              {{ instanceExec.passScore }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.passRate')+':'">
              {{ instanceExec.passRate }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-divider content-position="left">{{ $t('message.caseExecutionList') }}</el-divider>

    <div class="filter-container">
      <el-input v-model="query.caseName" :placeholder="$t('snapshot.instance.caseName')" style="width: 200px;" class="filter-item" @keyup.enter.native="search"/>
      <el-select v-model="query.result" :placeholder="$t('snapshot.instance.result')" clearable class="filter-item" style="width: 200px" @change="search">
        <el-option v-for="status in statuses" :key="status.key" :value="status.value" :label="$t(status.key)"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">
        {{ $t('button.search') }}
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="execLines"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="#" type="index"/>
      <el-table-column align="center" :label="$t('snapshot.instance.caseName')" prop="caseName"/>
      <el-table-column align="center" :label="$t('snapshot.case.count')" prop="cmdCount"/>
      <el-table-column align="center" :label="$t('snapshot.instance.startTime')" prop="startTime"/>
      <el-table-column align="center" :label="$t('snapshot.instance.endTime')" prop="endTime"/>
      <el-table-column align="center" :label="$t('snapshot.instance.durationMin')" prop="duration"/>
      <el-table-column align="center" :label="$t('snapshot.instance.result')" prop="result">
        <template slot-scope="{row}">
          <el-button v-if="row.result==='UNEXEC'" plain size="mini">
            {{ $t(`status.snapshot.instanceExecCase.${row.result.toLowerCase()}`) }}
          </el-button>
          <el-button v-if="row.result==='EXECING'" plain :loading="row.result==='EXECING'" size="mini">
            {{ $t(`status.snapshot.instanceExecCase.${row.result.toLowerCase()}`) }}
          </el-button>
          <el-button v-if="row.result==='FAILED'" plain type="danger" size="mini">
            {{ $t(`status.snapshot.instanceExecCase.${row.result.toLowerCase()}`) }}
          </el-button>
          <el-button v-if="row.result==='SUCCESS'" plain type="primary" size="mini">
            {{ $t(`status.snapshot.instanceExecCase.${row.result.toLowerCase()}`) }}
          </el-button>
          <el-button v-if="row.result==='STOPPED'" plain type="warning" size="mini">
            {{ $t(`status.snapshot.instanceExecCase.${row.result.toLowerCase()}`) }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('snapshot.instance.analysis')" prop="analysis"/>
      <el-table-column align="center" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button size="mini" @click="toDetail(row)">{{ $t('button.detail') }}</el-button>
          <el-button v-if="row.result==='FAILED'" size="mini" @click="retry(row)">{{ $t('button.retry') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page"/>
  </el-card>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import InstanceApi from '@/api/InstanceApi'
import { getByType } from '@/config/Constant'

let interval
export default {
  name: 'SnapshotInstanceDetail',
  components: { Pagination },
  directives: { waves },
  data () {
    return {
      instanceId: '',
      execId: '',
      loading: true,
      instance: {},
      instanceExec: {
        analysis: '',
        id: ''
      },
      execLines: null,
      total: 0,
      query: {
        status: undefined,
        caseName: undefined,
        sort: '+id'
      },
      analyses: [],
      statuses: getByType('status.snapshot.instanceExecCase')
    }
  },
  async created () {
    this.execId = this.$route.params.execId
    this.instanceExec = await InstanceApi.getExec(this.execId)
    this.instanceId = this.instanceExec.instanceId
    this.get()
    this.page()
    this.listAnalyses()
  },
  methods: {
    page () {
      this.query.instanceId = this.instanceId
      this.query.execId = this.execId
      this.loading = true
      InstanceApi.listExecCaseLinePage(this.query).then(data => {
        this.execLines = data.records
        this.total = data.total
        this.loading = false
      })
    },
    async listAnalyses () {
      this.analyses = await InstanceApi.listAnalyses()
    },
    async get () {
      this.instance = await InstanceApi.get(this.instanceId)
    },
    search () {
      this.query.pageNo = 1
      this.page()
    },
    toDetail (row) {
      this.$router.push({
        name: 'snapshotInstanceExecCmdDetail', params: { id: row.id, caseId: row.caseId, execId: this.execId }
      })
    },
    async retry (row) {
      await InstanceApi.retry(this.execId, row.caseId)
      this.$message.success(this.$t('message.retrySuccess'))
      search()
      // this.$router.push({
      //   name: 'snapshotInstanceExecCmdDetail', params: { id: row.id, caseId: row.caseId, execId: this.execId }
      // })
    },
    async confirmUpdate () {
      await InstanceApi.updateAnalysis(this.instanceExec)
      this.$message.success(this.$t('message.success'))
    }
  }
}

</script>

