import axios from '@/utils/t-request'

export default {
  findFormulaGroups(productId) {
    return axios.get(`/v1/formula/group/by/product/${productId}`)
  },
  removeChildFormula(data) {
    return axios.delete('/v1/formula/group/child/formula', { data })
  },
  addChildFormula(data) {
    return axios.post('/v1/formula/group/child/formula', data)
  },
  addChildFormulaMaster(data) {
    return axios.post('/v1/formula/group/child/master', data)
  },
  add(data) {
    return axios.post('/v1/formula/group', data)
  }
}
