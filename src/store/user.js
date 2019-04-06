import Vue from 'vue'
import jwt_decode from 'jwt-decode'

export default {
  state: {
    user: localStorage.getItem('u'),
    posts: [],
    degrees: [],
    titles: [],
    jwt: localStorage.getItem('t')
  },
  mutations: {
    setUser (state, payload) {
      localStorage.setItem('u', payload)
      state.user = payload
    },
    updateToken (state, newToken) {
      localStorage.setItem('t', newToken)
      state.jwt = newToken
    },
    removeToken (state) {
      localStorage.removeItem('t')
      state.jwt = null
    },
    setFirstName (state, payload) {
      state.user.first_name = payload
    },
    setLastName (state, payload) {
      state.user.last_name = payload
    },
    setEmail (state, payload) {
      state.user.email = payload
    },
    setPost (state, payload) {
      state.user.post = payload
    },
    setSalary (state, payload) {
      state.user.salary = payload
    },
    setDegree (state, payload) {
      state.user.degree = payload
    },
    setTitle (state, payload) {
      state.user.title = payload
    }
  },
  actions: {
    async loadInfo ({ commit, state }) {
      commit('setLoading', true)
      try {
        const response = await Vue.http.get('settings/info')
        state.posts = response.data['posts']
        state.titles = response.data['titles']
        state.degrees = response.data['degrees']
        commit('setLoading', false)
      } catch (response) {
        commit('setError', 'Неизвестная ошибка')
        commit('setLoading', false)
        throw Error
      }
    },
    async registerUser ({ commit, state, dispatch }, payload) {
      commit('setLoading', true)

      let user = {
        'first_name': payload['firstName'],
        'last_name': payload['lastName'],
        'email': payload['email'],
        'password': payload['password'],
        'post': payload['post'],
        'science_title': payload['title'],
        'science_degree': payload['degree'],
        'salary': payload['salary']
      }

      try {
        await Vue.http.post('auth/register', user)
        commit('setLoading', false)
        commit('setSuccess', 'Регистрация прошла успешно')
      } catch (response) {
        const errors = response.data
        if (errors.email) {
          commit('setError', 'Пользователь с такой почтой уже существует')
        } else {
          commit('setError', 'Неизвестная ошибка')
        }
        commit('setLoading', false)
        throw Error
      }
    },
    async loginUser ({ commit, state, dispatch }, payload) {
      commit('setLoading', true)
      try {
        const response = await Vue.http.post('auth/token', payload)
        commit('updateToken', response.data.token)
        commit('setSuccess', 'Успешный вход')
        commit('setLoading', false)
      } catch (e) {
        if (e.status === 400) {
          commit('setError', 'Пользователь с такими данными не найден')
        }
        commit('setLoading', false)
        throw e
      }
    },
    async loadUserInfo ({ commit, state }) {
      commit('setLoading', true)
      try {
        const response = await Vue.http.get('settings/user', {
          headers: {
            Authorization: 'Token ' + state.jwt
          }
        })
        commit('setUser', response.data)
        commit('setLoading', false)
      } catch (e) {
        if (e.status === 401) {
          commit('removeToken')
          commit('setUser', null)
          Vue.$router.push('/')
        }
        commit('setLoading', false)
        throw e
      }
    },
    async editUser ({ commit, state, getters }) {
      commit('setLoading', true)
      try {
        const response = await Vue.http.post('settings/edit', state.user, {
          headers: {
            Authorization: 'Token ' + getters.token
          }
        })
        commit('setUser', response.data)
        commit('setLoading', false)
        commit('setSuccess', 'Успешно сохранено')
      } catch (e) {
        commit('setLoading', false)
        throw e
      }
    },
    async editEmail ({ commit, state, getters }, { email }) {
      commit('setLoading', true)
      try {
        const response = await Vue.http.post('settings/email', { 'email': email }, {
          headers: {
            Authorization: 'Token ' + getters.token
          }
        })
        commit('setUser', response.data)
        commit('setLoading', false)
        commit('setSuccess', 'Успешно сохранено')
      } catch (e) {
        commit('setError', 'Такая почта уже зарегистрирована')
        commit('setLoading', false)
        throw e
      }
    },
    async editPasswordUser ({ commit, state, getters }, { oldPassword, newPassword }) {
      commit('setLoading', true)
      try {
        await Vue.http.post('settings/password',
          {
            'old': oldPassword,
            'new': newPassword
          },
          {
            headers: {
              Authorization: 'Token ' + getters.token
            }
          })
        commit('setSuccess', 'Пароль успешно изменен')
        commit('setLoading', false)
      } catch (e) {
        if (e.status === 451) {
          commit('setError', 'Старый пароль введен неверно')
        }
        commit('setLoading', false)
        throw e
      }
    },
    logoutUser ({ commit }) {
      commit('removeToken')
      commit('setUser', null)
      commit('setSuccess', 'Вы вышли из аккаунта')
    },
    refreshToken () {
      const payload = {
        token: this.state.jwt
      }
      Vue.http.post('auth/refresh', payload)
        .then((response) => {
          this.commit('updateToken', response.data.token)
        })
        .catch(() => {})
    },
    inspectToken () {
      const token = this.state.jwt
      if (token) {
        const decoded = jwt_decode(token)
        const exp = decoded.exp
        const origIat = decoded.orig_iat
        if (exp - (Date.now() / 1000) < 1800 && (Date.now() / 1000) - origIat < 628200) {
          this.dispatch('refreshToken')
        } else if (exp - (Date.now() / 1000) < 1800) {
          // DO NOTHING, DO NOT REFRESH
        } else {
          // PROMPT USER TO RE-LOGIN, THIS ELSE CLAUSE COVERS THE CONDITION WHERE A TOKEN IS EXPIRED AS WELL
        }
      }
    },

    setFirstName ({ commit }, payload) {
      commit('setFirstName', payload)
    },
    setLastName ({ commit }, payload) {
      commit('setLastName', payload)
    },
    setEmail ({ commit }, payload) {
      commit('setEmail', payload)
    },
    setPost ({ commit }, payload) {
      commit('setPost', payload)
    },
    setSalary ({ commit }, payload) {
      commit('setSalary', payload)
    },
    setDegree ({ commit }, payload) {
      commit('setDegree', payload)
    },
    setTitle ({ commit }, payload) {
      commit('setTitle', payload)
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    isUserLoggedIn (state) {
      return state.jwt !== null
    },
    posts (state) {
      return state.posts
    },
    titles (state) {
      return state.titles
    },
    degrees (state) {
      return state.degrees
    },
    token (state) {
      return state.jwt
    },
    firstName (state) {
      return state.user.first_name
    },
    lastName (state) {
      return state.user.last_name
    },
    email (state) {
      return state.user.email
    },
    post (state) {
      return state.user.post
    },
    degree (state) {
      return state.user.degree
    },
    title (state) {
      return state.user.title
    },
    salary (state) {
      return state.user.salary
    }
  }
}
