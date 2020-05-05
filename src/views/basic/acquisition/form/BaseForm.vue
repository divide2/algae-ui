<template>
  <el-card>
    <el-form ref="dataForm" :rules="rules" :model="acquisition" label-width="100px" class="demo-form-inline">
      <el-row>
        <el-col v-bind="layout6">
          <el-form-item :label="$t('basic.acquisition.name')" prop="title">
            <el-input v-model="acquisition.name" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col v-bind="layout6">
          <el-form-item :label="$t('basic.acquisition.description')">
            <el-input v-model="acquisition.description" type="textarea" placeholder="Please input" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-for="(channel,index) in acquisition.channels" :key="index">
        <el-card>
          <el-col v-bind="layout4">
            <el-form-item :label="$t('basic.acquisition.channel')">
              <el-input v-model="channel.channel" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout4">
            <el-form-item :label="$t('basic.acquisition.value')">
              <el-input v-model="channel.value" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout4">
            <el-form-item :label="$t('basic.acquisition.minValue')">
              <el-input v-model="channel.minValue" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout4">
            <el-form-item :label="$t('basic.acquisition.maxValue')">
              <el-input v-model="channel.maxValue" />
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
import DataAcquisitionApi from '@/api/DataAcquisitionApi'

export default {
  name: 'BaseForm',
  props: {
    type: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      layout6: {
        xl: 6,
        lg: 6,
        md: 12,
        xs: 24
      },
      layout4: {
        xl: 4,
        lg: 4,
        md: 12,
        xs: 24
      },
      acquisition: {
        channels: [{
          channel: '',
          value: ''
        }]
      },
      types: [],
      rules: {}
    }
  },
  created() {
    // this.listAcquisition()
    // this.listTypes()
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
        this.acquisition.id = this.id
        await DataAcquisitionApi.update(this.acquisition)
      } else if (this.isCreate()) {
        await DataAcquisitionApi.save(this.acquisition)
      }
      this.$message.success(this.$t('message.success'))
      await this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ name: 'acquisition' })
    },
    async listTypes() {
      this.types = await DataAcquisitionApi.listTypes()
    },
    async get() {
      this.acquisition = await DataAcquisitionApi.get(this.id)
    },
    /**
     * 页面动作
     */
    removeRow(index) {
      this.acquisition.channels.splice(index, 1)
    },
    addRow() {
      this.acquisition.channels.push({})
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
