<template>
  <el-card>
    <div class="filter-container">
      <el-select v-model="params.component" class="filter-item" @change="listByProduct">
        <el-option value="illustration" label="illustration" />
        <el-option value="premiums" label="premiums" />
        <el-option value="sumAssured" label="sumAssured" />
        <el-option value="illustration_result" label="illustration_result" />
        <el-option value="premiums_result" label="premiums_result" />
        <el-option value="sumAssured_result" label="sumAssured_result" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-create" @click="toRelate">
        {{ $t('button.relateValidate') }}
      </el-button>
    </div>
    <el-divider />
    <el-table :data="validates" border>
      <el-table-column label="#" type="index" />
      <el-table-column :label="$t('validate.field')" prop="validate.field" />
      <el-table-column :label="$t('validate.version')" prop="validate.version" />
      <el-table-column :label="$t('validate.component')" prop="component" />
      <el-table-column :label="$t('validate.valid')" prop="validate.valid" />
    </el-table>
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="150px" size="mini" :model="validate" class="demo-form-inline">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('validate.field')+':'">
              <el-select v-model="validate.ids" filterable multiple>
                <el-option v-for="item in allValidates" :key="item.id" :value="item.id" :label="item.field +'-' + item.version">
                  <span style="float: left">{{ item.field }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.version }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('validate.component')+':'">
              <el-select v-model="validate.component" class="filter-item">
                <el-option value="illustration" label="illustration" />
                <el-option value="premiums" label="premiums" />
                <el-option value="sumAssured" label="sumAssured" />
                <el-option value="illustration_result" label="illustration_result" />
                <el-option value="premiums_result" label="premiums_result" />
                <el-option value="sumAssured_result" label="sumAssured_result" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import ValidateApi from '@/api/ValidateApi'

export default {
  name: 'Rule',

  data() {
    return {
      params: {
        component: 'illustration'
      },
      id: '',
      validate: {
        ids: []
      },
      validates: [],
      allValidates: [],
      dialogVisible: false
    }
  },
  created() {
    this.id = this.$route.params.id
    this.listByProduct()
    this.listValidates()
  },
  methods: {
    listByProduct() {
      ValidateApi.listByProduct(this.id, this.params.component).then(data => {
        this.validates = data.data
      })
    },
    listValidates() {
      ValidateApi.list().then(data => {
        this.allValidates = data.data
      })
    },
    toUpdate(row) {
    },
    toRelate() {
      this.dialogVisible = true
      this.validate.component = this.params.component
    },
    async confirm() {
      for (const validateId of this.validate.ids) {
        await ValidateApi.relate(this.id, validateId, this.params.component)
      }
      this.dialogVisible = false
      this.listByProduct()
      this.$message.success(this.$t('message.success'))
    }
  }
}
</script>

<style>
.CodeMirror {
  border: 1px solid #eee;
  height: 90%;
}

</style>
