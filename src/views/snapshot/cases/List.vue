<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.name" :placeholder="$t('snapshot.case.name')" style="width: 200px;" class="filter-item" @keyup.enter.native="search" />
      <el-select v-model="query.status" :placeholder="$t('snapshot.case.status')" style="width: 200px;" class="filter-item" clearable @change="search">
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
      <el-table-column :label="$t('snapshot.case.name')" prop="name" />
      <el-table-column :label="$t('snapshot.case.status')">
        <template slot-scope="{row}">
          {{ $t(`status.snapshot.cases.${row.status.toLowerCase()}`) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('snapshot.case.count')" prop="count" />
      <el-table-column :label="$t('snapshot.case.createTime')" prop="createTime" />
      <el-table-column :label="$t('table.action')" width="320">
        <template slot-scope="{row}">
          <el-button size="mini" @click="toDetail(row)">
            {{ $t('button.detail') }}
          </el-button>
          <el-button size="mini" @click="toCopy(row)">
            {{ $t('button.copy') }}
          </el-button>
          <el-button v-if="row.debugMode === true || (row.status==='UNUSED' && row.debugMode===false)" type="primary" size="mini" @click="update(row)">
            {{ $t('button.edit') }}
          </el-button>
          <el-button v-if="row.debugMode === true || (row.status==='UNUSED' && row.debugMode===false)" size="mini" type="danger" @click="remove(row)">
            {{ $t('button.remove') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page" />

    <!--copy dialog-->
    <el-dialog title="Copy" :visible.sync="copyDialog" :close-on-click-modal="false">
      <el-form :rules="copyRules" :model="copyParam" label-position="left" label-width="70px" style="width: 400px">
        <el-form-item :label="$t('snapshot.case.name')" prop="name">
          <el-input v-model="copyParam.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="copyDialog = false">
          {{ $t('button.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmCopy">
          {{ $t('button.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import CaseApi from '@/api/CaseApi'
import { getByType } from '@/config/Constant' // secondary package based on el-pagination

export default {
  name: 'CaseList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      loading: true,
      query: {
        sort: '+id'
      },
      statuses: getByType('status.snapshot.cases'),
      copyDialog: false,
      copyParam: {
        caseId: '',
        name: ''
      },
      copyRules: {
        name: [
          { required: true },
          { validator: this.checkExist, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.page()
  },
  methods: {
    page() {
      this.loading = true
      CaseApi.page(this.query).then(data => {
        this.list = data.records
        this.total = data.total
        this.loading = false
      })
      console.log(this.list)
    },
    create() {
      this.$router.push({ name: 'snapshotCaseCreate' })
    },
    update(row) {
      this.$router.push({
        name: 'snapshotCaseEdit', params: { id: row.id }
      })
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await CaseApi.remove(row.id)
      this.page()
      this.$message.success(this.$t('message.removeSuccess'))
    },
    search() {
      this.query.pageNo = 1
      this.page()
    },
    toDetail(row) {
      this.$router.push({ name: 'snapshotCaseDetail', params: { id: row.id }})
    },
    toCopy(row) {
      this.copyDialog = true
      this.copyParam.caseId = row.id
    },
    async confirmCopy() {
      this.copyDialog = false
      await CaseApi.copy(this.copyParam)
      this.$message.success('message.success')
      await this.page()
    },
    async checkExist(rule, value, callback) {
      try {
        await CaseApi.checkExist(value)
        callback()
      } catch (e) {
        callback(new Error(this.$t('message.alreadyExist')))
      }
    }
  }
}
</script>
