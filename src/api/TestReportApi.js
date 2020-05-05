import axios from '@/utils/t-request'

export default {
  page(params) {
    return axios.get('/snapshot/report/page', { params })
  },
  get(id) {
    return axios.get(`/snapshot/report/${id}`)
  },
  remove(id) {
    return axios.delete(`/snapshot/report/${id}`)
  },
  listExecPage(params) {
    return axios.get('/snapshot/report/page/execs', { params })
  },
}
