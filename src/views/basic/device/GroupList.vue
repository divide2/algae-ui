<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="query.serial" :placeholder="$t('basic.deviceGroup.name')" style="width: 200px;" class="filter-item" @keyup.enter.native="search" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="search">
        {{ $t('button.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="create">
        {{ $t('button.create') }}
      </el-button>
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
      <el-table-column :label="$t('basic.deviceGroup.name')" prop="name" />
      <el-table-column :label="$t('basic.deviceGroup.content')" prop="content" />
      <el-table-column :label="$t('basic.deviceGroup.deviceCount')" prop="deviceCount" />
      <el-table-column :label="$t('basic.deviceGroup.status')" prop="status">
        <template slot-scope="{row}">
          {{ $t(`status.basic.deviceGroup.${row.status.toLowerCase()}`) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('basic.deviceGroup.location')" prop="location" />
      <el-table-column :label="$t('basic.deviceGroup.createTime')" prop="createTime" />
      <el-table-column :label="$t('table.action')">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="update(row)">
            {{ $t('button.edit') }}
          </el-button>
          <el-button size="mini" type="danger" @click="remove(row)">
            {{ $t('button.remove') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageNo" :limit.sync="query.pageSize" @pagination="page" />
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import DeviceApi from '@/api/DeviceApi' // secondary package based on el-pagination

export default {
  name: 'DeviceGroupList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      loading: true,
      runLoading: false,
      query: {
        sort: '+id',
        name: ''
      }
    }
  },
  created() {
    this.page()
  },
  methods: {
    page() {
      this.loading = true
      DeviceApi.groupPage(this.query).then(data => {
        this.list = data.records
        this.total = data.total
        this.loading = false
      })
    },
    create() {
      this.$router.push({ name: 'deviceGroupCreate' })
    },
    update(row) {
      this.$router.push({
        name: 'deviceGroupEdit', params: { id: row.id }
      })
    },
    async remove(row) {
      await this.$confirm(this.$t('message.confirmRemove'))
      await DeviceApi.groupRemove(row.id)
      this.page()
      this.$message.success(this.$t('message.removeSuccess'))
    },
    search() {
      this.query.pageNo = 1
      this.page()
    }
  }
}
</script>
