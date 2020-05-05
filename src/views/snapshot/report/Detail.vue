<template>
  <el-card>
    <el-form label-width="200px" size="mini" :model="report" class="demo-form-inline">
      <el-divider content-position="left">{{ $t('message.basicInformation') }}</el-divider>
      <el-card>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.appVersion')+':'">
              {{ report.appVersion }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.appVersionType')+':'">
              {{ report.appVersionType }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.startTime')+':'">
              {{ report.startTime }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.endTime')+':'">
              {{ report.endTime }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.testReport.duration')+':'">
              {{ report.duration }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.instance.testUser')+':'">
              {{ report.testUser }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('snapshot.instance.testLink')+':'">
              {{ report.testLink }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.testReport.deviceCount')+':'">
              {{ report.deviceCount }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.testReport.testCount')+':'">
              {{ report.testCount }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-divider content-position="left">{{ $t('message.testResult') }}</el-divider>
      <el-form label-width="200px" size="mini" :model="report.instanceExec" class="demo-form-inline">
        <el-card>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('snapshot.testReport.result')+':'">
                {{ $t(`status.snapshot.instanceExec.${report.instanceExec.status.toLowerCase()}`) }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('snapshot.instance.instanceExecName')+':'">
                {{ report.instanceExec.instanceExecName }}
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item style="margin-left: -120px;">
                <el-button @click="toDetailExec">
                  {{ $t('button.detail') }}
                </el-button>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('snapshot.instance.passScore')+':'">
                {{ report.instanceExec.passScore }}
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('snapshot.instance.passRate')+':'">
                {{ report.instanceExec.passRate }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
      <el-divider content-position="left">{{ $t('message.versionInformation') }}</el-divider>
      <el-card>
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('basic.version.libVersion')+':'">
              {{ report.libVersion }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('basic.version.bleVersion')+':'">
              {{ report.bleVersion }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('basic.version.apVersion')+':'">
              {{ report.apVersion }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-for="(ecu,index) in report.ecus" :key="index">

          <el-col :span="6">
            <el-form-item :label="$t('basic.version.ecuVersion')+':'">
              {{ ecu.ecuVersion }}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('basic.version.ecuFactory')+':'">
              {{ ecu.ecuFactory }}
            </el-form-item>
          </el-col>

        </el-row>
      </el-card>
    </el-form>

    <el-divider content-position="left">{{ $t('message.testExecutionHistory') }}</el-divider>
<!--    <div class="filter-container">-->
<!--      <el-input v-model="query.appVersion" :placeholder="$t('snapshot.instance.appVersion')" style="width: 200px;" class="filter-item" @keyup.enter.native="search" />-->
<!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">-->
<!--        {{ $t('button.search') }}-->
<!--      </el-button>-->
<!--    </div>-->
    <el-table
      v-loading="loading"
      :data="execs"
      border
      fit
      highlight-current-row
      :row-class-name="tableRowClassName"
      style="width: 100%;"
    >
      <el-table-column align="center" :label="$t('snapshot.instance.instanceExecName')" prop="instanceExecName" width="160" />
      <el-table-column :label="$t('snapshot.instance.appVersion')" prop="appVersion" width="120" />
      <el-table-column :label="$t('snapshot.instance.appVersionType')" prop="appVersionType" width="80" />
      <el-table-column align="center" label="Imei" prop="imei" width="145" />
      <el-table-column align="center" :label="$t('snapshot.instance.startTime')" prop="createTime" width="160" />
      <el-table-column align="center" :label="$t('snapshot.instance.endTime')" prop="endTime" width="160" />
      <el-table-column align="center" :label="$t('snapshot.instance.duration')" prop="duration" width="100" />
      <el-table-column :label="$t('snapshot.instance.result')" width="80">
        <template slot-scope="{row}">
          {{ $t(`status.snapshot.instanceExec.${row.status.toLowerCase()}`) }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('snapshot.instance.passScore')" prop="passScore" width="110" />
      <el-table-column align="center" :label="$t('snapshot.instance.passRate')" prop="passRate" width="85" />
      <el-table-column align="center" :label="$t('snapshot.instance.analysis')" prop="analysis" width="100" />
      <el-table-column align="center" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button size="mini" @click="toDetail(row)">{{ $t('button.detail') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page" />

  </el-card>
</template>

<script>
// import InstanceApi from '@/api/InstanceApi'
import TestReportApi from '@/api/TestReportApi'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
  name: 'SnapshotTestReport',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      id: '',
      report: {
        ecus: [{
          ecuVersion: '',
          ecuFactory: ''
        }],
        instanceExec: {}
      },
      execs: null,
      query: {
        status: undefined,
        id: '',
        sort: '+id'
      },
      loading: true,
      total: 0,
    }
  },
  created() {
    this.id = this.$route.params.id
    this.get()
    this.page()
  },
  methods: {
    page() {
      console.log('this.id'+this.id)
      this.query.id = this.id
      this.loading = true
      TestReportApi.listExecPage(this.query).then(data => {
        this.execs = data.records
        this.total = data.total
        this.loading = false
      })
    },
    search() {
      this.query.pageNo = 1
      this.page()
    },
    async get() {
      this.report = await TestReportApi.get(this.id)
    },
    toDetail(row) {
      this.$router.push({
        name: 'snapshotInstanceExecCaseDetail', params: { instanceId: this.id, execId: row.id }
      })
    },
    async toDetailExec() {
      this.$router.push({
        name: 'snapshotInstanceExecCaseDetail', params: { instanceId: this.id, execId: this.report.instanceExec.id }
      })
    },
    tableRowClassName({row, rowIndex}) {
      if (row.status === 'SUCCESS') {
        return 'success-row';
      } else if (row.status === 'FAILED') {
        return 'warning-row';
      }
      return '';
    }
  }
}

</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

