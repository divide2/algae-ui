<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.name" :placeholder="$t('snapshot.instance.instanceId')" style="width: 200px;" class="filter-item" @keyup.enter.native="search" />
      <el-select v-model="query.status"  :placeholder="$t('snapshot.instance.status')" clearable class="filter-item" style="width: 200px" @change="search">
        <el-option v-for="status in statuses" :key="status.key" :value="status.value" :label="$t(status.key)" />
      </el-select>
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
      <el-table-column :label="$t('snapshot.instance.instanceId')" prop="instanceId" />
      <el-table-column :label="$t('snapshot.instance.appVersion')" prop="appVersion" />
      <el-table-column :label="$t('snapshot.instance.caseCount')" prop="caseCount" />
      <el-table-column :label="$t('snapshot.instance.status')">
        <template slot-scope="{row}">
          {{ $t(`status.snapshot.instance.${row.status.toLowerCase()}`) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('snapshot.instance.count')" prop="count" />
      <el-table-column :label="$t('snapshot.instance.createTime')" prop="createTime" />
      <el-table-column :label="$t('table.action')" width="240px">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" @click="run(row)">
            {{ $t('button.run') }}
          </el-button>
          <el-button size="mini" @click="toDetail(row)">
            {{ $t('button.detail') }}
          </el-button>
          <el-button v-if="row.status!=='EXECING'" type="primary" size="mini" @click="update(row)">
            {{ $t('button.edit') }}
          </el-button>
          <el-button v-if="row.status==='UNEXEC'" size="mini" type="danger" @click="remove(row,'deleted')">
            {{ $t('button.remove') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page" />
    <!--run dialog-->
    <el-dialog title="Run" :visible.sync="runDialog" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="runRules" label-position="left" label-width="70px" style="width: 400px">
        <el-form-item label="imei" prop="imei">
          <el-select v-model="runParam.imei" filterable default-first-option placeholder="Please select">
            <el-option v-for="item in devices" :key="item.address" :value="item.address" :label="item.serial" />
          </el-select>
        </el-form-item>
        <el-form-item label="name" prop="instanceExecId">
          <el-input v-model="runParam.instanceExecId" />
        </el-form-item>
<!--        <el-form-item label="">-->
<!--          <el-button type="warning" @click="showCheckMsg = true">{{ $t('button.check') }}</el-button>-->
<!--          <span v-if="showCheckMsg">此功能还未实现，现可直接运行</span>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="runDialog = false">
          {{ $t('button.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRun">
          {{ $t('button.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import InstanceApi from '@/api/InstanceApi'
import { getByType } from '@/config/Constant'
import { formatDate } from 'element-ui/lib/utils/date-util'
import DeviceApi from '@/api/DeviceApi'

// arr to obj, such as { CN : "China", US : "USA" }
export default {
  name: 'InstanceList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      loading: true,
      runDialog: false,
      formDialog: false,
      dialogStatus: '',
      query: {
        status: undefined,
        name: undefined,
        sort: '+id'
      },
      runParam: {
        imei: '',
        instanceExecId: ``,
        instanceId: ''
      },
      instance: {
        caseId: ''
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      runRules: {
      },
      // 判断编辑是的名称
      curUpdateInstanceId: '',
      statuses: getByType('status.snapshot.instance'),
      showCheckMsg: false,
      devices: [[]]
    }
  },
  created() {
    this.page()
    this.getDevices()
  },
  methods: {
    page() {
      this.loading = true
      InstanceApi.page(this.query).then(data => {
        this.list = data.records
        this.total = data.total
        this.loading = false
      })
    },
    async checkExist(rule, value, callback) {
      try {
        if (this.curUpdateInstanceId !== value) { await InstanceApi.checkExist(value) }
        callback()
      } catch (e) {
        callback(new Error(this.$t('message.alreadyExist')))
      }
    },
    search() {
      this.query.pageNo = 1
      this.page()
    },
    async getDevices() {
      this.devices = await DeviceApi.list()
    },
    reset() {
      this.instance = {
        instanceId: `instance-${formatDate(new Date(), 'yyyyMMddHHmmss')}`
      }
    },
    create() {
      this.$router.push({ name: 'snapshotInstanceCreate' })
    },
    update(row) {
      this.$router.push({
        name: 'snapshotInstanceEdit', params: { id: row.id }
      })
    },
    run(row) {
      this.runDialog = true
      this.runParam.instanceId = row.id
      this.runParam.instanceExecId = `test-${formatDate(new Date(), 'yyyyMMddHHmmss')}`
    },
    async confirmRun() {
      this.runDialog = false
      this.loading = true
      await InstanceApi.run(this.runParam)
      this.loading = false
      this.$message.success(this.$t('message.runSuccess'))
      await this.page()
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await InstanceApi.remove(row.id)
      this.page()
      this.$message.success(this.$t('message.removeSuccess'))
    },
    toDetail(row) {
      this.$router.push({
        name: 'snapshotInstanceDetail', params: { id: row.id }
      })
    }
  }
}
</script>
