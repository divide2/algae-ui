import axios from '@/utils/t-request'

export default {
  page(params) {
    return axios.get('/monitor/index/page', { params })
  },
  save(param) {
    return axios.post('/monitor/index/save', param)
  },
  get(id) {
    return axios.get(`/monitor/index/${id}`)
  },
  remove(id) {
    return axios.delete(`/monitor/index/${id}`)
  },
  update(id, param) {
    return axios.put(`/monitor/index/${id}`, param)
  },
  list(params) {
    return axios.get('/monitor/index/list', { params })
  }
}
