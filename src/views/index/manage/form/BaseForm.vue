<template>
  <el-card>
    <el-form ref="dataForm" :rules="rules" :model="indexMonitor" label-width="100px" class="demo-form-inline">
      <el-row>
        <el-col v-bind="layout6">
          <el-form-item :label="$t('indexMonitor.indexManage.indexName')" prop="title">
            <el-input v-if="!isView()" v-model="indexMonitor.name" maxlength="50" />
            <span v-if="isView()">{{ indexMonitor.name }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(monitorIndexRule,index) in indexMonitor.monitorIndexRules" :key="index">
        <el-col v-bind="layout30">
          <el-card>
            <el-row>
              <el-col v-bind="layout6">
                <el-form-item :label="$t('indexMonitor.indexManage.ruleName')">
                  <el-input v-if="!isView()" v-model="monitorIndexRule.name" maxlength="50" />
                  <span v-if="isView()">{{ monitorIndexRule.name }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col v-bind="layout6">
                <el-form-item :label="$t('indexMonitor.indexManage.header')">
                  <el-input v-if="!isView()" v-model="monitorIndexRule.header" maxlength="50" />
                  <span v-if="isView()">{{ monitorIndexRule.header }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col v-bind="layout6">
                <el-form-item :label="$t('indexMonitor.indexManage.matchRule')">
                  <el-input v-if="!isView()" v-model="monitorIndexRule.matchRule" maxlength="200" />
                  <span v-if="isView()">{{ monitorIndexRule.matchRule }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col v-bind="layout6">
                <el-form-item :label="$t('indexMonitor.indexManage.condition')">
                  <el-input v-if="!isView()" v-model="monitorIndexRule.matchCondition" maxlength="200" />
                  <span v-if="isView()">{{ monitorIndexRule.matchCondition }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item :label="$t('indexMonitor.indexManage.statisticalContent')">
                  <el-radio-group v-if="!isView()" v-model="monitorIndexRule.statisticalTerms">
                    <el-radio :label="1">{{ $t('indexMonitor.indexManage.exceptionNum') }}</el-radio>
                    <el-radio :label="2">{{ $t('indexMonitor.indexManage.countNum') }}</el-radio>
                    <el-radio :label="3">{{ $t('indexMonitor.indexManage.exceptionRate') }}</el-radio>
                  </el-radio-group>
                  <span v-if="isView() && monitorIndexRule.statisticalTerms == 1">{{ $t('indexMonitor.indexManage.exceptionNum') }}</span>
                  <span v-else-if="isView() && monitorIndexRule.statisticalTerms == 2">{{ $t('indexMonitor.indexManage.countNum') }}</span>
                  <span v-else-if="isView() && monitorIndexRule.statisticalTerms == 3">{{ $t('indexMonitor.indexManage.exceptionRate') }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
        <el-col v-if="!isView()" v-bind="layout3">
          <el-button type="danger" circle icon="el-icon-minus" style="margin-left: 20px;" @click="removeRow(index)" />
          <el-button type="primary" circle icon="el-icon-plus" @click="addRow" />
        </el-col>
      </el-row>
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
      layout3: {
        xl: 4,
        lg: 4,
        md: 12,
        xs: 12
      },
      layout6: {
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
      indexMonitor: {
        name: '',
        monitorIndexRules: [{
          fid: '',
          name: '',
          header: '',
          matchRule: '',
          matchCondition: '',
          statisticalTerms: ''
        }]
      },
      types: [],
      rules: {}
    }
  },
  created() {
    if (this.isEdit() || this.isView()) {
      this.id = this.$route.params.id
      this.get()
    }
  },
  methods: {
    /**
       * 接口
       */
    async submit() {
      this.runLoading = true
      if (this.isEdit()) {
        this.indexMonitor.fid = this.id
        MonitorIndexApi.update(this.indexMonitor.fid, this.indexMonitor).then(() => {
          this.runLoading = false
          this.$message.success(this.$t('message.success'))
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.push({ name: 'indexManage' })
        })
      } else if (this.isCreate()) {
        MonitorIndexApi.save(this.indexMonitor).then(() => {
          this.runLoading = false
          this.$message.success(this.$t('message.success'))
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.push({ name: 'indexManage' })
        })
      }
    },
    async get() {
      // const cmd = await CmdApi.list()
      this.indexMonitor = await MonitorIndexApi.get(this.id)
      console.log(this.indexMonitor)
    },

    /**
       * 页面动作
       */
    removeRow(index) {
      if (this.indexMonitor.monitorIndexRules.length == 1) {
        return
      }
      this.indexMonitor.monitorIndexRules.splice(index, 1)
    },
    addRow() {
      this.indexMonitor.monitorIndexRules.push({})
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
