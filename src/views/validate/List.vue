<template>
  <el-card>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-create" @click="toAdd">
        {{ $t('button.create') }}
      </el-button>
    </div>
    <el-table
      :data="validates"
      row-key="id"
      border
    >
      <el-table-column label="#" type="index" />
      <el-table-column :label="$t('validate.field')" prop="field" />
      <el-table-column :label="$t('validate.version')" prop="version" />
      <el-table-column :label="$t('validate.valid')" prop="valid" />
      <el-table-column width="230" :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="warning" size="mini" @click="toUpdate(row)">
            {{ $t('button.edit') }}
          </el-button>
          <el-button v-if="row.children" type="primary" size="mini" @click="toAddVersion(row)">
            {{ $t('button.addVersion') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible">
      <el-form label-width="150px" size="mini" :model="validate" class="demo-form-inline">
        <el-row>
          <el-col :span="10">
            <el-form-item :label="$t('validate.field')+':'">
              <el-input v-model="validate.field" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('validate.version')+':'">
              <el-input v-model="validate.version" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item :label="$t('validate.valid')+':'">
            <codemirror v-model="validate.valid" :options="cmOptions" />
          </el-form-item>
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
import _ from 'lodash'
import ValidateApi from '@/api/ValidateApi'
// require component
import { codemirror } from 'vue-codemirror'
// require styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
// theme css
import 'codemirror/theme/base16-dark.css'

const toStrFun = function(obj, tab = '') {
  let start = '{'
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (_.isNumber(obj[key]) || _.isBoolean(obj[key])) {
        start += '\r\n\t' + tab + key + ': ' + obj[key] + ','
      } else if (_.isString(obj[key])) {
        start += '\r\n\t' + tab + key + ': \'' + obj[key] + '\','
      } else if (_.isArray(obj[key])) {
        start += '\r\n\t' + tab + key + ': ['
        obj[key].forEach((v, i) => {
          if (_.isString(v)) {
            start += '\'' + v + '\''
          } else if (_.isNumber(v)) {
            start += v
          }
          if (i !== obj[key].length - 1) {
            start += ', '
          }
        })
        start += ']'
      } else if (_.isFunction(obj[key])) {
        start += '\r\n\t' + tab + key + ': ' + obj[key] + ','
      } else if (_.isObject(obj[key])) {
        start += '\r\n\t' + tab + key + ': ' + toStrFun(obj[key], tab + '\t')
      }
    }
  }
  start += '\r\n' + tab + '}'
  return start
}
export default {
  name: 'ValidateList',
  components: {
    codemirror
  },
  data() {
    return {
      dialogVisible: false,
      dialogType: 'add',
      validates: [],
      validate: {
        field: '',
        version: '',
        valid: ''
      },
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    }
  },
  mounted() {
    this.findValidates()
  },
  methods: {
    async findValidates() {
      const { data } = await ValidateApi.list()
      const validates = []
      for (const validate of data) {
        if (!validates.some((it) => it.field === validate.field)) {
          validates.push({ ...validate, children: [] })
        } else {
          const valid = validates.find((it) => it.field === validate.field)
          valid.children.push(validate)
        }
      }
      this.validates = validates
    },
    toAddVersion(row) {
      this.dialogType = 'add'
      this.dialogVisible = true
      this.validate = { version: 'v' + (row.children.length + 2), valid: '' }
    },
    toUpdate(row) {
      this.dialogType = 'update'
      this.dialogVisible = true
      const valid = JSON.parse(row.valid, (k, v) => {
        if (v.indexOf && v.indexOf('function') > -1) {
          // eslint-disable-next-line no-eval
          return eval('(function(){return ' + v + ' })()')
        }
        return v
      })
      this.validate = Object.assign({}, row, { valid: toStrFun(valid) })
    },
    toAdd() {
      this.dialogVisible = true
      this.validate = {
        valid: ''
      }
    },
    async confirm() {
      const valid = Object.assign({}, this.validate, {
        // eslint-disable-next-line no-eval
        valid: JSON.stringify(eval('(' + this.validate.valid + ')'), (k, v) => {
          if (typeof v === 'function') {
            return v + ''
          }
          return v
        })
      })
      if (this.dialogType === 'update') {
        await ValidateApi.update(valid)
      } else {
        await ValidateApi.add(valid)
      }
      await this.findValidates()
      this.dialogVisible = false
      this.$message.success(this.$t('message.success'))
    }
  }
}
</script>

<style scoped>

</style>
