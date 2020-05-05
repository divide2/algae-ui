<template>
  <el-card>
    <el-form ref="dataForm" :rules="rules" :model="group" label-width="150px" class="demo-form-inline">
      <el-row>
        <el-col v-bind="layout6">
          <el-form-item :label="$t('basic.deviceGroup.name')" prop="name">
            <el-input v-model="group.name" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-bind="layout6">
          <el-form-item :label="$t('basic.deviceGroup.location')" prop="location">
            <el-input v-model="group.location" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-for="(device,index) in group.devices" :key="index">
        <el-card>
          <el-col v-bind="layout6">
            <el-form-item :label="'#'+(index+1)+' '+ $t('basic.device.type')">
              <el-select v-model="device.deviceType" placeholder="请选择设备类型" filterable @change="typeChange(arguments,index)">
                <el-option v-for="t in types" :key="t" :label="t" :value="t" />
              </el-select>
            </el-form-item>

          </el-col>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.device.serial')">
              <el-select v-model="device.deviceSerial" filterable @change="deviceChange(arguments,index)">
                <el-option v-for="temp in devicesByType[index]" :key="temp.serial" :value="temp.serial" :label="temp.serial" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.device.address')">
              <el-input v-model="device.deviceAddress" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout4">
            <el-form-item label="">
              <el-button type="danger" circle icon="el-icon-delete" @click="removeRow(index)" />
            </el-form-item>
          </el-col>
        </el-card>
      </el-row>
      <el-row>
        <el-button type="info" plain style="width: 100%" @click="addRow">{{ $t('button.addRow') }}</el-button>
      </el-row>

    </el-form>
    <el-row type="flex" justify="center" style="margin-top: 20px">
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
import DeviceApi from '@/api/DeviceApi' // secondary package based on el-pagination

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
      id: '',
      layout4: {
        xl: 4,
        lg: 4,
        md: 12,
        xs: 24
      },
      layout6: {
        xl: 6,
        lg: 6,
        md: 12,
        xs: 24
      },
      group: {
        devices: [{
          deviceId: '',
          deviceType: '',
          deviceSerial: '',
          deviceAddress: ''
        }]
      },
      types: [],
      devicesByType: [
        []
      ],
      rules: {
        name: [
          { required: true },
          { validator: this.checkExist, trigger: 'blur' }
        ],
        location: [{ required: true, trigger: 'blur' }]
      },
      runLoading: false,
      curUpdateGroupName: ''
    }
  },
  computed: {},
  created() {
    this.listTypes()
    if (this.isEdit()) {
      this.id = this.$route.params.id
      this.groupGet()
    }
  },
  methods: {
    /**
     * 接口
     */
    async submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.group.devices)
          console.log(this.group.devices.length)
          this.checkTypeOfRepetition(this.group.devices)
          // this.$message({
          //   showClose: true,
          //   message: '警告哦，这是一条警告消息',
          //   type: 'warning'
          // });

          // this.runLoading = true
          // if (this.isEdit()) {
          //   this.group.id = this.id
          //   DeviceApi.groupUpdate(this.group).then(()=>{
          //     this.runLoading = false
          //     this.$message.success(this.$t('message.success'))
          //     this.$store.dispatch('tagsView/delView', this.$route)
          //     this.$router.push({ name: 'deviceGroup' })
          //   })
          // } else if (this.isCreate()) {
          //   DeviceApi.groupSave(this.group)(()=>{
          //     this.runLoading = false
          //     this.$message.success(this.$t('message.success'))
          //     this.$store.dispatch('tagsView/delView', this.$route)
          //     this.$router.push({ name: 'deviceGroup' })
          //   })
          // }
        }
      })
    },
    async typeChange(arg, index) {
      const device = await DeviceApi.listByType(arg[0])
      this.$set(this.devicesByType, index, device)
      this.group.devices[index].deviceId = null
      this.group.devices[index].deviceSerial = null
      this.group.devices[index].deviceAddress = null
    },
    async deviceChange(arg, index) {
      const deviceTemp = await DeviceApi.getBySerial(arg[0])
      this.group.devices[index].deviceAddress = deviceTemp.address
    },
    async listTypes() {
      this.types = await DeviceApi.listTypes()
    },
    async groupGet() {
      this.group = await DeviceApi.groupGet(this.id)
      this.curUpdateGroupName = this.group.name
    },
    async checkExist(rule, value, callback) {
      try {
        if (this.curUpdateGroupName !== value) { await DeviceApi.groupCheckExist(value) }
        callback()
      } catch (e) {
        callback(new Error(this.$t('message.alreadyExist')))
      }
    },
    async checkTypeOfRepetition(array) {
      const type =
      array.forEach(item => {
        return item.deviceType
        // console.log("xxxxxx")
        // console.log(item.deviceType)
        // this.$message({
        //   showClose: true,
        //   message: '警告哦，这是一条警告消息',
        //   type: 'warning'
        // });
      })
    },

    /**
     * 页面动作
     */
    removeRow(index) {
      this.group.devices.splice(index, 1)
    },
    addRow() {
      this.group.devices.push({
        deviceId: '',
        deviceType: '',
        deviceSerial: '',
        deviceAddress: ''
      })
    },
    cancel() {
      this.$router.back()
    },
    isCreate() {
      return this.type === 'create'
    },
    isEdit() {
      return this.type === 'edit'
    }
  }
}

</script>
