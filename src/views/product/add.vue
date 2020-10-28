<template>
  <div class="app-container">

    <el-tabs type="border-card">
      <el-tab-pane label="产品">
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
      <el-tab-pane label="Table1">Table1</el-tab-pane>
      <el-tab-pane label="Table2">table2</el-tab-pane>
    </el-tabs>
    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>

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
      }
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
    }
  }
}
</script>
