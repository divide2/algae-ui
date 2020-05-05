<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.name" :placeholder="$t('basic.cmd.name')" style="width: 200px;" class="filter-item" @keyup.enter.native="search" />
      <el-input v-model="query.cmd" :placeholder="$t('basic.cmd.cmd')" style="width: 200px;" class="filter-item" @keyup.enter.native="search" />
      <el-select v-model="query.type" :placeholder="$t('basic.cmd.type')" style="width: 200px;" class="filter-item" clearable @change="search">
        <el-option v-for="t in types" :key="t" :value="t" :label="t" />
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
      <el-table-column width="200" :label="$t('basic.cmd.name')" prop="name" />
      <el-table-column width="100" :label="$t('basic.cmd.type')" prop="type" />
      <el-table-column :label="$t('basic.cmd.cmd')" prop="cmd" />
      <el-table-column width="180" :label="$t('basic.cmd.createTime')" prop="createTime" />
      <el-table-column width="250" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="update(row)">
            {{ $t('button.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="remove(row)">
            {{ $t('button.remove') }}
          </el-button>
          <el-button v-if="row.type==='mqtt'" size="mini" type="success" @click="run(row)">
            {{ $t('button.run') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page" />
    <!--run dialog-->
    <el-dialog title="Run" :visible.sync="runDialog" :close-on-click-modal="false">
      <el-form :rules="runRules" label-position="left" label-width="70px">
        <el-form-item label="imei" prop="imei">
          <el-input v-model="imeis" />
        </el-form-item>

        <el-form-item label="Address" prop="address">
          <el-select v-model="runParam.address">
            <el-option value="http://113.105.123.218:7070/mqtt/socket" label="http://113.105.123.218:7070/mqtt/socket" />
            <el-option value="http://riding.lbikechina.com/mqtt/socket" label="http://riding.lbikechina.com/mqtt/socket" />
          </el-select>
        </el-form-item>
        <el-form-item label="result">
          <el-tabs tab-position="left">
            <el-tab-pane v-for="imei in imeis.split(',')" :key="imei" :label="imei">
              <pre>{{ results[imei] }}</pre>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
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
import CmdApi from '@/api/CmdApi' // secondary package based on el-pagination

export default {
  name: 'Cmd',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      loading: true,
      query: {
        sort: '+id',
        name: '',
        cmd: '',
        type: ''
      },
      imeis: '',
      runParam: {
        imei: '',
        id: '',
        address: ''
      },
      options: [],
      runRules: {},
      runDialog: false,
      types: [],
      results: {}
    }
  },
  created() {
    this.page()
    this.listTypes()
  },
  methods: {
    page() {
      this.loading = true
      CmdApi.page(this.query).then(data => {
        this.list = data.records
        this.total = data.total
        this.loading = false
      })
      console.log('this.list')
      console.log(this.list)
    },
    async listTypes() {
      this.types = await CmdApi.listTypes()
    },
    create() {
      this.$router.push({ name: 'cmdCreate' })
    },
    update(row) {
      this.$router.push(
        {
          name: 'cmdUpdate', params: { id: row.id }
        })
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await CmdApi.remove(row.id)
      this.page()
      this.$message.success(this.$t('message.removeSuccess'))
    },
    run(row) {
      this.runDialog = true
      this.runParam.id = row.id
      this.results = {}
    },
    confirmRun() {
      this.imeis.split(',').forEach((imei, index) => {
        setTimeout(() => {
          this.runParam.imei = imei
          CmdApi.run(this.runParam).then(data => {
            this.$set(this.results, imei, JSON.stringify(data, null, 2))
          })
        }, 2000 * index)
      })
    },
    search() {
      this.query.pageNo = 1
      this.page()
    }
  }
}
</script>

<style scoped>
pre {
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  *white-space: normal !important;
}
</style>
