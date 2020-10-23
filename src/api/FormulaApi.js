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
  },
  findFormulaByMaster(masterId) {
    return axios.get(`/v1/formula/by/master/${masterId}`)
  },
  findFormulaTreeByMaster(masterId) {
    return axios.get(`/v1/formula/tree/by/master/${masterId}`)
  },
  findMasterTreeByFormula(formulaId) {
    return axios.get(`/v1/formula/master/tree/by/formula/${formulaId}`)
  },
  updateMaster(data) {
    return axios.put('/v1/formula/master', data)
  },
  addMaster(data) {
    return axios.post('/v1/formula/master', data)
  },
  updateFormula(data) {
    return axios.put('/v1/formula', data)
  },
  addFormula(data) {
    return axios.post('/v1/formula', data)
  },
  findRelatedProduct(formulaId) {
    return axios.get(`/v1/formula/${formulaId}/related/product`)
  },
  findMasterRelatedFormulas(formulaMasterId) {
    return axios.get(`/v1/formula/master/${formulaMasterId}/related/formulas`)
  }

}
