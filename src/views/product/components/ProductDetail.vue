<template>
  <div class="app-container">
    <el-tabs
      v-model="activeTab.name"
      type="card"
      :addable="isHasProduct"
      @edit="handleTabEdit"
      @tab-click="getTableData"
    >
      <el-tab-pane label="产品" name="product" :closable="false">
        <el-steps :active="activeStep" finish-status="success">
          <el-step :title="$t('product.baseInformation')" />
          <el-step :title="$t('product.rule')" />
          <el-step :title="$t('product.benefitDemonstration')" />
        </el-steps>

        <el-form
          v-show="activeStep===0"
          ref="productForm"
          label-width="120px"
          size="mini"
          :model="product"
          :rules="rules"
        >
          <el-row>
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
        </el-form>
        <el-row v-show="activeStep===1">
          <el-button size="mini" @click="dialogVisible = false">{{ $t('button.add') }}</el-button>
          <el-row type="flex">
            <el-col>
              <ii-cascader v-model="product.name" :options="langs" :props="prop" clearable filterable />
            </el-col>
            <el-col>
              <el-row>
                <!--                  <el-select v-model="value" placeholder="请选择">-->
                <!--                    <el-option-->
                <!--                      v-for="item in ruleOptions"-->
                <!--                      :key="item.value"-->
                <!--                      :label="item.label"-->
                <!--                      :value="item.value">-->
                <!--                    </el-option>-->
                <!--                  </el-select>-->
                <el-input />
              </el-row>
            </el-col>
          </el-row>
        </el-row>
        <el-row v-show="activeStep===2" />
        <el-button style="margin-top: 12px;" @click="back">{{ $t('button.back') }}</el-button>
        <el-button style="margin-top: 12px;" @click="next">{{ $t('button.next') }}</el-button>
      </el-tab-pane>
      <el-tab-pane v-for="(item) in tables" :key="item.name" :label="item.name" :name="item.name" :closable="true">
        <div class="filter-container">
          <el-input
            placeholder=""
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="search"
          />
          <el-button v-waves class="filter-item" type="primary" @click="search">{{ $t('button.search') }}</el-button>
          <el-button v-waves class="filter-item" type="primary" @click="dialogTableSelectVisible=true">
            {{ $t('button.create') }}
          </el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="tableData.data"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="#" type="index" />
          <el-table-column
            v-for="(item,index) in tableData.headers"
            :key="index"
            :prop="item.name"
            :label="item.name"
          />
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.size"
          @pagination="getTableData"
        />
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

    <el-dialog title="选择表格" :visible.sync="dialogTableSelectVisible">
      <el-upload
        class="upload-demo"
        action="/api/v1/file/upload"
        accept=".xlsx"
        :on-success="getTableDetail"
        :multiple="false"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :show-file-list="false"
      >
        <el-button size="small" type="primary">点击上传表格</el-button>
        <!--        <div slot="tip" class="el-upload__tip">只能上传1个xlsx文件，且不超过100M</div>-->
      </el-upload>
      <el-form v-show="sheets.length>0">
        <el-form-item label="表格选择">
          <el-radio-group v-model="sheet">
            <el-radio v-for="(item,index) in sheets" :key="index" :label="item" />
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableSelectVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSheet">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import IiCascader from '@/components/ii/cascader/cascader'
import ProductApi from '@/api/ProductApi'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
  name: 'ProductDetail',
  components: { IiCascader, Pagination },
  directives: { waves },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeStep: 1,
      activeTab: {
        name: 'product',
        id: ''
      }, // 当前tab的名字
      product: {
        id: null,
        name: [],
        code: null
      },
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
      },
      fileList: [], // 导入的文件
      ruleOptions: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      dialogTableSelectVisible: false,
      sheets: [],
      sheet: '',
      fileId: '',
      tableData: {
        headers: [],
        data: []
      },
      query: {
        page: 1,
        size: 10
      },
      loading: true,
      total: 0
    }
  },
  computed: {
    isHasProduct() {
      return !!this.product.id
    },
    langs() {
      return this.$store.getters.langsTree
    }
  },
  async mounted() {
    await this.$store.dispatch('product/getLangsTree')
  },
  created() {
    if (this.isEdit) {
      ProductApi.get(this.$route.params.id).then((data) => {
        this.product = Object.assign({}, data, { name: data.name.split('.') })
        ProductApi.getTable(this.product.id).then((data) => {
          this.tables = data.content
        })
      })
    }
  },
  methods: {
    next() {
      this.$refs['productForm'].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            const product = Object.assign({}, this.product, { name: this.product.name.reduce((a, b) => a + '.' + b) })
            ProductApi.update(product).then((data) => {
              this.product = Object.assign({}, data, { name: data.name.split('.') })
              this.activeStep++
            }).catch((error) => {
              console.log(error)
            })
          } else {
            const product = Object.assign({}, this.product, { name: this.product.name.reduce((a, b) => a + '.' + b) })
            ProductApi.add(product).then((data) => {
              this.product = Object.assign({}, data, { name: data.name.split('.') })
              this.activeStep++
            }).catch((error) => {
              console.log(error)
            })
          }
        } else {
          return false
        }
      })
    },
    back() {
      if (this.activeStep !== 0) {
        this.activeStep--
      }
    },
    addTable() {
      // this.tables.push({name: this.tableName})
      ProductApi.addTable({ productId: this.product.id, name: this.tableName }).then((data) => {
        this.activeTab = {
          name: data.name,
          id: data.id
        }
        ProductApi.getTable(this.product.id).then((data) => {
          this.tables = data.content
        })
      })
    },
    handleTabEdit(tableName, action) {
      if (action === 'add') {
        this.showDialog()
      } else if (action === 'remove') {
        console.log(action, '33333333333')

        this.$confirm(this.$t('message.confirmRemove')).then(() => {
          const index = this.tables.findIndex((table) => {
            return table.name === tableName
          })
          const table = this.tables.find((table) => table.name === tableName)
          ProductApi.delTable(this.product.id, table.id).then(() => {
            ProductApi.getTable(this.product.id).then((data) => {
              this.tables = data.content
              // 刪除完后默認打開的tab
              if (this.tables.length > 0) {
                if (index === this.tables.length) {
                  this.activeTab = this.tables[this.tables.length - 1] ? this.tables[this.tables.length - 1] : {
                    name: 'product',
                    id: ''
                  }
                } else {
                  this.activeTab = this.tables[index] ? this.tables[index] : { name: 'product', id: '' }
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
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    getTableDetail(file) {
      // console.log(arguments);
      this.fileId = file.id
      ProductApi.getTableDetail(this.product.id, this.activeTab.id, file.id).then((data) => {
        this.sheets = data.sheets
        this.dialogTableSelectVisible = true
      })
    },
    addSheet() {
      ProductApi.postTableFileSheet(this.product.id, this.activeTab.id, this.fileId, this.sheet).then((data) => {
        this.getTableData()
        this.dialogTableSelectVisible = false
      })
    },
    getTableData(tab) { // 拿到单张表格的数据
      if (!tab || tab.index !== '0') {
        this.loading = true
        this.activeTab = this.tables.find((table) => table.name === tab.name)
        ProductApi.getTablesHeader(this.product.id, this.activeTab.id).then((data) => {
          this.tableData.headers = data
          ProductApi.getTableData(this.product.id, this.activeTab.id, this.query).then((data) => {
            this.tableData.data = data.content
            this.loading = false
            this.total = data.totalElements
          })
        })
      } else {
        this.activeTab = { name: 'product', id: '' }
      }
    },
    search() { // 表格搜索

    }
  }
}
</script>

<style scoped>

</style>
