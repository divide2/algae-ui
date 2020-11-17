<template>
  <div class="app-container">
    <el-tabs v-model="activeTabName" type="card" closable :addabe="isHasProduct" @edit="handleTabEdit">
      <el-tab-pane label="产品" name="product" :closable="false">
        <el-steps :active="activeStep" finish-status="success">
          <el-step :title="$t('tagsView.step',[1])" />
          <el-step :title="$t('tagsView.step',[2])" />
          <el-step :title="$t('tagsView.step',[3])" />
        </el-steps>
        <el-form ref="productForm" label-width="120px" size="mini" :model="product" :rules="rules">
          <el-row v-show="activeStep===0">
            <el-col :span="10">
              <el-form-item :label="$t('product.name')+':'" prop="name">
                <!--                <el-input v-model="product.name" />-->
                <ii-cascader v-model="product.name" :options="langs" :props="prop" clearable filterable />
              </el-form-item>
              <el-form-item :label="$t('product.code')+':'" prop="code">
                <el-input v-model="product.code" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="activeStep===1" />
          <el-row v-show="activeStep===2" />
        </el-form>
        <el-button style="margin-top: 12px;" @click="next">{{ $t('button.next') }}</el-button>
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
import IiCascader from '@/components/ii/cascader/cascader'
import LangApi from '@/api/LangApi'
import ProductApi from '@/api/ProductApi'

export default {
  name: 'ProductDetail',
  components: { IiCascader },
  directives: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
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
      prop: {
        value: 'id'
      },
      rules: {
        name: [{
          required: true,
          message: this.$t('fields.product.name') + this.$t('validation.required'),
          trigger: 'change'
        }],
        code: [{
          required: true,
          message: this.$t('fields.product.code') + this.$t('validation.required'),
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    isHasProduct() {
      return !!this.product.id
    }
  },
  async mounted() {
    this.langs = await LangApi.tree()
  },
  methods: {
    next() {
      this.$refs['productForm'].validate((valid) => {
        if (valid) {
          const product = Object.assign({}, this.product, { name: this.product.name.reduce((a, b) => a + '.' + b) })
          ProductApi.add(product).then((data) => {
            console.log(data)
          }).catch((error) => {
            console.log(error)
          })
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

<style scoped>

</style>
