<template>
  <el-card>
    <el-form label-width="120px" size="mini" :model="vehicle" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('basic.vehicle.imei')+':'">
            {{ vehicle.imei }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('basic.vehicle.vehicleType')+':'">
            {{ vehicle.vehicleType }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('basic.vehicle.createTime')+':'">
            {{ vehicle.createTime }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('basic.vehicle.version')+':'">
            {{ vehicle.version }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('basic.vehicle.ccuVersion')+':'">
            {{ vehicle.ccuVersion }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('basic.vehicle.apVersion')+':'">
            {{ vehicle.apVersion }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('basic.vehicle.ecuVersion')+':'">
            {{ vehicle.ecuVersion }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('basic.vehicle.bleVersion')+':'">
            {{ vehicle.bleVersion }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('basic.vehicle.description')+':'">
            {{ vehicle.description }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('basic.vehicle.address')+':'">
            {{ vehicle.address }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('basic.vehicle.at')+':'">
            {{ vehicle.at }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('basic.vehicle.response')+':'">
            {{ vehicle.response }}
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-divider />
    <el-table :data="history" border>
      <el-table-column label="#" type="index" />
      <el-table-column width="150" :label="$t('basic.vehicle.imei')" prop="imei" />
      <el-table-column width="150" :label="$t('basic.vehicle.version')" prop="version" />
      <el-table-column width="200" :label="$t('basic.vehicle.ccuVersion')" prop="ccuVersion" />
      <el-table-column width="200" :label="$t('basic.vehicle.ecuVersion')" prop="ecuVersion" />
      <el-table-column width="200" :label="$t('basic.vehicle.apVersion')" prop="apVersion" />
      <el-table-column width="200" :label="$t('basic.vehicle.bleVersion')" prop="apVersion" />
      <el-table-column width="150" :label="$t('basic.vehicle.createTime')" prop="createTime" />
      <el-table-column width="130" :label="$t('table.action')">
        <!--        <template slot-scope="{row}">-->
        <!--          <el-button type="primary" size="mini" @click="toDetail(row)">-->
        <!--            {{ $t('button.detail') }}-->
        <!--          </el-button>-->
        <!--        </template>-->
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
import BaseVehicleApi from '@/api/BaseVehicleApi'

export default {
  name: 'VehicleUpgrade',
  data() {
    return {
      id: '',
      vehicle: {},
      history: []
    }
  },
  created() {
    this.id = this.$route.params.id
    this.get()
    this.getHistory()
  },
  methods: {
    async get() {
      this.vehicle = await BaseVehicleApi.get(this.id)
    },
    async getHistory() {
      this.history = await BaseVehicleApi.getHistory(this.id)
    },
    toDetail(row) {
      this.$router.push({
        // name: 'snapshotInstanceExecDetail', params: { vehicleId: this.id, execId: row.id }
      })
    }
  }
}

</script>

