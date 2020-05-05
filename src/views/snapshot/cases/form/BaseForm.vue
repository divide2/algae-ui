<template>
  <el-card>
    <el-form ref="dataForm" :rules="rules" :model="cases" label-width="150px">
      <el-divider content-position="left">{{ $t('message.basicInformation') }}</el-divider>
      <el-card>
        <el-form-item :label="$t('snapshot.case.name')" prop="name">
          <el-input v-model="cases.name" />
        </el-form-item>
        <!--      <el-form-item :label="$t('snapshot.case.duration')">-->
        <!--        <el-input-number v-model="cases.duration" />-->
        <!--      </el-form-item>-->
        <el-form-item :label="$t('snapshot.case.debugMode')">
          <el-switch v-model="cases.debugMode" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <el-form-item :label="$t('snapshot.case.vehicleTypes')" prop="vehicleTypes">
          <el-select v-model="cases.vehicleTypes" multiple>
            <el-option value="V2.5" label="V2.5" />
            <el-option value="V3.0" label="V3.0" />
          </el-select>
        </el-form-item>
        <!--        <el-form-item :label="$t('snapshot.case.acquisitionId')" prop="acquisitionId">-->
        <!--          <el-select v-model="cases.acquisitionId">-->
        <!--            <el-option v-for="a in acquisitions" :key="a.id" :value="a.id" :label="a.name" />-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item :label="$t('snapshot.case.description')">
          <el-input v-model="cases.description" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-card>
      <el-divider content-position="left">{{ $t('message.commandInformation') }}</el-divider>
      <el-row v-for="(caseCmd,index) in cases.caseCmds" :key="index">
        <el-card>
          <el-col v-bind="layout6">
            <el-form-item :label="'#'+(index+1)+' '+$t('snapshot.case.executionTime')" label-width="150px">
              <el-input-number v-model="caseCmd.executionTime" size="small" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout4">
            <el-form-item :label="$t('snapshot.case.cmdType')" label-width="40px">
              <el-select v-model="caseCmd.cmdBaseType" filterable @change="cmdTypeChange(arguments,index)">
                <el-option v-for="t in types" :key="t" :value="t" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="layout8">
            <el-form-item :label="$t('snapshot.case.cmdBase')" label-width="80px">
              <el-select v-model="caseCmd.cmdBaseName" filterable style="width: 380px">
                <el-option v-for="cmd in cmds[index]" :key="cmd.id" :value="cmd.id" :label="cmd.name" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="layout4">
            <el-form-item :label="$t('snapshot.case.cmdAutoStop')">
              <el-switch v-model="caseCmd.cmdAutoStop" active-color="#13ce66" inactive-color="#ff4949" />
            </el-form-item>
          </el-col>
          <el-col v-if="!isView()" v-bind="layout2">
            <el-form-item label="" label-width="50px">
              <el-button type="danger" circle icon="el-icon-delete" @click="removeRow(index)" />
            </el-form-item>
          </el-col>
        </el-card>
      </el-row>
      <el-row>
        <el-button v-if="!isView()" type="info" plain style="width: 100%" @click="addRow()">{{ $t('button.addRow') }}</el-button>
      </el-row>

    </el-form>
    <el-row v-if="!isView()" type="flex" justify="center" style="margin-top: 20px">
      <el-button type="warning" @click="cancel">
        {{ $t('button.cancel') }}
      </el-button>
      <el-button type="success" @click="submit" :loading="runLoading">
        {{ $t('button.submit') }}
      </el-button>
    </el-row>

  </el-card>
</template>

<script>
import CaseApi from '@/api/CaseApi'
import CmdApi from '@/api/CmdApi'
import DataAcquisitionApi from '@/api/DataAcquisitionApi'

export default {
  name: 'BaseForm',
  props: {
    type: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      id: '',
      layout8: {
        xl: 8,
        lg: 8,
        md: 12,
        xs: 24
      },
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
      layout2: {
        xl: 2,
        lg: 2,
        md: 12,
        xs: 24
      },
      cases: {
        debugMode: true,
        caseCmds: [{
          executionTime: 0,
          cmdBaseType: '',
          cmdBaseId: '',
          cmdBaseName: '',
          cmdAutoStop: false
        }]
      },
      cmds: [
        []
      ],
      acquisitions: [],
      types: [],
      curUpdateInstanceId: '',
      rules: {
        name: [
          { required: true },
          { validator: this.checkExist, trigger: 'blur' }
        ],
        vehicleTypes: [{ required: true, trigger: 'change' }],
        acquisitionId: [{ required: true }]
      },
      runLoading: false
    }
  },
  computed: {},
  async created() {
    this.listAcquisition()
    this.listTypes()
    console.log(this.isView())
    if (this.isEdit() || this.isView()) {
      this.id = this.$route.params.id
      await this.get()
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
          if (this.isEdit()) {
            CaseApi.update(this.cases).then(()=>{
              this.runLoading = false
              this.$message.success(this.$t('message.success'))
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.push({ name: 'cases' })
            })
          } else if (this.isCreate()) {
            CaseApi.save(this.cases).then(()=>{
              this.runLoading = false
              this.$message.success(this.$t('message.success'))
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.push({ name: 'cases' })
            })
          }
        }
      })

    },
    async checkExist(rule, value, callback) {
      try {
        if (this.curUpdateInstanceId !== value) { await CaseApi.checkExist(value) }
        callback()
      } catch (e) {
        callback(new Error(this.$t('message.alreadyExist')))
      }
    },
    async listAcquisition() {
      this.acquisitions = await DataAcquisitionApi.list()
    },
    async cmdTypeChange(arg, index) {
      const cmd = await CmdApi.listByType(arg[0])
      this.$set(this.cmds, index, cmd)
      this.cases.caseCmds[index].cmdBaseId = null
      this.cases.caseCmds[index].cmdBaseName = null
      // this.cmds.splice(index, 0, cmd)
    },
    async listTypes() {
      this.types = await CmdApi.listTypes()
    },
    async get() {
      // const cmd = await CmdApi.list()
      this.cases = await CaseApi.get(this.id)
      this.curUpdateInstanceId = this.cases.name
      // for (let i = 0; i < this.cases.caseCmds.length; i++) {
      //   // const cmd = await CmdApi.listByType(this.cases.caseCmds[i].cmdBaseType)
      //   this.$set(this.cmds, i, cmd)
      // }
    },
    /**
     * 页面动作
     */
    removeRow(index) {
      // this.$delete(this.cases.caseCmds, index)
      this.cases.caseCmds.splice(index, 1)
      this.cmds.splice(index, 1)
    },
    addRow() {
      this.cases.caseCmds.executionTime = this.cases.caseCmds[this.cases.caseCmds.length - 1].executionTime + 20
      this.cases.caseCmds.push({
        executionTime: this.cases.caseCmds.executionTime,
        cmdBaseType: '',
        cmdBaseId: '',
        cmdBaseName: '',
        cmdAutoStop: false
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
    },
    isView() {
      return this.type === 'view'
    }
  }
}

</script>
