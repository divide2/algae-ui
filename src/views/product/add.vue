<template>
  <div class="app-container">
    <el-tabs v-model="activeTabName" type="card" editable @edit="handleTabEdit">
      <el-tab-pane label="产品" name="product" :closable="false">
        <el-steps :active="activeStep" finish-status="success">
          <el-step :title="$t('tagsView.step',[1])" />
          <el-step :title="$t('tagsView.step',[2])" />
          <el-step :title="$t('tagsView.step',[3])" />
        </el-steps>
        <el-form label-width="120px" size="mini" :model="product">
          <el-row v-show="activeStep===0">
            <el-col :span="10">
              <el-form-item :label="$t('product.productName')+':'">
                <!--                <el-input v-model="product.name" />-->
                <ii-cascader v-model="product.name" :options="options" clearable filterable />
              </el-form-item>
              <el-form-item :label="$t('product.productCode')+':'">
                <el-input v-model="product.code" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="activeStep===1" />
          <el-row v-show="activeStep===2" />
        </el-form>
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane v-for="(item) in tables" :key="item.name" :label="item.name" :name="item.name">
        {{ item }}
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible" width="300px">
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

import IiCascader from '@/components/ii/cascader'

export default {
  name: 'Product',
  components: { IiCascader },
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
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [
          {
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          },
          {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
      }],
      tableName: '',
      tables: [
        { name: 'T_CASH_VALUE', label: 'T_CASH_VALUE' },
        { name: 'T_GCV_VALUE', label: 'T_CASH_VALUE' }
      ],
      dialogVisible: false
    }
  },
  computed: {},
  created() {
  },
  methods: {
    next() {
      if (this.activeStep++ > 2) {
        this.activeStep = 0
      }
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
