import axios from '@/utils/t-request'

export default {
  getCounts() {
    return axios.get('/dashboard/counts')
  },
  getDaysCounts() {
    return axios.get('/dashboard/counts/days')
  }
}
