<template>
  <el-card>
    <el-button-group>
      <el-button type="success" plain icon="el-icon-caret-right" @click="run" />
      <el-button type="primary" plain icon="el-icon-s-claim" @click="run" />
    </el-button-group>
    <el-row>
      <el-col :span="12">
        <codemirror v-model="rule.ruleDetail" :options="cmOptions" />
      </el-col>
      <el-col :span="12">
        <codemirror v-model="ruleResult" :options="cmOptions" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import RuleApi from '@/api/RuleApi'
// require component
import { codemirror } from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
// theme css
import 'codemirror/theme/base16-dark.css'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
export default {
  name: 'Rule',
  components: {
    codemirror
  },
  data() {
    return {
      rule: {
        ruleDetail: ''
      },
      ruleResult: '',
      cmOptions: {
        // codemirror options
        tabSize: 2,
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
  created() {
    this.id = this.$route.params.id
    this.get()
  },
  methods: {
    get() {
      RuleApi.get(this.id).then(data => {
        this.rule = data.data
      })
    },
    run() {
      // eslint-disable-next-line no-eval
      const ruleResult = eval(this.rule.ruleDetail)
      this.ruleResult = JSON.stringify(ruleResult, null, 2)
    }
  }
}
</script>

<style>
.CodeMirror {
  border: 1px solid #eee;
  height: 90%;
}

</style>
