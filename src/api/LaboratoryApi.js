import axios from '@/utils/t-request'

export default {
  page(params) {
    return axios.get('/base/laboratory/page', { params })
  },
  save(param) {
    return axios.post('/base/laboratory', param)
  },
  list(params) {
    return axios.get('/base/laboratory/list', { params })
  },
  listTypes() {
    return axios.get('/base/laboratory/types')
  },
  get(id) {
    return axios.get(`/base/laboratory/${id}`)
  },
  update(param) {
    return axios.put(`/base/laboratory/${param.id}`, param)
  },
  remove(id) {
    return axios.delete(`/base/laboratory/${id}`)
  }
}
