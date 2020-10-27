import axios from '@/utils/t-request'

export default {
  dict(params) {
    return axios.get('/v1/langs/dict', { params })
  },
  find(params) {
    return axios.get('/v1/langs', { params })
  },
  add(param) {
    return axios.post('/v1/langs', param)
  }
}
