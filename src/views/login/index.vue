<template>
  <div v-loading="loading" class="login">
    <div class="login-container">
      <div class="title-box">
        <img src="@/assets/logo.png" width="39" height="39">
        <span class="login-title">Proee</span>
      </div>
      <el-form ref="loginForm" :rules="loginRules" :model="loginForm">
        <el-form-item prop="username" style="margin-top: 50px;">
          <el-input ref="username" v-model="loginForm.username" size="large" :placeholder="$t('login.username')">
            <i slot="prefix" class="el-input__icon el-icon-user" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password" style="margin-top: 50px;">
          <el-input ref="password" v-model="loginForm.password" size="large" type="password" :placeholder="$t('login.password')">
            <i slot="prefix" class="el-input__icon el-icon-lock" />
          </el-input>
        </el-form-item>
        <el-form-item style="margin-top: 50px;">
          <el-button type="primary" size="large" class="submit-btn" @click="login">{{ $t('login.logIn') }}</el-button>
        </el-form-item>
      </el-form>
      <div class="other-login-box">
        <span>{{ $t('login.thirdparty') }}</span>
        <el-button circle plain @click="googleLogin">
          <img class="thirdparty" src="@/assets/google.png" height="20" width="20">
        </el-button>
      </div>
    </div>
  </div>

</template>

<script>
// import LangSelect from '@/components/LangSelect'

const gapi = window.gapi
export default {
  name: 'Login',
  components: {},
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true }],
        password: [{ required: true }]
      },
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    gapi.load('auth2', function() {
      // const secret = 'uqM-2TU9A5-BoGIpxnkVJn9R'
      gapi.auth2 = gapi.auth2.init({
        client_id: '212035918857-ikea6hpinngn1tg5h30negsia76l2hta.apps.googleusercontent.com'
        // Scopes to request in addition to 'profile' and 'email'
        // scope: 'additional_scope'
      })
    })
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
              this.$message.error(this.$t('message.errorLogin'))
            })
        } else {
          return false
        }
      })
    },
    googleLogin() {
      this.loading = true
      gapi.auth2.signIn({
        scope: 'profile email'
      }).then((data) => {
        const idToken = data.getAuthResponse().id_token
        this.$store.dispatch('user/googleLogin', idToken)
          .then(() => {
            this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            this.loading = false
          })
          .catch(() => {
            this.loading = false
            this.$message.error(this.$t('message.errorLogin'))
          })
      }).catch(e => {
        this.loading = false
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/background.svg");
  background-color: #f0f2f5;
}

.login-container {
  width: 365px;
  margin: auto;
  position: relative;
  top: 20%;
}

.title-box {
  text-align: center;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.85);
}

.title-box > * {
  vertical-align: middle;
}

.login-title {
  font-size: 33px;
  font-weight: 600;
}

.submit-btn {
  width: 100%;

}

.other-login-box > * {
  vertical-align: middle;
  margin-right: 20px;

  color: #666666;
}

.thirdparty:hover {
  cursor: pointer;

}
</style>

