<template>
  <el-card>
    <el-form ref="dataForm" :rules="rules" :model="laboratory" label-width="100px" class="demo-form-inline">
      <el-row>
        <el-col v-bind="layout6">
          <el-form-item :label="$t('basic.laboratory.name')" prop="title">
            <el-input v-model="laboratory.name" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-bind="layout6">
          <el-form-item :label="$t('basic.laboratory.ip')">
            <el-input v-model="laboratory.ip" />
          </el-form-item>
        </el-col>
        <el-col v-bind="layout6">
          <el-form-item :label="$t('basic.laboratory.location')">
            <el-input v-model="laboratory.location" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-bind="layout6">
          <el-form-item :label="$t('basic.laboratory.description')">
            <el-input v-model="laboratory.description" type="textarea" placeholder="Please input" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-for="(device,index) in laboratory.devices" :key="index">
        <el-card>
          <el-col v-bind="layout4">
            <el-form-item :label="$t('basic.laboratory.deviceName')">
              <el-input v-model="device.deviceName" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout4">
            <el-form-item :label="$t('basic.laboratory.deviceType')">
              <el-select v-model="device.deviceType" filterable allow-create default-first-option placeholder="请选择设备类型">
                <el-option v-for="t in types" :key="t" :label="t" :value="t" />
              </el-select>
            </el-form-item>

          </el-col>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.laboratory.deviceAddress')">
              <el-input v-model="device.deviceAddress" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.laboratory.deviceDescription')">
              <el-input v-model="device.deviceDescription" />
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
      <el-button type="success" @click="submit">
        {{ $t('button.submit') }}
      </el-button>
    </el-row>

  </el-card>
</template>

<script>
import LaboratoryApi from '@/api/LaboratoryApi'

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
      laboratory: {
        devices: [{
          deviceName: '',
          deviceType: '',
          deviceAddress: '',
          deviceDescription: ''
        }]
      },
      types: [],
      rules: {}
    }
  },
  created() {
    // this.listAcquisition()
    this.listTypes()
    if (this.isEdit()) {
      this.id = this.$route.params.id
      this.get()
    }
  },
  methods: {
    /**
     * 接口
     */
    async submit() {
      if (this.isEdit()) {
        this.laboratory.id = this.id
        await LaboratoryApi.update(this.laboratory)
      } else if (this.isCreate()) {
        await LaboratoryApi.save(this.laboratory)
      }
      this.$message.success(this.$t('message.success'))
      await this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'laboratory' })
    },
    async cmdTypeChange(arg, index) {
      const cmd = await LaboratoryApi.listByType(arg[0])
      this.cmds.splice(index, 0, cmd)
    },
    async listTypes() {
      this.types = await LaboratoryApi.listTypes()
    },
    async get() {
      this.laboratory = await LaboratoryApi.get(this.id)
    },

    /**
     * 页面动作
     */
    removeRow(index) {
      this.laboratory.devices.splice(index, 1)
    },
    addRow() {
      this.laboratory.devices.push({})
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
