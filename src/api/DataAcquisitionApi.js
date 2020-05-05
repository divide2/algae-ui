import axios from '@/utils/t-request'

export default {
  list(params) {
    return axios.get('/base/acquisition/list', { params })
  },
  page(params) {
    return axios.get('/base/acquisition/page', { params })
  },
  save(param) {
    return axios.post('/base/acquisition', param)
  },
  get(id) {
    return axios.get(`/base/acquisition/${id}`)
  },
  update(param) {
    return axios.put(`/base/acquisition/${param.id}`, param)
  },
  remove(id) {
    return axios.delete(`/base/acquisition/${id}`)
  }
}
