<template>
  <el-card>
    <el-form label-width="120px" size="mini" :model="compare" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('snapshot.compare.name')+':'">
            {{ compare.name }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('snapshot.compare.fwVersion')+':'">
            {{ compare.fwVersion }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('snapshot.compare.caseName')+':'">
            {{ compare.caseName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('snapshot.compare.instance')+':'">
            {{ compare.instanceName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('snapshot.compare.instanceExec')+':'">
            {{ compare.instanceExecName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('snapshot.compare.referInstance')+':'">
            {{ compare.referInstanceName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('snapshot.compare.referInstanceExec')+':'">
            {{ compare.referInstanceExecName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('snapshot.compare.acquisitionName')+':'">
            {{ compare.acquisitionName }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label="$t('snapshot.compare.createTime')+':'">
            {{ compare.createTime }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('snapshot.compare.description')+':'">
            {{ compare.description }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-divider />
    <el-table :data="results" border style="width: 100%">
      <el-table-column width="200" align="center" :label="$t('snapshot.compare.caseName')" prop="caseName" />
      <el-table-column width="200" align="center" :label="$t('snapshot.compare.caseStartTime')" prop="caseStartTime" />
      <el-table-column width="200" align="center" :label="$t('snapshot.compare.caseEndTime')" prop="caseEndTime" />
      <el-table-column v-for="col in columns" :key="col" width="200" align="center" :label="col">
        <template slot-scope="{row,column}">
          <el-progress v-if="row.lines[column.label]" :percentage="row.lines[column.label]" :color="customColors" />
          <div v-else>-</div>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
import SnapshotCompareApi from '@/api/SnapshotCompareApi'

export default {
  name: 'SnapshotCompareDetail',
  data() {
    return {
      id: '',
      compare: {},
      results: [],
      columns: [],
      customColors: [
        { color: '#f50001', percentage: 100 },
        { color: '#e64f00', percentage: 80 },
        { color: '#b88300', percentage: 60 },
        { color: '#fabe00', percentage: 40 },
        { color: '#8ed300', percentage: 20 }
      ]
    }
  },
  created() {
    this.id = this.$route.params.id
    this.get()
    this.listResults()
  },
  methods: {
    async get() {
      this.compare = await SnapshotCompareApi.get(this.id)
    },
    async listResults() {
      this.results = await SnapshotCompareApi.listResults(this.id)
      this.columns = Array.from(new Set(this.results.flatMap(result => result.lines).map(line => line.channel)))
      this.results.forEach(result => {
        const line = result.lines.map(line => {
          const obj = {}
          obj[line.channel] = (line.abnormal / line.total).toFixed(2) * 100
          return obj
        }).reduce((a, b) => Object.assign({}, a, b))
        result.lines = line
      })
    }
  }
}

</script>

