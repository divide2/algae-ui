<template>
  <product-detail :is-edit="false" />
</template>

<script>
import ProductDetail from './components/ProductDetail'

export default {
  name: 'Product',
  components: { ProductDetail },
  directives: {},
  data() {
    return {}
  },
  computed: {
  },
  methods: {
  }
}
</script>
