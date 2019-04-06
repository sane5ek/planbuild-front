import Vue from 'vue'

export default {
  state: {
    inRequests: [],
    outRequests: [],
    requests: []
  },
  mutations: {
    setInRequests (state, payload) {
      state.inRequests = payload
    },
    setOutRequests (state, payload) {
      state.outRequests = payload
    }
  },
  actions: {
    async loadRequests ({ commit, state, getters }) {
      commit('setLoading', true)
      try {
        const response = await Vue.http.get('interaction/request', {
          headers: {
            Authorization: 'Token ' + getters.token
          }
        })
        const requests = response.data.sort((a, b) => {
          if (a.date > b.date) {
            return 1
          }
          if (a.date < b.date) {
            return -1
          }
          return 0
        })
        commit('setInRequests', requests.filter((item) => {
          return item.type
        }))
        commit('setOutRequests', requests.filter((item) => {
          return !item.type
        }))
        commit('setLoading', false)
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        throw e
      }
    },
    async cancelRequest ({ commit, state, getters, dispatch }, id) {
      commit('setLoading', true)
      try {
        const response = await Vue.http.post('interaction/cancel',
          {
            'id': id
          },
          {
            headers: {
              Authorization: 'Token ' + getters.token
            }
          })
        dispatch('loadRequests')
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        throw e
      }
    },
    async acceptRequest ({ commit, state, getters, dispatch }, id) {
      commit('setLoading', true)
      try {
        const response = await Vue.http.post('interaction/accept',
          {
            'id': id
          },
          {
            headers: {
              Authorization: 'Token ' + getters.token
            }
          })
        dispatch('loadRequests')
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        throw e
      }
    },
    async declineRequest ({ commit, state, getters, dispatch }, id) {
      commit('setLoading', true)
      try {
        const response = await Vue.http.post('interaction/decline',
          {
            'id': id
          },
          {
            headers: {
              Authorization: 'Token ' + getters.token
            }
          })
        dispatch('loadRequests')
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        throw e
      }
    }
  },
  getters: {
    inRequests (state) {
      return state.inRequests
    },
    outRequests (state) {
      return state.outRequests
    }
  }
}
