<template>
  <div>
    <el-drawer
      :visible.sync="drawer"
      direction="rtl">
      <el-card>
        <el-form label-width="120px" size="mini" :model="formula" class="demo-form-inline">
          <el-form-item :label="$t('formula.formulaName')">
            <el-input v-model="formula.formulaName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('formula.masterName')">
            <el-input v-model="formula.masterName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('formula.formula')">
            <el-input v-model="formula.formula" type="textarea" autosize></el-input>
          </el-form-item>
          <el-form-item :label="$t('formula.masterDesc')">
            <el-input v-model="formula.masterDesc"></el-input>
          </el-form-item>
          <el-form-item :label="$t('formula.reference')">
            <el-select v-model="formula.references" multiple filterable>
              <el-option
                v-for="item in formulas"
                :key="item.formulaId"
                :label="item.masterName"
                :value="item.masterId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
    </el-drawer>
    <el-card>
      <el-button type="success" size="small">
        {{ $t('button.run') }}
        <i class="el-icon-caret-right  el-icon--right" />
      </el-button>
    </el-card>
    <div class="formula-outer">
      <div class="view-box">
        <org-view
          v-if="tree"
          :data="tree"
          :zoom-handled="zoomHandled"
          :validated-items="validatedFormulasIds"
          @on-menu-click="handleMenuClick"
        ></org-view>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <el-row>
        <el-col :span="10">
          <el-form>
            <el-form-item :label="$t('formula.masterName')">
              <el-select v-model="formula.masterId" filterable>
                <el-option v-for="item in masters" :key="item.id" :value="item.id" :label="item.formulaName" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirmRelevance">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OrgView from './components/OrgView.vue'
import './index.less'
import FormulaApi from '@/api/FormulaApi'
import FormulaGroupApi from '@/api/FormulaGroupApi'


export default {
  name: 'Formula',
  components: {
    OrgView
  },
  data() {
    return {
      groupId: '',
      zoom: 100,
      formulas: '',
      tree: {},
      drawer: false,
      dialogVisible: false,
      masters: [],
      formula: {
        formulaName: '',
        formulaId: '',
        masterId: '',
        masterName: '',
        masterDesc: '',
        references: []
      },
      validatedFormulasIds: []
    }
  },
  computed: {
    zoomHandled() {
      return this.zoom / 100
    }
  },
  mounted() {
    this.groupId = this.$route.params.groupId
    this.findGroupFormulasTree()
    this.findGroupFormulas()
    this.findGroupValidatedFormulas()
    console.log(OrgView)
  },
  methods: {
    handleMenuClick({ data, key }) {
      this[key](data)
    },
    async findGroupFormulasTree() {
      const { data } = await FormulaApi.findGroupFormulasTree(this.groupId)
      data.expand = true
      this.tree = data
    },
    async findGroupFormulas() {
      const { data } = await FormulaApi.findGroupFormulas(this.groupId)
      this.formulas = data
    },
    async findGroupValidatedFormulas() {
      const { data } = await FormulaApi.findGroupValidatedFormulas(this.groupId)
      this.validatedFormulasIds = data.map(it => it.masterId)
    },
    edit(data) {
      this.formula = data.payload
      this.formula.references = data.children.map(it => it.id)
    },
    async delete(data) {
      await this.$confirm(this.$t('message.confirmRemove'))
      const formulaId = data.payload.formulaId
      await FormulaGroupApi.removeChildFormula({ formulaId, formulaGroupId: this.groupId })
      await this.findGroupFormulasTree()
      this.$message.success('message.removeSuccess')
    },
    async relevance(data) {
      const resp = await FormulaApi.findAllMaster()
      this.dialogVisible = true
      this.masters = resp.data
    },
    confirmRelevance() {
    },
    toggle(data) {
      console.log(data)
    }
  }
}
</script>

<style>
</style>
