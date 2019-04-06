export default {
  state: {
    loading: false,
    error: null,
    success: null,
    search: ''
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    setSuccess (state, payload) {
      state.success = payload
    },
    clearSuccess (state) {
      state.success = null
    },
    setSearch (state, payload) {
      state.search = payload
    },
    clearSearch (state, payload) {
      state.search = ''
    }
  },
  actions: {
    setLoading ({ commit }, payload) {
      commit('setLoading', payload)
    },
    setError ({ commit }, payload) {
      commit('setError', payload)
    },
    clearError ({ commit }) {
      commit('clearError')
    },
    setSuccess ({ commit }, payload) {
      commit('setSuccess', payload)
    },
    clearSuccess ({ commit }) {
      commit('clearSuccess')
    },
    setSearch ({ commit }, payload) {
      commit('setSearch', payload)
    },
    clearSearch ({ commit }) {
      commit('clearSearch')
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    },
    success (state) {
      return state.success
    },
    search (state) {
      return state.search
    }
  }
}
