import axios from '@/utils/t-request'

export default {
  find(params) {
    return axios.get('/v1/products', { params })
  },
  add(data) {
    return axios.post('/v1/products', data)
  },
  get(id) {
    return axios.get(`/v1/products/${id}`)
  },
  update(data) {
    return axios.put('/v1/products', data)
  },
  addTable(params) {
    return axios.post(`/v1/products/${params.productId}/tables`, { name: params.name })
  },
  getTable(productId) {
    return axios.get(`/v1/products/${productId}/tables`)
  },
  getTableDetail(productId, tableId, fileId) {
    return axios.get(`/v1/products/${productId}/tables/${tableId}/files/${fileId}/sheets`)
  }
}
