import axios from '@/utils/t-request'

export default {

  find(params) {
    return axios.get('/v1/lang/defines', { params })
  },
  add(param) {
    return axios.post('/v1/lang/defines', param)
  }
}
