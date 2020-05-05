import axios from '@/utils/t-request'

export default {
  getFwVersions(params) {
    return axios.get('/base/version/all', { params })
  },
  page(params) {
    return axios.get('/base/version/page', { params })
  },
  save(param) {
    return axios.post('/base/version', param)
  },
  get(id) {
    return axios.get(`/base/version/${id}`)
  },
  update(param) {
    return axios.put(`/base/version/${param.id}`, param)
  },
  remove(id) {
    return axios.delete(`/base/version/${id}`)
  },
  checkExist(name) {
    return axios.get(`/base/version/${name}/exist`)
  },
  listByType(type) {
    return axios.get(`/base/version/${type}/versions`)
  }
}
