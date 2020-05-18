import axios from '@/utils/t-request'

export default {
  list(params) {
    return axios.get('/v1/product/all', { params })
  },
  add(data) {
    return axios.post('/v1/product', data)
  }
}
