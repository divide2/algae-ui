import axios from '@/utils/t-request'

export default {
  get(id) {
    return axios.get(`/base/device/${id}`)
  },
  page(params) {
    return axios.get('/base/device/page', { params })
  },
  save(param) {
    return axios.post('/base/device', param)
  },
  checkExist(name) {
    return axios.get(`/base/device/${name}/exist`)
  },
  remove(id) {
    return axios.delete(`/base/device/${id}`)
  },
  getBySerial(name) {
    return axios.get(`/base/device/serial/${name}`)
  },
  list(params) {
    return axios.get('/base/device/list', { params })
  },
  listTypes() {
    return axios.get('/base/device/types')
  },
  listByType(type) {
    return axios.get(`/base/device/types/${type}/devices`)
  },
  groupPage(params) {
    return axios.get('/base/device/group/page', { params })
  },
  groupSave(param) {
    return axios.post('/base/device/group', param)
  },
  groupUpdate(param) {
    return axios.put(`/base/device/group/${param.id}`, param)
  },
  groupGet(id) {
    return axios.get(`/base/device/group/${id}`)
  },
  groupCheckExist(name) {
    return axios.get(`/base/device/group/${name}/exist`)
  },
  groupRemove(id) {
    return axios.delete(`/base/device/group/${id}`)
  }
}
