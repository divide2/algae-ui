<template>
  <el-card>
    <el-form ref="dataForm" :rules="rules" :model="monitorBase" label-width="100px" class="demo-form-inline">
      <el-divider content-position="left">{{ $t('indexMonitor.monitorExample.selectVersion') }}</el-divider>
      <el-card>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.versionType')" prop="versionType">
              <el-select v-model="monitorBase.versionType" @change="versionTypeChange(arguments)">
                <el-option value="1" :label="$t('indexMonitor.monitorExample.versionMaster')" />
                <el-option value="2" :label="$t('indexMonitor.monitorExample.versionBranch')" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.appVersion')" prop="appVersion">
              <el-select v-model="monitorBase.appVersion">
                <el-option v-for="version in versions" :key="version" :value="version" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-divider content-position="left">{{ $t('indexMonitor.monitorExample.selectDevice') }}</el-divider>
      <el-card>
        <el-row v-for="(ds,index) in monitorBase.imeiList" :key="index">
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.selectCCU')">
              <el-select v-model="ds.imei">
                <el-option v-for="device in devices" :key="device.address" :value="device.address" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="!isView()" v-bind="layout4">
            <el-button type="danger" circle icon="el-icon-minus" style="margin-left: 20px;" @click="removeRow(index)" />
            <el-button type="primary" circle icon="el-icon-plus" @click="addRow" />
          </el-col>
        </el-row>
      </el-card>
      <el-divider content-position="left">{{ $t('indexMonitor.monitorExample.setMonitor') }}</el-divider>
      <el-card>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.monitorStartTime')" prop="startTime">
              <el-date-picker
                id="startTime"
                v-model="monitorBase.startTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="$t('indexMonitor.monitorExample.monitorTime')"
                @change="handleSelectMonitorDate()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('indexMonitor.monitorExample.monitorEndTime')" prop="endTime">
              <el-date-picker
                id="endTime"
                v-model="monitorBase.endTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="$t('indexMonitor.monitorExample.monitorTime')"
                @change="handleSelectMonitorDate()"
              />
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
                <el-input-number v-model="monitorBase.reminderFreq" size="small" />
                {{ $t('indexMonitor.monitorExample.monitorFreqUnit') }}
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col v-bind="layout12">
            <el-form-item :label="$t('indexMonitor.monitorExample.monitorEmail')" prop="reminderEmail">
              <el-input v-model="monitorBase.reminderEmail" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-bind="layout7">
          <el-col>
            <el-form-item :label="$t('indexMonitor.monitorExample.selectIndexMonitor')" prop="reminderEmail">
              <template>
                <el-table
                  ref="multipleTable"
                  :data="indexs"
                  tooltip-effect="dark"
                  height="350"
                  v-bind="layout4"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    fixed
                    type="selection"
                    width="55"
                  />
                  <el-table-column
                    fixed
                    prop="name"
                    :label="$t('indexMonitor.indexManage.indexName')"
                    width="120"
                  />
                </el-table>
              </template>
            </el-form-item>
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
import VersionApi from '@/api/VersionApi'
import DeviceApi from '@/api/DeviceApi'
import MonitorIndexApi from '@/api/MonitorIndexApi'

export default {
  name: 'BaseForm',
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
      layout30: {
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
      types: [],
      selectedIndexs: '',
      rules: {}
    }
  },
  created() {
    if (this.isEdit() || this.isView()) {
      this.id = this.$route.params.id
      this.get()
    }
    this.getDevices()
    this.getIndexs()
  },
  methods: {
    /**
       * 接口
       */
    async submit() {
      console.log(this.monitorBase)
      this.runLoading = true
      if (this.isEdit()) {
        this.monitorBase.fid = this.id
        MonitorExampleApi.update(this.monitorBase.fid, this.monitorBase).then(() => {
          this.runLoading = false
          this.$message.success(this.$t('message.success'))
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.push({ name: 'monitorManage' })
        })
      } else if (this.isCreate()) {
        MonitorExampleApi.save(this.monitorBase).then(() => {
          this.runLoading = false
          this.$message.success(this.$t('message.success'))
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.push({ name: 'monitorManage' })
        })
      }
    },
    async get() {
      // const cmd = await CmdApi.list()
      this.monitorBase = await MonitorExampleApi.get(this.id)
      if (this.monitorBase.imeiList == null) {
        this.monitorBase.imeiList = [{ imei: '' }]
      }
      console.log(this.monitorBase)
    },
    async versionTypeChange(arg) {
      this.monitorBase.appVersion = null
      console.log(arg[0])
      var vtype = ''
      if (arg[0] == 1) {
        vtype = 'Master'
      } else {
        vtype = 'Branch'
      }
      this.versions = await VersionApi.listByType(vtype)
      // this.instance.appVersion = null
      // this.cases.caseCmds[index].cmdBaseId = null
      // this.cases.caseCmds[index].cmdBaseName = null
      // this.cmds.splice(index, 0, cmd)
    },
    async getDevices() {
      this.devices = await DeviceApi.list()
      // this.instance.appVersion = null
      // this.cases.caseCmds[index].cmdBaseId = null
      // this.cases.caseCmds[index].cmdBaseName = null
      // this.cmds.splice(index, 0, cmd)
    },
    async getIndexs() {
      this.indexs = await MonitorIndexApi.list()
      console.log(this.indexs)
      this.toggleSelection(this.indexs)
      // this.instance.appVersion = null
      // this.cases.caseCmds[index].cmdBaseId = null
      // this.cases.caseCmds[index].cmdBaseName = null
      // this.cmds.splice(index, 0, cmd)
    },
    handleSelectionChange(val) {
      this.monitorBase.indexList = val
    },
    toggleSelection(rows) {
      this.$nextTick(function() {
        rows.forEach(row => {
          if (this.monitorBase.indexFids.indexOf(row.fid) >= 0) {
            console.log(row)
            this.$refs.multipleTable.toggleRowSelection(row, true)
          }
        })
      })
    },
    handleSelectMonitorDate() {
      var sTime = this.monitorBase.startTime
      var eTime = this.monitorBase.endTime
      if (typeof (sTime) === 'string') {
        sTime = new Date(sTime)
      }
      if (typeof (eTime) === 'string') {
        eTime = new Date(eTime)
      }
      var startTime = sTime.getTime()
      var endTime = eTime.getTime()

      var v = (endTime - startTime) / 1000

      var min = Math.floor(v % 3600)
      var h = Math.floor(v / 3600)
      var m = Math.floor(min / 60)
      var s = v % 60
      var ds = ''
      if (h > 0) {
        ds = h + 'h'
      }
      if ((m == 0 && h > 0) || m > 0) {
        ds = ds + m + 'm'
      }

      ds = ds + s + 's'

      this.monitorBase.duration = ds
    },

    /**
       * 页面动作
       */
    removeRow(index) {
      if (this.monitorBase.imeiList.length == 1) {
        return
      }
      this.monitorBase.imeiList.splice(index, 1)
    },
    addRow() {
      this.monitorBase.imeiList.push({})
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
