<template>
  <div class="app-container">
    <el-tabs v-model="activeTabName" type="card" :addable="isHasProduct" @edit="handleTabEdit">
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
        <el-button style="margin-top: 12px;" @click="back">{{ $t('button.back') }}</el-button>
        <el-button style="margin-top: 12px;" @click="next">{{ $t('button.next') }}</el-button>
      </el-tab-pane>
      <el-tab-pane v-for="(item) in tables" :key="item.name" :label="item.name" :name="item.name" :closable="true">
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
      console.log(!!this.product.id)
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
            this.product = Object.assign({}, data, { name: data.name.split('.') })
            this.activeStep++
          }).catch((error) => {
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    back() {
      if (this.activeStep != 0) {
        this.activeStep--
      }
    },
    addTable() {
      // this.tables.push({name: this.tableName})
      ProductApi.addTable({ productId: this.product.id, name: this.tableName }).then(() => {
        ProductApi.getTable(this.product.id).then((data) => {
          this.tables = data.content
          this.activeTabName = this.tableName
        })
      })
    },
    handleTabEdit(tableName, action) {
      if (action === 'add') {
        this.showDialog()
      } else if (action === 'remove') {
        this.$confirm(this.$t('message.confirmRemove')).then(() => {
          const index = this.tables.findIndex((table) => {
            return table.name === tableName
          })
          const table = this.tables.find((table) => table.name === tableName)
          ProductApi.delTable(this.product.id, table.id).then(() => {
            ProductApi.getTable(this.product.id).then((data) => {
              this.tables = data.content
              if (this.tables.length > 0) {
                if (index === this.tables.length) {
                  this.activeTabName = this.tables[this.tables.length - 1] ? this.tables[this.tables.length - 1].name : 'product'
                } else {
                  this.activeTabName = this.tables[index] ? this.tables[index].name : 'product'
                }
              }
            })
          })
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
