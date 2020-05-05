import axios from '@/utils/t-request'

export default {
  googleLogin(idToken) {
    return axios.post(`/login/google`, idToken)
  },
  login(data) {
    return Promise.resolve({ accessToken: 'token' })
    // return axios.post('/login/pwd', data)
  },
  logout() {
    return axios.post('/user/logout')
  },
  getInfo() {
    return Promise.resolve({ roles: ['admin'], avatar: 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1305353222,2352820043&fm=26&gp=0.jpg', username: 'bvvy', nickname: 'bvvy', email: 'bvvy@qq.com' })
    // return axios.get('/user/info')
  }
}
