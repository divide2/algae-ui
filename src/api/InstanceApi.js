import axios from '@/utils/t-request'

export default {
  page (params) {
    return axios.get('/snapshot/instance/page', { params })
  },
  save (params) {
    return axios.post('/snapshot/instance/save', params)
  },
  update (params) {
    return axios.put(`/snapshot/instance/${params.id}`, params)
  },
  run (params) {
    return axios.post('/snapshot/instance/exec/start', params)
  },
  stop (instanceId, instanceExecId) {
    return axios.post(`/snapshot/instance/${instanceId}/exec/${instanceExecId}/stop`)
  },
  list (params) {
    return axios.get('/snapshot/instance/list', { params })
  },
  listExecs (params) {
    return axios.get(`/snapshot/instance/${params.id}/execs`, params)
  },
  listExecLines (instanceId, execId) {
    return axios.get(`/snapshot/instance/${instanceId}/exec/${execId}`)
  },
  get (id) {
    return axios.get(`/snapshot/instance/${id}`)
  },
  getExec (id) {
    return axios.get(`/snapshot/instance/exec/${id}`)
  },
  genAnalyzeMode (instanceId, execId) {
    return axios.post(`/snapshot/instance/${instanceId}/exec/${execId}/analyze`)
  },
  upload (instanceId, execId) {
    return axios.post(`/snapshot/instance/${instanceId}/exec/${execId}/upload`)
  },
  remove (id) {
    return axios.delete(`/snapshot/instance/${id}`)
  },
  checkExist (name) {
    return axios.get(`/snapshot/instance/${name}/exist`)
  },
  listExecCaseLinePage (params) {
    return axios.get('/snapshot/instance/page/case/detail', { params })
  },
  listExecCmdLinePage (params) {
    return axios.get('/snapshot/instance/page/cmd/detail', { params })
  },
  getExecCase (id) {
    return axios.get(`/snapshot/instance/exec/case/${id}`)
  },
  listAnalyses () {
    return axios.get(`/snapshot/instance/exec/analyses`)
  },
  updateAnalysis (params) {
    return axios.post('/snapshot/instance/exec/analysis/update', params)
  },
  listCaseAnalyses () {
    return axios.get(`/snapshot/instance/exec/case/analyses`)
  },
  updateCaseAnalysis (params) {
    return axios.post('/snapshot/instance/exec/case/analysis/update', params)
  },
  retry (instanceExecId, caseId) {
    return axios.post(`/snapshot/instance/exec/${instanceExecId}/${caseId}/retry`)
  },
}
