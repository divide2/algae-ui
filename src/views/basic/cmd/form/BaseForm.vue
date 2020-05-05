<template>
  <el-card>
    <el-form ref="dataForm" :rules="rules" :model="cmd" label-width="160px">
      <el-form-item :label="$t('basic.cmd.name')" prop="name">
        <el-input v-model="cmd.name" />
      </el-form-item>
      <el-form-item :label="$t('basic.cmd.type')" prop="type">
        <el-select v-model="cmd.type">
          <el-option v-for="t in types" :key="t" :value="t" :label="t" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('basic.cmd.cmd')" prop="cmd">
        <el-input v-if="cmd.type!=='mqtt'" v-model="cmd.cmd" />
        <mqtt-cmd-input v-if="cmd.type === 'mqtt'" v-model="cmd.cmd" />
      </el-form-item>
      <el-form-item :label="$t('basic.cmd.description')">
        <el-input v-model="cmd.description" type="textarea" placeholder="Please input" />
      </el-form-item>
      <el-row v-for="(expect,index) in cmd.expects" :key="index">
        <el-card>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.cmd.expectName')">
              <el-input v-model="expect.name" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout4">
            <el-form-item :label="$t('basic.cmd.waitTime')">
              <el-input-number v-model="expect.waitTime" size="small" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.cmd.type')">
              <el-select v-model="expect.type">
                <el-option label="Response" value="response" />
                <el-option label="SocketDB" value="socketDB" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.cmd.header')">
              <el-input v-model="expect.header" placeholder="+RESP:UPG" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout8">
            <el-form-item :label="$t('basic.cmd.pattern')">
              <el-input v-model="expect.pattern" placeholder="0C80:\[2,0,1\]" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout8">
            <el-form-item :label="$t('basic.cmd.regularExpression')">
              <el-input v-model="expect.regularExpression" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout3">
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
import CmdApi from '@/api/CmdApi'
import MqttCmdInput from '@/views/basic/cmd/components/MqttCmdInput'

export default {
  name: 'BaseForm',
  components: { MqttCmdInput },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      runLoading: false,
      mqttCmdType: 'QRY',
      mqttCmdValue: '',
      id: '',
      layout3: {
        xl: 3,
        lg: 3,
        md: 12,
        xs: 24
      },
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
      layout8: {
        xl: 8,
        lg: 8,
        md: 12,
        xs: 24
      },
      cmd: {
        expects: [{}],
        type: 'mqtt'
      },
      types: [],
      rules: {
        name: [
          { required: true },
          { validator: this.checkExist, trigger: 'blur' }
        ],
        type: [{ required: true, trigger: 'change' }],
        cmd: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.listTypes()
    console.log(this.type)
    if (this.isUpdate()) {
      this.id = this.$route.params.id
      this.get()
    }
  },
  methods: {
    /**
     * 接口
     */
    async submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.runLoading = true
          if (this.isUpdate()) {
            this.cmd.id = this.id
            CmdApi.update(this.cmd).then(() => {
              this.runLoading = false
              this.$message.success(this.$t('message.success'))
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.push({ name: 'cmd' })
            })
          } else if (this.isCreate()) {
            CmdApi.save(this.cmd).then(() => {
              this.runLoading = false
              this.$message.success(this.$t('message.success'))
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.push({ name: 'cmd' })
            })
          }
        }
      })
    },
    async cmdTypeChange(arg, index) {
      const cmd = await CmdApi.listByType(arg[0])
      this.cmds.splice(index, 0, cmd)
    },
    async listTypes() {
      this.types = await CmdApi.listTypes()
    },
    async get() {
      this.cmd = await CmdApi.get(this.id)
    },
    /**
     * 页面动作
     */
    removeRow(index) {
      this.cmd.expects.splice(index, 1)
    },
    addRow() {
      this.cmd.expects.push({})
    },
    cancel() {
      this.$router.back()
    },
    isCreate() {
      return this.type === 'create'
    },
    isUpdate() {
      return this.type === 'update'
    }

  }
}

</script>
