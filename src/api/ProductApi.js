import axios from '@/utils/t-request'

export default {
  find(params) {
    return axios.get('/v1/products', { params })
  },
  add(data) {
    return axios.post('/v1/products', data)
  }
}
