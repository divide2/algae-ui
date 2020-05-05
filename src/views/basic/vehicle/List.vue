<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.imei" :placeholder="$t('basic.vehicle.imei')" style="width: 200px;" class="filter-item" @keyup.enter.native="search" />
      <el-input v-model="query.version" :placeholder="$t('basic.vehicle.version')" style="width: 200px;" class="filter-item" @keyup.enter.native="search" />
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
      <el-table-column width="150" :label="$t('basic.vehicle.imei')" prop="imei" />
      <el-table-column width="100" :label="$t('basic.vehicle.vehicleType')" prop="vehicleType" />
      <el-table-column width="150" :label="$t('basic.vehicle.version')" prop="version" />
      <el-table-column width="100" :label="$t('basic.vehicle.ccuVersion')" prop="ccuVersion" />
      <el-table-column width="100" :label="$t('basic.vehicle.ecuVersion')" prop="ecuVersion" />
      <el-table-column width="100" :label="$t('basic.vehicle.apVersion')" prop="apVersion" />
      <el-table-column width="100" :label="$t('basic.vehicle.bleVersion')" prop="bleVersion" />
      <el-table-column width="150" :label="$t('basic.vehicle.createTime')" prop="createTime" />
      <el-table-column :label="$t('basic.vehicle.description')" prop="description" />
      <el-table-column width="230" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="detail(row)">
            {{ $t('button.detail') }}
          </el-button>
          <el-button size="mini" type="danger" @click="remove(row)">
            {{ $t('button.remove') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page" />

    <el-dialog title="Create" :visible.sync="createDialog" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="vehicle" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('basic.vehicle.imei')" prop="imei">
          <el-input v-model="vehicle.imei" />
        </el-form-item>
        <el-form-item :label="$t('basic.vehicle.vehicleType')" prop="vehicleType">
          <el-select v-model="vehicle.vehicleType">
            <el-option value="V2.5" label="V2.5" />
            <el-option value="V3.0" label="V3.0" />
            <el-option value="V3.0GE" label="V3.0GE" />
            <el-option value="V3.1" label="V3.1" />
            <el-option value="X1.3" label="X1.3" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('basic.vehicle.description')">
          <el-input v-model="vehicle.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
        </el-form-item>
        <el-form-item :label="$t('basic.vehicle.address')" prop="address">
          <el-select v-model="vehicle.address">
            <el-option value="http://113.105.123.218:7070/mqtt/socket" label="http://113.105.123.218:7070/mqtt/socket" />
            <el-option value="http://riding.lbikechina.com/mqtt/socket" label="http://riding.lbikechina.com/mqtt/socket" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('basic.vehicle.at')" prop="at" style="width: 600px;">
          <el-input v-model="vehicle.at" />
        </el-form-item>
        <el-form-item :label="$t('basic.vehicle.response')" prop="response" style="width: 600px;">
          {{ vehicle.response }}
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="runLoading" @click="confirmQuery">
          {{ $t('button.search') }}
        </el-button>
        <el-button type="primary" :loading="runLoading" @click="confirmCreate">
          {{ $t('button.confirm') }}
        </el-button>
        <el-button @click="createDialog = false">
          {{ $t('button.cancel') }}
        </el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import BaseVehicleApi from '@/api/BaseVehicleApi' // secondary package based on el-pagination

export default {
  name: 'Cmd',
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
        imei: '',
        version: ''
      },
      rules: {
        imei: [
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
      vehicle: {
        imei: '',
        at: '',
        address: '',
        response: ''
      }

    }
  },
  created() {
    this.page()
  },
  methods: {
    page() {
      this.loading = true
      BaseVehicleApi.page(this.query).then(data => {
        this.list = data.records
        this.total = data.total
        this.loading = false
      })
    },
    create() {
      this.createDialog = true
      this.vehicle.at = 'AT+QRY=PASSWORD,$SENDTIME,$SERIAL,[0d8c,0d82,0d83,1384]$'
      this.vehicle.response = ''
    },

    detail(row) {
      this.$router.push({
        name: 'vehicleDetail', params: { id: row.id }
      })
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await BaseVehicleApi.remove(row.id)
      this.page()
      this.$message.success(this.$t('message.removeSuccess'))
    },
    async confirmCreate() {
      this.runLoading = true
      this.createDialog = false
      await BaseVehicleApi.save(this.vehicle)
      this.runLoading = false
      this.$message.success('message.success')
      await this.page()
    },
    async confirmQuery() {
      this.runLoading = true
      BaseVehicleApi.queryVersion(this.vehicle).then(data => {
        this.vehicle.response = JSON.stringify(data, null, 2)
      })
      this.runLoading = false
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
