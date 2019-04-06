import Vue from 'vue'

export default {
  state: {
    fieldsOwner: '',
    settingsFields: [],
    rawSettingsFields: []
  },
  mutations: {
    setFieldsOwner (state, payload) {
      state.fieldsOwner = payload
    },
    setSettingsFields (state, payload) {
      state.settingsFields = payload
    },
    setRawSettingsFields (state, payload) {
      state.rawSettingsFields = payload
    }
  },
  actions: {
    async setFieldsOwner ({ commit, state, dispatch, getters }, payload) {
      dispatch('setLoading', true)
      try {
        await Vue.http.post('settings/owner',
          {
            owner: payload
          },
          {
            headers: {
              Authorization: 'Token ' + getters.token
            }
          })
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        throw e
      }
      commit('setFieldsOwner', payload)
      dispatch('setLoading', false)
    },
    async loadRawSettingsFields ({ commit, state, dispatch, getters }) {
      dispatch('setLoading', true)
      try {
        const response = await Vue.http.get('settings/fields', {
          headers: {
            Authorization: 'Token ' + getters.token
          }
        })
        commit('setFieldsOwner', response.headers.get('owner'))
        commit('setRawSettingsFields', response.data)
        dispatch('loadSettingsFields', { 'courseType': '1_1M', 'studyType': false })
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        throw e
      }
    },
    loadSettingsFields ({ commit, state, dispatch }, payload) {
      dispatch('setLoading', true)
      const fields = state.rawSettingsFields.filter((obj) => {
        return obj['courseType'] === payload['courseType'] && obj['studyType'] === payload['studyType']
      })
      commit('setSettingsFields', fields)
      dispatch('setLoading', false)
    },
    async saveRawSettingsFields ({ commit, getters, dispatch }) {
      dispatch('setLoading', true)
      try {
        const response = await Vue.http.post('settings/save',
          {
            fields: getters.rawSettingsFields
          },
          {
            headers: {
              Authorization: 'Token ' + getters.token
            }
          })
        dispatch('setFieldsOwner', 'user')
        commit('setSuccess', 'Успешно сохранено')
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', 'Что-то пошло не так')
        throw e
      }
    },
    async loadDefaultFields ({ commit, state, dispatch, getters }) {
      dispatch('setLoading', true)
      try {
        const response = await Vue.http.get('settings/default', {
          headers: {
            Authorization: 'Token ' + getters.token
          }
        })
        commit('setRawSettingsFields', response.data)
        dispatch('loadSettingsFields', { 'courseType': '1_1M', 'studyType': true })
        dispatch('setFieldsOwner', 'default')
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        throw e
      }
    }
  },
  getters: {
    fieldsOwner (state) {
      return state.fieldsOwner
    },
    rawSettingsFields (state) {
      return state.rawSettingsFields
    },
    settingsFields (state) {
      return state.settingsFields
    }
  }
}
