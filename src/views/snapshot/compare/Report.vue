<template>
  <div>
    <iframe
      frameborder="0"
      marginheight="0"
      marginwidth="0"
      title="数据可视化"
      allowtransparency="true"
      allowfullscreen="true"
      width="1366"
      height="3027"
      class="tableauViz"
      style="margin: 0px; padding: 0px; border: none; width: 1366px; height: 3027px; display: block;"
      :src="url"
    />

  </div>
</template>

<script>

export default {
  name: 'SnapshotInstanceReport',
  computed: {
    url() {
      return 'https://tab.limeinternal.com/views/snapdragon-compare-1204/CompareTestReport?:embed=y&amp;:showVizHome=no&amp;:host_url=https://tab.limeinternal.com/&amp;:embed_code_version=3&amp;:tabs=no&amp;:toolbar=yes&amp;:showAppBanner=false&amp;:display_spinner=no&amp;:loadOrderID=0'
    }
  }
}
</script>
