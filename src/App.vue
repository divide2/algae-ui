<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style scoped>
.el-menu-item i, .el-submenu__title > i {
  color: #fff
}

.el-table th, .el-table td {
  padding: 6px 0;
}

.el-table th.gutter {
  display: table-cell !important;
}

</style>
