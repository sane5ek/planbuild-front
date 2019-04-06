import Vue from 'vue'

export default {
  state: {
    foundUsers: []
  },
  mutations: {
    setFoundUsers (state, payload) {
      state.foundUsers = payload
    }
  },
  actions: {
    async loadUsers ({ commit, state, getters }) {
      commit('setLoading', true)
      try {
        const response = await Vue.http.post('interaction/search', { 'search': getters.search }, {
          headers: {
            Authorization: 'Token ' + getters.token
          }
        })
        commit('setFoundUsers', response.data)
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        throw e
      }
    },
    async adoptFields ({ commit, state, getters }, email) {
      commit('setLoading', true)
      try {
        const response = await Vue.http.post('interaction/adopt', { 'email': email }, {
          headers: {
            Authorization: 'Token ' + getters.token
          }
        })
        commit('setSuccess', 'Запрос пользователю ' + email + ' успешно отправлен')
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)

        if (e.status === 303) {
          commit('setError', 'Дождитесь ответа на предыдущий запрос')
        } else {
          commit('setError', 'Не удалось отправить запрос')
        }
        throw e
      }
    }
  },
  getters: {
    foundUsers (state) {
      return state.foundUsers
    }
  }
}
