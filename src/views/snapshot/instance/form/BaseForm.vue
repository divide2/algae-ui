<template>
  <el-card>
    <el-form ref="dataForm" :rules="rules" :model="instance" label-width="150px" class="demo-form-inline">
      <el-divider content-position="left">{{ $t('message.basicInformation') }}</el-divider>
      <el-card>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('snapshot.instance.instanceId')" prop="instanceId">
              <el-input v-model="instance.instanceId" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('snapshot.instance.appVersionType')" prop="appVersionType">
              <el-select v-model="instance.appVersionType" @change="versionTypeChange(arguments)">
                <el-option value="Master" label="Master" />
                <el-option value="Branch" label="Branch" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('snapshot.instance.appVersion')" prop="appVersion">
              <el-select v-model="instance.appVersion">
                <el-option v-for="version in versions" :key="version" :value="version" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('snapshot.instance.testLink')" prop="testLink">
              <el-input v-model="instance.testLink" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('snapshot.instance.description')">
              <el-input v-model="instance.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-divider content-position="left">{{ $t('message.caseInformation') }}</el-divider>
      <draggable class="list" v-model="instance.instanceLines">
        <el-row v-for="(line,index) in instance.instanceLines" :key="index" >
          <el-card>
            <el-col v-bind="layout6">
              <el-form-item :label="'#'+(index+1)+' '+$t('snapshot.instance.executionTime')" label-width="150px">
                <el-input-number v-model="line.executionTime" size="small" />
              </el-form-item>
            </el-col>
            <el-col v-bind="layout8" label-width="50px">
              <el-form-item :label="$t('snapshot.case.name')">
                <el-select v-model="line.caseName" filterable default-first-option placeholder="Please select case" :filter-method="caseFilter" clearable style="width: 400px">
                  <el-option v-for="item in cases" :key="item.name" :value="item.name" :label="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-bind="layout4">
              <el-form-item label="">
                <el-button type="danger" circle icon="el-icon-delete" @click="removeRow(index)" />
              </el-form-item>
            </el-col>
          </el-card>
        </el-row>
      </draggable>
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
import CaseApi from '@/api/CaseApi'
import InstanceApi from '@/api/InstanceApi'
import VersionApi from '@/api/VersionApi'
import draggable from "vuedraggable";


export default {
  name: 'BaseForm',
  props: {
    type: {
      default: 'create',
      type: String
    }
  },
  components: {
    draggable,
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
      layout8: {
        xl: 8,
        lg: 8,
        md: 12,
        xs: 24
      },
      instance: {
        appVersion: '',
        instanceLines: [{
          executionTime: 0,
          caseName: ''
        }]
      },
      cases: [[]],
      allCases: [[]],
      versions: [],
      // fwVersions: [],
      curUpdateInstanceId: '',
      rules: {
        instanceId: [
          { required: true },
          { validator: this.checkExist, trigger: 'blur' }
        ],
        appVersionType: [{ required: true, trigger: 'change' }],
        appVersion: [{ required: true, trigger: 'blur' }]
      },
      runLoading: false,
      checkExistDTO: {
        id: '',
        name: ''
      }
    }
  },
  async created() {
    this.getCases()
    // this.listVersions()
    if (this.isEdit()) {
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
            InstanceApi.update(this.instance).then(() => {
              this.runLoading = false
              this.$message.success(this.$t('message.success'))
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.push({ name: 'instance' })
            })
          } else if (this.isCreate()) {
            InstanceApi.save(this.instance).then(() => {
              this.runLoading = false
              this.$message.success(this.$t('message.success'))
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.push({ name: 'instance' })
            })
          }
        }
      })
    },
    async checkExist(rule, value, callback) {
      try {
        if (this.curUpdateInstanceId !== value) { await InstanceApi.checkExist(value) }
        callback()
      } catch (e) {
        callback(new Error(this.$t('message.alreadyExist')))
      }
    },
    async get() {
      this.instance = await InstanceApi.get(this.id)
      this.curUpdateInstanceId = this.instance.instanceId
      //
    },
    // async caseChange(arg, index) {
    //   console.log('===arg == id ========')
    //   console.log(arg)
    //   this.instance.instanceLines[index].caseDescription = null
    // },
    async getCases() {
      this.allCases = await CaseApi.list()
      this.caseFilter()
    },
    async versionTypeChange(arg) {
      this.instance.appVersion = null
      this.versions = await VersionApi.listByType(arg[0])
      // this.instance.appVersion = null
      // this.cases.caseCmds[index].cmdBaseId = null
      // this.cases.caseCmds[index].cmdBaseName = null
      // this.cmds.splice(index, 0, cmd)
    },
    async listVersions() {
      this.versions = await VersionApi.listVersions()
    },
    /**
     * 页面动作
     */
    removeRow(index) {
      // this.$delete(this.cases.caseCmds, index)
      this.instance.instanceLines.splice(index, 1)
      // this.cases.splice(index, 1)
    },
    addRow() {
      this.instance.instanceLines.executionTime = 30
      this.instance.instanceLines.push({
        executionTime: this.instance.instanceLines.executionTime,
        caseName: ''
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
    caseFilter(query = '') {
      const arr = this.allCases.filter((item) => {
        // return item.id.includes(query) || item.name.includes(query)
        return item.name.includes(query)
      })
      if (arr.length > 20) {
        this.cases = arr.slice(0, 20)
      } else {
        this.cases = arr
      }
    }
  }
}

</script>
