<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="query.code"
        :placeholder="$t('lang.code')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="search"
      />
      <el-button v-waves class="filter-item" type="primary" @click="search">{{ $t('button.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="toAdd">{{ $t('button.create') }}</el-button>
      <el-button v-waves class="filter-item" type="success" @click="toAddLangDefine">{{ $t('button.createLangDefine') }}</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="#" type="index" />
      <el-table-column :label="$t('lang.category')" prop="category" />
      <el-table-column :label="$t('lang.code')" prop="code" />
      <el-table-column v-for="ld in langDefines" :key="ld.id" :label="ld.name" :prop="ld.col" />
      <el-table-column :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="toUpdate(row)">
            {{ $t('button.edit') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.size" @pagination="page" />
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="120px" size="mini" :model="lang" inline>
        <el-form-item :label="$t('lang.category')+':'">
          <el-input v-model="lang.category" />
        </el-form-item>
        <el-form-item :label="$t('lang.code')+':'">
          <el-input v-model="lang.code" />
        </el-form-item>
        <el-form-item v-for="ld in langDefines" :key="ld.id" :label="ld.name+':'">
          <el-input v-model="lang[ld.col]" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirmAdd">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="langDefineVisible" width="300px">
      <el-form size="mini">
        <el-form-item :label="$t('langDefine.name')+':'">
          <el-input v-model="langDefine.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="langDefineVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" size="mini" @click="confirmAdd">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import LangApi from '@/api/LangApi'
import LangDefineApi from '@/api/LangDefineApi' // secondary package based on el-pagination

export default {
  name: 'Lang',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      loading: true,
      dialogVisible: false,
      langDefineVisible: false,
      lang: {
        code: ''
      },
      langDefines: [],
      langDefine: {},
      query: {
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.page()
    this.findLangDefine()
  },
  methods: {
    async page() {
      this.loading = true
      const data = await LangApi.find(this.query)
      this.list = data.content
      this.total = data.totalElements
      this.loading = false
    },
    async findLangDefine() {
      const data = await LangDefineApi.find(this.query)
      this.langDefines = data.content
    },
    toAdd() {
      this.dialogVisible = true
    },
    toUpdate(row) {
      this.dialogVisible = true
      this.lang = Object.assign({}, row)
    },
    toAddLangDefine() {
      this.langDefineVisible = true
    },
    async confirmAdd() {
      console.log(this.lang)
      // await LangApi.add(this.lang)
      // await this.page()
      // this.$message.success('message.success')
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await this.page()
      this.$message.success(this.$t('message.deleteSuccess'))
    },
    search() {
      this.query.page = 1
      this.page()
    }
  }
}
</script>
