<template>
  <div class="app-container">

    <el-tabs v-model="activeTabName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="产品" name="product">
        <el-steps :active="activeStep" finish-status="success">
          <el-step :title="$t('tagsView.step',[1])" />
          <el-step :title="$t('tagsView.step',[2])" />
          <el-step :title="$t('tagsView.step',[3])" />
        </el-steps>
        <el-form label-width="120px" size="mini" :model="product" class="demo-form-inline">
          <el-row v-show="activeStep===0">
            <el-col :span="10">
              <el-form-item :label="$t('product.productName')+':'">
                <el-input v-model="product.name" />
              </el-form-item>
              <el-form-item :label="$t('product.productCode')+':'">
                <el-input v-model="product.code" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="activeStep===1">
            <el-col :span="10">
              <el-form-item :label="$t('product.productName')+'1:'">
                <el-input v-model="product.name" />
              </el-form-item>
              <el-form-item :label="$t('product.productCode')+'1:'">
                <el-input v-model="product.code" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="activeStep===2">
            <el-col :span="10">
              <el-form-item :label="$t('product.productName')+':'">
                <el-input v-model="product.name" />
              </el-form-item>
              <el-form-item :label="$t('product.productCode')+':'">
                <el-input v-model="product.code" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-for="(item, index) in newTabs" :key="index" :label="item.label" :name="item.name">{{ item }}</el-tab-pane>
      <el-tab-pane name="add">
        <span slot="label"><i class="el-icon-circle-plus-outline" /></span>
      </el-tab-pane>
    </el-tabs>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="120px" size="mini" class="demo-form-inline">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('product.tabName')+':'">
              <el-input v-model="newTabName" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirmAddTab">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import ProductApi from '@/api/ProductApi' // secondary package based on el-pagination

export default {
  name: 'Product',
  components: {},
  directives: {},
  data() {
    return {
      activeStep: 0,
      product: {
        name: '',
        code: ''
      },
      newTabs: [],
      activeTabName: 'product', // 当前tab的名字
      dialogVisible: false,
      newTabName: '',
      tabsLength: 1
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
      this.tabsLength++
      const tabName = 'name' + this.tabsLength
      this.newTabs.push({ label: this.newTabName, table: {}, name: tabName })
      this.activeTabName = tabName
    },
    handleClick(tab, event) {
      if (tab.name === 'add') {
        this.showDialog(tab, event)
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
