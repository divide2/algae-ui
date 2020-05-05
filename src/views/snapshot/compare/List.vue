<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.name" :placeholder="$t('snapshot.compare.name')" style="width: 200px;" class="filter-item" @keyup.enter.native="search" />
      <el-select v-model="query.status" :placeholder="$t('snapshot.compare.status')" clearable class="filter-item" style="width: 130px" @change="search">
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
      <el-table-column :label="$t('snapshot.compare.name')" prop="name" />
      <el-table-column :label="$t('snapshot.compare.instance')" prop="instanceName" />
      <el-table-column :label="$t('snapshot.compare.instanceExec')" prop="instanceExecName" />
      <el-table-column :label="$t('snapshot.compare.referInstance')" prop="referInstanceName" />
      <el-table-column :label="$t('snapshot.compare.referInstanceExec')" prop="referInstanceExecName" />
      <el-table-column :label="$t('snapshot.compare.createTime')" prop="createTime" />
      <el-table-column :label="$t('snapshot.compare.status')">
        <template slot-scope="{row}">
          {{ $t(`status.snapshot.compare.${row.status.toLowerCase()}`) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('snapshot.compare.description')" prop="description" />
      <el-table-column :label="$t('table.action')" width="250">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="detail(row)">
            {{ $t('button.detail') }}
          </el-button>
          <el-button size="mini" type="danger" @click="remove(row,'deleted')">
            {{ $t('button.remove') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="formDialog" :close-on-click-modal="false">

      <el-form ref="dataForm" :rules="rules" :model="compare" label-position="top" label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('snapshot.compare.name')" prop="name">
              <el-input v-model="compare.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="2">
            <el-form-item :label="$t('snapshot.compare.caseName')" prop="caseName">
              <el-select v-model="compare.caseId" @change="caseChange">
                <el-option v-for="ca in cases" :key="ca.id" :value="ca.id" :label="ca.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('snapshot.compare.instance')" prop="instanceId">
              <el-select v-model="compare.instanceId" @change="instanceChange">
                <el-option v-for="instance in instances" :key="instance.id" :value="instance.id" :label="instance.instanceId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('snapshot.compare.instanceExec')" prop="instanceExecId">
              <el-select v-model="compare.instanceExecId">
                <el-option v-for="ie in instanceExecs" :key="ie.id" :value="ie.id" :label="ie.instanceExecName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('snapshot.compare.referInstance')" prop="referInstanceId">
              <el-select v-model="compare.referInstanceId" @change="referInstanceChange">
                <el-option v-for="instance in instances" :key="instance.id" :value="instance.id" :label="instance.instanceId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('snapshot.compare.referInstanceExec')" prop="referInstanceExecId">
              <el-select v-model="compare.referInstanceExecId">
                <el-option v-for="rie in referInstanceExecs" :key="rie.id" :value="rie.id" :label="rie.instanceExecName" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('snapshot.compare.description')">
          <el-input v-model="compare.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formDialog = false">
          {{ $t('button.cancel') }}
        </el-button>
        <el-button type="primary" :loading="formLoading" @click="dialogStatus==='create'?confirmCreate():confirmEdit()">
          {{ $t('button.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <!--run dialog-->
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination/index'
import SnapshotCompareApi from '@/api/SnapshotCompareApi'
import InstanceApi from '@/api/InstanceApi'
import { getByType } from '@/config/Constant'
import { formatDate } from 'element-ui/lib/utils/date-util'
import CaseApi from '@/api/CaseApi' // secondary package based on el-pagination

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
      formLoading: false,
      runDialog: false,
      formDialog: false,
      dialogStatus: '',
      query: {
        status: undefined,
        name: undefined,
        sort: '+id'
      },
      compare: {
        compareId: ''
      },
      textMap: {
        create: 'Create'
      },
      instances: [],
      cases: [],
      rules: {
        name: [
          { required: true },
          { validator: this.checkExist }
        ],
        instanceId: [{ required: true }],
        instanceExecId: [{ required: true }],
        referInstanceId: [{ required: true }],
        referInstanceExecId: [{ required: true }],
        caseId: [{ required: true }]
      },
      instanceExecs: [],
      referInstanceExecs: [],
      statuses: getByType('status.snapshot.compare')
    }
  },
  created() {
    this.page()
    this.listCases()
  },
  methods: {
    page() {
      this.loading = true
      SnapshotCompareApi.page(this.query).then(data => {
        this.list = data.records
        this.total = data.total
        this.loading = false
      })
    },
    async listCases() {
      this.cases = await CaseApi.list({ status: 'USED', debugMode: false })
    },
    async caseChange(caseId) {
      this.instances = await InstanceApi.list({ caseId })
    },

    async checkExist(rule, value, callback) {
      try {
        if (this.curUpdateInstanceId !== value) { await SnapshotCompareApi.checkExist(value) }
        callback()
      } catch (e) {
        callback(new Error(this.$t('message.alreadyExist')))
      }
    },
    search() {
      this.query.pageNo = 1
      this.page()
    },

    reset() {
      this.compare = {
        name: `compare-${formatDate(new Date(), 'yyyyMMddHHmmss')}`
      }
    },
    create() {
      this.reset()
      this.dialogStatus = 'create'
      this.formDialog = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async confirmCreate() {
      this.formLoading = true
      await this.$refs.dataForm.validate()
      await SnapshotCompareApi.save(this.compare)
      this.formDialog = false
      this.formLoading = false
      this.$message.success(this.$t('message.success'))
      await this.page()
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await SnapshotCompareApi.remove(row.id)
      this.page()
      this.$message.success(this.$t('message.removeSuccess'))
    },
    detail(row) {
      this.$router.push({ name: 'snapshotCompareDetail', params: { id: row.id }})
    },
    async instanceChange(id) {
      this.instanceExecs = await InstanceApi.listExecs({ id: id, status: 'ANALYZED' })
    },
    async referInstanceChange(id) {
      this.referInstanceExecs = await InstanceApi.listExecs({ id: id, status: 'ANALYZED' })
    }
  }
}
</script>
