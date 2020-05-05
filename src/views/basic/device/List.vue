<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.serial" :placeholder="$t('basic.device.serial')" style="width: 200px;" class="filter-item" @keyup.enter.native="search" />
      <el-select v-model="query.type" :placeholder="$t('basic.device.type')" style="width: 200px;" class="filter-item" clearable @change="search">
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
      <el-table-column width="300" :label="$t('basic.device.serial')" prop="serial" />
      <el-table-column width="250" :label="$t('basic.device.type')" prop="type" />
      <el-table-column width="300" :label="$t('basic.device.address')" prop="address" />
      <el-table-column width="300" :label="$t('basic.device.createTime')" prop="createTime" />
      <el-table-column width="230" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="update(row)">
            {{ $t('button.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="remove(row)">
            {{ $t('button.remove') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page" />

    <el-dialog title="Create" :visible.sync="createDialog" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="device" label-position="left" label-width="150px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('basic.device.serial')" prop="serial">
          <el-input v-model="device.serial" />
        </el-form-item>
        <el-form-item :label="$t('basic.device.type')" prop="type">
          <el-select v-model="device.type" filterable allow-create default-first-option>
            <el-option v-for="t in types" :key="t" :value="t" :label="t" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('basic.device.address')" prop="address">
          <el-input v-model="device.address" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
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
import DeviceApi from '@/api/DeviceApi' // secondary package based on el-pagination

export default {
  name: 'Device',
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
        device: '',
        type: ''
      },
      rules: {
        serial: [
          { required: true },
          { validator: this.checkExist, trigger: 'blur' }
        ],
        type: [{ required: true, trigger: 'blur' }],
        address: [{ required: true, trigger: 'blur' }]
      },
      createDialog: false,
      types: [],
      device: {
        serial: '',
        type: '',
        address: ''
      },
      curUpdateDeviceId: ''
    }
  },
  created() {
    this.page()
    this.listTypes()
  },
  methods: {
    page() {
      this.loading = true
      DeviceApi.page(this.query).then(data => {
        this.list = data.records
        this.total = data.total
        this.loading = false
      })
    },
    create() {
      this.createDialog = true
    },
    async update(row) {
      this.createDialog = true
      this.device = await DeviceApi.get(row.id)
      this.curUpdateDeviceId = this.device.serial
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await DeviceApi.remove(row.id)
      this.page()
      this.$message.success(this.$t('message.removeSuccess'))
    },
    async confirmCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.runLoading = true
          DeviceApi.save(this.device).then(() => {
            this.runLoading = false
            this.createDialog = false
            this.$message.success(this.$t('message.success'))
            this.page()
          })
        }
      })
    },
    search() {
      this.query.pageNo = 1
      this.page()
    },
    async listTypes() {
      this.types = await DeviceApi.listTypes()
    },
    async checkExist(rule, value, callback) {
      try {
        if (this.curUpdateDeviceId !== value) { await DeviceApi.checkExist(value) }
        callback()
      } catch (e) {
        callback(new Error(this.$t('message.alreadyExist')))
      }
    }
  }
}
</script>
