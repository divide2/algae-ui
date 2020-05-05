import axios from '@/utils/t-request'

export default {
  page(params) {
    return axios.get('/monitor/example/page', { params })
  },
  responsePage(params) {
    return axios.get(`/monitor/example/response/page`, { params })
  },
  save(param) {
    return axios.post('/monitor/example/save', param)
  },
  get(id) {
    return axios.get(`/monitor/example/${id}`)
  },
  remove(id) {
    return axios.delete(`/monitor/example/${id}`)
  },
  update(id, param) {
    return axios.put(`/monitor/example/${id}`, param)
  },
  execute(id) {
    return axios.put(`/monitor/example/execute/${id}`)
  },
  stop(id) {
    return axios.put(`/monitor/example/stop/${id}`)
  },
  getMonitorIndex(id) {
    return axios.get(`/monitor/example/index/${id}`)
  }
}
