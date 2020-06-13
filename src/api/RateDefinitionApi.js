import axios from '@/utils/t-request'

export default {
  list(productId) {
    return axios.get(`/v1/product/${productId}/rate/definition`)
  },
  add(data) {
    return axios.post(`/v1/product/${data.productId}/rate/definition`, data)
  },
  update(data) {
    return axios.put(`/v1/product/${data.productId}/rate/definition`, data)
  }
}
