import axios from '@/utils/t-request'

export default {
  get(id) {
    return axios.get(`/base/vehicle/${id}`)
  },
  page(params) {
    return axios.get('/base/vehicle/page', { params })
  },
  save(param) {
    return axios.post('/base/vehicle', param)
  },
  getHistory(id) {
    return axios.get(`/base/vehicle/history/${id}`)
  },
  queryVersion(param) {
    return axios.post(`/base/vehicle/query`, param)
  }
}
