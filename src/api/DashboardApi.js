import axios from '@/utils/t-request'

export default {
  getCounts() {
    return axios.get('/v1/dashboard/counts')
  },
  getDaysCounts() {
    return axios.get('/v1/dashboard/counts/days')
  }
}
