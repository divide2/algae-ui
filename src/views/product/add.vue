<template>
  <div class="app-container">
    <el-tabs v-model="activeTabName" type="card" closable addable @edit="handleTabEdit">
      <el-tab-pane label="产品" name="product" :closable="false">
        <el-steps :active="activeStep" finish-status="success">
          <el-step :title="$t('tagsView.step',[1])" />
          <el-step :title="$t('tagsView.step',[2])" />
          <el-step :title="$t('tagsView.step',[3])" />
        </el-steps>
        <ii-form ref="productForm" label-width="120px" size="mini" :rules="rules" :model="product">
          <el-row v-show="activeStep===0">
            <el-col :span="10">
              <ii-form-item :label="$t('product.name')+':'" prop="name">
                <!--                <el-input v-model="product.name" />-->
                <ii-cascader v-model="product.name" :options="langs" clearable filterable />
              </ii-form-item>
              <ii-form-item :label="$t('product.code')+':'" prop="code">
                <el-input v-model="product.code" />
              </ii-form-item>
            </el-col>
          </el-row>
          <el-row v-show="activeStep===1" />
          <el-row v-show="activeStep===2" />
        </ii-form>
        <el-button style="margin-top: 12px;" @click="next">{{ $t('button.next') }}</el-button>
        <el-button style="margin-top: 12px;" @click="reset">{{ $t('button.next') }}</el-button>
      </el-tab-pane>
      <el-tab-pane v-for="(item) in tables" :key="item.name" :label="item.name" :name="item.name">
        {{ item }}
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible" width="300px" :close-on-click-modal="false">
      <el-form size="mini">
        <el-form-item :label="$t('table.name')+':'">
          <el-input v-model="tableName" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" size="mini" @click="confirmAddTab">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import ProductApi from '@/api/ProductApi' // secondary package based on el-pagination

import IiCascader from '@/components/ii/cascader/cascader'
import LangApi from '@/api/LangApi'
import IiFormItem from '@/components/ii/formItem/form-item'
import IiForm from '@/components/ii/formItem/form'

export default {
  name: 'Product',
  components: { IiForm, IiFormItem, IiCascader },
  directives: {},
  data() {
    return {
      activeStep: 0,
      activeTabName: 'product', // 当前tab的名字
      product: {
        id: null,
        name: [],
        code: null
      },
      langs: [],
      tableName: '',
      tables: [],
      dialogVisible: false,
      rules: {
        name: [
          { required: true, trigger: 'change' }
        ],
        code: [
          { required: true, trigger: 'blur' },
          { min: 3, max: 5, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  async mounted() {
    const { content } = await LangApi.find()
    this.langs = content
  },
  methods: {
    reset() {
      this.$refs['productForm'].resetFields()
    },
    next() {
      this.$refs['productForm'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addTable() {
      this.tables.push({ name: this.tableName })
      this.activeTabName = this.tableName
    },
    handleTabEdit(tableName, action) {
      if (action === 'add') {
        this.showDialog()
      } else if (action === 'remove') {
        this.$confirm(this.$t('message.confirmRemove')).then(data => {
          const tables = this.tables
          let activeName = this.activeTabName
          if (activeName === tableName) {
            tables.forEach((table, index) => {
              if (table.name === tableName) {
                const nextTab = tables[index + 1] || tables[index - 1]
                if (nextTab) {
                  activeName = nextTab.name
                }
              }
            })
          }
          this.tables = tables.filter(tab => tab.name !== tableName)
          this.activeTabName = activeName
        })
      }
    },
    confirmAddTab() {
      this.addTable()
      this.closeDialog()
    },
    showDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    }
  }
}
</script>
