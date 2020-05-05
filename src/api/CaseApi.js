import axios from '@/utils/t-request'

export default {
  page(params) {
    return axios.get('/snapshot/case/page', { params })
  },
  save(param) {
    return axios.post('/snapshot/case', param)
  },
  list(params) {
    return axios.get('/snapshot/case/list', { params })
  },
  get(id) {
    return axios.get(`/snapshot/case/${id}`)
  },
  update(param) {
    return axios.put(`/snapshot/case/${param.id}`, param)
  },
  remove(id) {
    return axios.delete(`/snapshot/case/${id}`)
  },
  checkExist(name) {
    return axios.get(`/snapshot/case/${name}/exist`)
  },
  copy(param) {
    return axios.post('/snapshot/case/copy', param)
  }
}
