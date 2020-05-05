<template>
  <el-card>
    <el-form ref="dataForm" :rules="rules" :model="version" label-width="180px" class="demo-form-inline">
      <el-divider content-position="left">{{ $t('message.masterInformation') }}</el-divider>
      <el-card>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.version.vehicleType')" prop="vehicleType">
              <el-select v-model="version.vehicleType">
                <el-option value="V2.5" label="V2.5" />
                <el-option value="V3.0" label="V3.0" />
                <el-option value="V3.0GE" label="V3.0GE" />
                <el-option value="V3.1" label="V3.1" />
                <el-option value="X1.3" label="X1.3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.version.appVersion')" prop="appVersion">
              <el-input v-model="version.appVersion" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.version.libVersion')" prop="libVersion">
              <el-input v-model="version.libVersion" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.version.bleVersion')" prop="bleVersion">
              <el-input v-model="version.bleVersion" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout8">
            <el-form-item :label="$t('basic.version.apVersion')" prop="apVersion">
              <el-input v-model="version.apVersion" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row v-for="(ecu,index) in version.ecus" :key="index">
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.version.ecuVersion')">
              <el-input v-model="ecu.ecuVersion" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.version.ecuFactory')">
              <el-input v-model="ecu.ecuFactory" />
            </el-form-item>
          </el-col>
          <el-col v-bind="layout4">
            <el-form-item label="">
              <el-button type="danger" circle icon="el-icon-delete" @click="removeEcuRow(index)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button type="info" plain style="width: 100%" @click="addEcuRow">{{ $t('button.addRow') }}</el-button>
        </el-row>
      </el-card>

      <el-divider content-position="left">{{ $t('message.branchInformation') }}</el-divider>
      <el-row v-for="(branch,index) in version.branchs" :key="index">
        <el-card>
          <el-col v-bind="layout6">
            <el-form-item :label="$t('basic.version.branchAppVersion')">
              <!--              <el-select v-model="branch.branchAppVersion" filterable default-first-option placeholder="请选择APP分支版本">-->
              <!--                <el-option v-for="item in appVersions" :key="item" :value="item" :label="item" />-->
              <!--              </el-select>-->
              <el-input v-model="branch.branchAppVersion" />
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
      <el-button type="success" @click="submit" :loading="runLoading">
        {{ $t('button.submit') }}
      </el-button>
    </el-row>

  </el-card>
</template>

<script>
import VersionApi from '@/api/VersionApi'

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
      layout8: {
        xl: 8,
        lg: 8,
        md: 12,
        xs: 24
      },
      version: {
        ecus: [{
          ecuVersion: '',
          ecuFactory: ''
        }],
        branchs: [{
          branchAppVersion: ''
        }]
      },
      appVersions: [],
      rules: {
        appVersion: [
          { required: true },
          { validator: this.checkExist, trigger: 'blur' }
        ],
        vehicleType: [{ required: true, trigger: 'change' }]
      },
      curUpdateAppVersion: '',
      runLoading: false
    }
  },
  created() {
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.runLoading = true
          if (this.isEdit()) {
            this.version.id = this.id
            VersionApi.update(this.version).then(()=>{
              this.runLoading = false
              this.$message.success(this.$t('message.success'))
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.push({ name: 'version' })
            })
          } else if (this.isCreate()) {
            VersionApi.save(this.version).then(()=>{
              this.runLoading = false
              this.$message.success(this.$t('message.success'))
              this.$store.dispatch('tagsView/delView', this.$route)
              this.$router.push({ name: 'version' })
            })
          }
        }
      })
    },
    async getFwVersions() {
      this.appVersions = await VersionApi.getFwVersions()
    },
    async get() {
      this.version = await VersionApi.get(this.id)
      this.curUpdateAppVersion = this.version.appVersion
    },
    async checkExist(rule, value, callback) {
      try {
        if (this.curUpdateAppVersion !== value) { await VersionApi.checkExist(value) }
        callback()
      } catch (e) {
        callback(new Error(this.$t('message.alreadyExist')))
      }
    },
    removeEcuRow(index) {
      this.version.ecus.splice(index, 1)
    },
    addEcuRow() {
      this.version.ecus.push({})
    },
    removeRow(index) {
      this.version.branchs.splice(index, 1)
    },
    addRow() {
      this.version.branchs.push({})
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
