<template>
  <el-card>
    <el-form label-width="160px" size="mini" :model="instance" class="demo-form-inline">
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
    <el-form label-width="160px" size="mini" :model="instanceExec" class="demo-form-inline">
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
        </el-row>
      </el-card>
    </el-form>
    <el-divider content-position="left">{{ $t('message.caseInformation') }}</el-divider>
    <el-form label-width="160px" size="mini" :model="instanceExecCase" class="demo-form-inline">
      <el-card>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.caseName')+':'">
              {{ instanceExecCase.caseName }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.case.count')+':'">
              {{ instanceExecCase.cmdCount }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.startTime')+':'">
              {{ instanceExecCase.startTime }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.endTime')+':'">
              {{ instanceExecCase.endTime }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.durationMin')+':'">
              {{ instanceExecCase.duration }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.result')+':'">
              {{ $t(`status.snapshot.instanceExecCase.${instanceExecCase.result.toLowerCase()}`) }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.analysis')" prop="analysis">
              <el-select v-model="instanceExecCase.analysis" filterable allow-create default-first-option placeholder="请输入/选择结果分析">
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
      </el-card>
    </el-form>
    <el-divider content-position="left">{{ $t('message.commandInformation') }}</el-divider>

    <div class="filter-container">
      <el-input v-model="query.cmdName" :placeholder="$t('snapshot.instance.cmdName')" style="width: 200px;" class="filter-item" @keyup.enter.native="search"/>
      <el-select v-model="query.status" :placeholder="$t('snapshot.instance.status')" clearable class="filter-item" style="width: 200px" @change="search">
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

      <el-table-column align="center" :label="$t('snapshot.instance.cmdName')" prop="cmdName"/>
      <el-table-column align="center" :label="$t('snapshot.instance.status')">
        <template slot-scope="{row}">
          <el-button plain v-if="row.status==='UNEXEC'" size="mini">
            {{ $t(`status.snapshot.instanceExecLine.${row.status.toLowerCase()}`) }}
          </el-button>
          <el-button plain v-if="row.status==='ANALYZING'" size="mini">
            {{ $t(`status.snapshot.instanceExecLine.${row.status.toLowerCase()}`) }}
          </el-button>
          <el-button plain v-if="row.status==='SUCCESS'" type="primary" size="mini">
            {{ $t(`status.snapshot.instanceExecLine.${row.status.toLowerCase()}`) }}
          </el-button>
          <el-button plain v-if="row.status==='STOPPED'" type="warning" size="mini">
            {{ $t(`status.snapshot.instanceExecLine.${row.status.toLowerCase()}`) }}
          </el-button>
          <el-button plain v-if="row.status==='FAILED'" type="danger" size="mini">
            {{ $t(`status.snapshot.instanceExecLine.${row.status.toLowerCase()}`) }}
          </el-button>
          <el-button plain v-if="row.status==='RESULT_FAILED'" type="danger" size="mini">
            {{ $t(`status.snapshot.instanceExecLine.${row.status.toLowerCase()}`) }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('snapshot.instance.absoluteTime')" prop="absoluteTime"/>
      <el-table-column align="center" :label="$t('snapshot.instance.relativeTime')" prop="relativeTime"/>
      <el-table-column align="center" :label="$t('snapshot.instance.cmdExecutionTime')" prop="cmdExecutionTime"/>
      <el-table-column align="center" width="400" :label="$t('snapshot.instance.message')" prop="message"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page"/>
  </el-card>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import InstanceApi from '@/api/InstanceApi'
import CaseApi from '@/api/CaseApi'
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
      caseId: '',
      execCaseId: '',
      loading: true,
      instance: {},
      instanceExec: {},
      instanceExecCase: {},
      execLines: null,
      total: 0,
      query: {
        status: undefined,
        cmdName: undefined,
        caseName: undefined,
        sort: '+id'
      },
      analyses: [],
      statuses: getByType('status.snapshot.instanceExecLine')
    }
  },
  async created () {
    this.execCaseId = this.$route.params.id
    this.caseId = this.$route.params.caseId
    this.execId = this.$route.params.execId
    this.get()
    this.page()
    // this.listExecLines()
    // this.intervalRefresh()
  },
  // beforeRouteLeave(to, from, next) {
  //   if (interval) {
  //     clearInterval(interval)
  //     interval = null
  //   }
  //   next()
  // },
  methods: {
    page () {
      this.query.execId = this.execId
      this.query.caseId = this.caseId
      this.loading = true
      InstanceApi.listExecCmdLinePage(this.query).then(data => {
        this.execLines = data.records
        this.total = data.total
        this.loading = false
      })
    },
    async get () {
      this.instanceExecCase = await InstanceApi.getExecCase(this.execCaseId)
      this.instanceExec = await InstanceApi.getExec(this.execId)
      this.instanceId = this.instanceExec.instanceId
      this.instance = await InstanceApi.get(this.instanceId)
    },
    search () {
      this.query.pageNo = 1
      this.page()
    },
    async listAnalyses () {
      this.analyses = await InstanceApi.listCaseAnalyses()
    },
    async confirmUpdate () {
      await InstanceApi.updateCaseAnalysis(this.instanceExecCase)
      this.$message.success(this.$t('message.success'))
    }
    // intervalRefresh() {
    //   interval = setInterval(() => {
    //     this.page()
    //     if (this.execLines.every(item => item.status !== 'UNEXEC')) {
    //       clearInterval(interval)
    //       interval = null
    //     }
    //   }, 3000)
    // }
  }
}

</script>

