import axios from '@/utils/t-request'

export default {
  listByType(type) {
    return axios.get(`/base/cmd/types/${type}/cmds`)
  },
  listTypes() {
    return axios.get('/base/cmd/types')
  },
  list() {
    return axios.get('/base/cmd/list')
  },
  get(id) {
    return axios.get(`/base/cmd/${id}`)
  },
  page(params) {
    return axios.get('/base/cmd/page', { params })
  },
  save(param) {
    return axios.post('/base/cmd', param)
  },
  update(param) {
    return axios.put(`/base/cmd/${param.id}`, param)
  },
  remove(id) {
    return axios.delete(`/base/cmd/${id}`)
  },
  run(param) {
    return axios.post(`/base/cmd/${param.id}/run`, param)
  }
}
