import axios from '@/utils/t-request'

export default {
  list(params) {
    return axios.get('/product_new/api/v2/products', { params })
  },
  add(data) {
    return axios.post('/v1/product', data)
  }
}
