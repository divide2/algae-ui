import axios from '@/utils/t-request'

export default {
  findGroupFormulas(groupId) {
    return axios.get(`/v1/formula/by/group/${groupId}`)
  },
  findGroupFormulasTree(groupId) {
    return axios.get(`/v1/formula/tree/by/group/${groupId}`)
  },
  findGroupValidatedFormulas(groupId) {
    return axios.get(`/v1/formula/validated/by/group/${groupId}`)
  },
  findAllMaster() {
    return axios.get('/v1/formula/master/all')
  }
}
