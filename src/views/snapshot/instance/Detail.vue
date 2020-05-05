<template>
  <el-card>
    <el-form label-width="150px" size="mini" :model="instance" class="demo-form-inline">
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
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('snapshot.instance.description')+':'">
              {{ instance.description }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-divider content-position="left">{{ $t('message.testExecutionHistory') }}</el-divider>
    <el-table :data="execs" border>
      <el-table-column align="center" :label="$t('snapshot.instance.instanceExecName')" prop="instanceExecName" width="200" />
      <el-table-column align="center" label="Imei" prop="imei" width="145" />
      <el-table-column align="center" :label="$t('snapshot.instance.startTime')" prop="createTime" width="160" />
      <el-table-column align="center" :label="$t('snapshot.instance.endTime')" prop="endTime" width="160" />
      <el-table-column align="center" :label="$t('snapshot.instance.duration')" prop="duration" />
      <el-table-column align="center" :label="$t('snapshot.instance.result')">
        <template slot-scope="{row}">
          {{ $t(`status.snapshot.instanceExec.${row.status.toLowerCase()}`) }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('snapshot.instance.passScore')" prop="passScore" />
      <el-table-column align="center" :label="$t('snapshot.instance.passRate')" prop="passRate" />
      <el-table-column align="center" :label="$t('snapshot.instance.analysis')" prop="analysis" />
      <el-table-column align="center" :label="$t('table.action')" width="160">
        <template slot-scope="{row}">
          <el-button size="mini" @click="toDetail(row)">{{ $t('button.detail') }}</el-button>
          <el-button v-if="row.status==='EXECING'" size="mini" type="danger" @click="stop(row)">{{ $t('button.stop') }}</el-button>

          <!--          <el-button v-if="row.status==='EXECED'" size="mini" type="info" @click="upload(row)">{{ $t('button.upload') }}</el-button>-->
          <!--          <el-button v-if="row.status==='UPLOADED'" size="mini" type="warning" @click="genAnalyzeMode(row)">{{ $t('button.analyze') }}</el-button>-->
          <!--          <el-button v-if="row.status==='ANALYZED'" size="mini" type="primary" @click="toReport(row)">{{ $t('button.report') }}</el-button>-->
          <!--          <el-button v-if="row.status==='EXECING'" size="mini" type="danger" @click="stop(row)">{{ $t('button.stop') }}</el-button>-->
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
import InstanceApi from '@/api/InstanceApi'

let interval
export default {
  name: 'SnapshotInstanceDetail',
  data() {
    return {
      id: '',
      instance: {},
      execs: []
    }
  },
  created() {
    this.id = this.$route.params.id
    this.get()
    this.listExecs()
    this.intervalRefresh()
  },
  beforeRouteLeave(to, from, next) {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    next()
  },
  methods: {
    async get() {
      this.instance = await InstanceApi.get(this.id)
    },
    async listExecs() {
      this.execs = await InstanceApi.listExecs({ id: this.id })
    },
    // async genAnalyzeMode(row) {
    //   await InstanceApi.genAnalyzeMode(this.id, row.id)
    //   this.$message.success(this.$t('message.success'))
    //   this.intervalRefresh()
    // },
    // async upload(row) {
    //   await InstanceApi.upload(this.id, row.id)
    //   this.$message.success(this.$t('message.success'))
    //   this.intervalRefresh()
    // },
    async stop(row) {
      await InstanceApi.stop(this.id, row.id)
      this.$message.success(this.$t('message.success'))
      this.listExecs()
      this.intervalRefresh()
    },
    toDetail(row) {
      this.$router.push({
        name: 'snapshotInstanceExecCaseDetail', params: { instanceId: row.instanceId, execId: row.id }
      })
    },
    toReport(row) {
      this.$router.push({ name: 'snapshotInstanceReport', params: { instanceId: row.id }})
    },
    intervalRefresh() {
      const needInterval = ['UPLOADING', 'ANALYZING', 'EXECING']
      interval = setInterval(() => {
        this.listExecs()
        if (this.execs.every(item => !needInterval.includes(item.status))) {
          clearInterval(interval)
          interval = null
        }
      }, 3000)
    }
  }
}

</script>

