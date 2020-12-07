import LangApi from '@/api/LangApi'

const state = {
  langsTree: []
}

const mutations = {
  GET_LANGS_TREE: (state, lang) => {
    state.langsTree = lang
  },
  CLEAR_ERROR_LOG: (state) => {
    state.logs.splice(0)
  }
}

const actions = {
  getLangsTree({ commit }) {
    LangApi.tree().then(lang => {
      commit('GET_LANGS_TREE', lang)
    })
    LangApi.getLang()
  },
  clearErrorLog({ commit }) {
    commit('CLEAR_ERROR_LOG')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
