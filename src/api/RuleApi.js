import axios from '@/utils/t-request'

export default {
  get(productId) {
    return axios.get(`/v1/product/${productId}/rule`)
  },
  add(data) {
    return axios.post(`/v1/product/${data.productId}/rule`, data)
  },
  update(data) {
    return axios.put(`/v1/product/${data.productId}/rule`, data)
  }
}
