<template>
  <el-card>
    <codemirror :value="rule.ruleDetail" :options="cmOptions"></codemirror>
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
export default {
  name: 'Rule',
  components: {
    codemirror
  },
  data() {
    return {
      rule: {},
      cmOptions: {
        // codemirror options
        tabSize: 2,
        mode: 'text/javascript',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true
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
    }
  }
}
</script>

<style>
.CodeMirror {
  border: 1px solid #eee;
  height: auto;
}

</style>
