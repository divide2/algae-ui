<template>
  <el-card>
    <el-form ref="dataForm" :rules="rules" :model="monitorBase" label-width="100px" class="demo-form-inline">
      <el-divider content-position="left">{{ $t('indexMonitor.monitorExample.baseInfo') }}</el-divider>
      <el-card>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.versionType')" prop="versionType">
              {{ versionTypeMap[monitorBase.versionType] }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.appVersion')" prop="appVersion">
              {{ monitorBase.appVersion }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.deviceNum')" prop="appVersion">
              {{ monitorBase.imeiList.length }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(ds,index) in monitorBase.imeiList" :key="index">
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.ccuImei')" style="margin-left: 50px;">
              {{ ds.imei }}
            </el-form-item>
          </el-col>
          <el-col v-if="!isView()" v-bind="layout4">
            <el-button type="danger" circle icon="el-icon-minus" style="margin-left: 20px;" @click="removeRow(index)" />
            <el-button type="primary" circle icon="el-icon-plus" @click="addRow" />
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.monitorStartTime')" prop="startTime">
              {{ monitorBase.startTime }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.monitorEndTime')" prop="endTime">
              {{ monitorBase.endTime }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.monitorDuration')" prop="duration">
              {{ monitorBase.duration }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="layout7">
            <el-form-item :label="$t('indexMonitor.monitorExample.monitorAlert')">
              <el-form-item :label="$t('indexMonitor.monitorExample.monitorFreq')" prop="reminderFreq">
                {{ monitorBase.reminderFreq }}
                {{ $t('indexMonitor.monitorExample.monitorFreqUnit') }}
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col v-bind="layout12">
            <el-form-item :label="$t('indexMonitor.monitorExample.monitorEmail')" prop="reminderEmail">
              {{ monitorBase.reminderEmail }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-divider content-position="left">{{ $t('indexMonitor.monitorExample.monitorResult') }}</el-divider>
      <el-card>
        <el-row>
          <el-col v-bind="layout12">
            <el-form-item :label="$t('indexMonitor.monitorExample.monitorResultTime')">
              {{ monitorBase.startTime }} -- {{ monitorBase.endTime }}  ({{ $t('indexMonitor.monitorExample.monitorResultTimeDes') }})
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(indexObjs,index) in indexMonitors" :key="index">
          <el-col v-bind="layout12">
            <template>
              <el-table
                :data="indexObjs"
                tooltip-effect="dark"
                v-bind="layout4"
              >
                <el-table-column
                  fixed
                  prop="exceptionNum"
                  width="250px"
                  :label="indexObjs[0].name1"
                />
                <el-table-column
                  fixed
                  prop="checkCount"
                  width="150px"
                  :label="indexObjs[0].name2"
                />
                <el-table-column
                  fixed
                  prop="exceptionRate"
                  width="200px"
                  :label="indexObjs[0].name3"
                />
                <el-table-column
                  fixed
                  :label="$t('table.action')"
                >
                  <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="detail(row)">
                      {{ $t('button.detail') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-row v-if="!isView()" type="flex" justify="center" style="margin-top: 20px">
      <el-button type="warning" @click="cancel">
        {{ $t('button.cancel') }}
      </el-button>
      <el-button type="success" :loading="runLoading" @click="submit">
        {{ $t('button.submit') }}
      </el-button>
    </el-row>

  </el-card>
</template>

<script>
import MonitorExampleApi from '@/api/MonitorExampleApi'
import DeviceApi from '@/api/DeviceApi'

export default {
  name: 'DetailForm',
  props: {
    type: {
      default: 'create',
      type: String
    }
  },
  data() {
    return {
      runLoading: false,
      layout4: {
        xl: 4,
        lg: 4,
        md: 12,
        xs: 12
      },
      layout6: {
        xl: 6,
        lg: 6,
        md: 12,
        xs: 24
      },
      layout7: {
        xl: 7,
        lg: 7,
        md: 12,
        xs: 24
      },
      layout12: {
        xl: 12,
        lg: 12,
        md: 12,
        xs: 24
      },
      layout15: {
        xl: 15,
        lg: 15,
        md: 12,
        xs: 24
      },
      layout18: {
        xl: 18,
        lg: 18,
        md: 12,
        xs: 24
      },
      monitorBase: {
        fid: '',
        versionType: '',
        appVersion: '',
        imeis: '',
        startTime: '',
        endTime: '',
        duration: '',
        indexFids: '',
        endMonitorTime: '',
        reminderFreq: '',
        reminderEmail: '',
        imeiList: [{
          imei: ''
        }],
        indexList: [{
          fid: '',
          name: ''
        }]
      },
      versions: [],
      devices: [],
      indexs: [],
      indexMonitors: [],
      types: [],
      selectedIndexs: '',
      rules: {},
      versionTypeMap: {
        1: '正式版本',
        2: '分支版本'
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    this.get()
    this.getDevices()
    this.getIndexs()
  },
  methods: {
    async get() {
      // const cmd = await CmdApi.list()
      this.monitorBase = await MonitorExampleApi.get(this.id)
      console.log(this.monitorBase)
      if (this.monitorBase.imeiList == null) {
        this.monitorBase.imeiList = [{ imei: '' }]
      }
    },
    async getDevices() {
      this.devices = await DeviceApi.list()
      // this.instance.appVersion = null
      // this.cases.caseCmds[index].cmdBaseId = null
      // this.cases.caseCmds[index].cmdBaseName = null
      // this.cmds.splice(index, 0, cmd)
    },
    async getIndexs() {
      this.indexs = await MonitorExampleApi.getMonitorIndex(this.id)
      console.log(this.indexs)
      if (this.indexs.length > 0) {
        this.monitorBase.endMonitorTime = this.indexs[0].lastTime
      }

      for (var ind in this.indexs) {
        if (this.indexs[ind].exceptionRate == 'null' || this.indexs[ind].exceptionRate == null) {
          continue
        }
        var arr = new Array()
        this.indexs[ind].name1 = this.indexs[ind].name + ' Number of failures'
        this.indexs[ind].name2 = 'Total times'
        this.indexs[ind].name3 = this.indexs[ind].name + ' Failure rate'
        this.indexs[ind].exceptionRate = this.indexs[ind].exceptionRate + '%'
        arr.push(this.indexs[ind])
        this.indexMonitors.push(arr)
      }
      console.log(this.indexMonitors)
    },
    detail(row) {
      console.log(row)
      this.$router.push({ name: 'monitorResponseDetail', params: { id: row.fid }})
    },
    cancel() {
      this.$router.back()
    },
    isCreate() {
      return this.type === 'create'
    },
    isEdit() {
      return this.type === 'edit'
    },
    isView() {
      return this.type === 'view'
    }
  }
}
</script>
