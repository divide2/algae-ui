import axios from '@/utils/t-request'

export default {
  listByProduct(productId, component) {
    return axios.get(`/v1/product/${productId}/${component}/validate`)
  },
  list() {
    return axios.get(`/v1/validate`)
  },
  add(data) {
    return axios.post(`/v1/validate`, data)
  },
  update(data) {
    return axios.put(`/v1/validate`, data)
  },
  relate(productId, validateId, component) {
    return axios.post(`/v1/product/${productId}/${component}/validate/${validateId}`)
  }
}
