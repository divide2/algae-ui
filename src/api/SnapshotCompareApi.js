import axios from '@/utils/t-request'

export default {
  page(params) {
    return axios.get('/snapshot/compare/page', { params })
  },
  save(param) {
    return axios.post('/snapshot/compare/save', param)
  },
  list(params) {
    return axios.get('/snapshot/compare/list', { params })
  },
  listResults(id) {
    return axios.get(`/snapshot/compare/${id}/results`)
  },
  get(id) {
    return axios.get(`/snapshot/compare/${id}`)
  },
  remove(id) {
    return axios.delete(`/snapshot/compare/${id}`)
  },
  checkExist(name) {
    return axios.get(`/snapshot/compare/${name}/exist`)
  }
}
