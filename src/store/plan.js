import Vue from 'vue'

export default {
  state: {
    payloadFile: null,
    stSubjects: [],
    stSelected: [],
    cWorks: [],
    loadFilename: '',
    planFilename: ''
  },
  mutations: {
    setSelectedSubjects (state, payload) {
      state.selectedSubjects = payload
    },
    setSubjects (state, payload) {
      state.selectedSubjects = payload
    },
    setPayloadFile (state, payload) {
      state.payloadFile = payload
    },
    setStSubjects (state, payload) {
      state.stSubjects = payload
    },
    setStSelected (state, payload) {
      state.stSelected = payload
    },
    setCWorks (state, payload) {
      state.stCWorks = payload
    },
    setLoadFilename (state, payload) {
      state.loadFilename = payload
    },
    setPlanFilename (state, payload) {
      state.planFilename = payload
    }
  },
  actions: {
    async loadSubjects ({ commit, getters }) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const response = await Vue.http.post('main/subjects', {
          filename: getters.loadFilename
        })
        commit('setStSubjects', response.data)
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    },
    async createPlan ({ commit, state, getters }) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let email
        try {
          email = getters.user.email
        } catch (e) {
          email = null
        }
        const response = await Vue.http.post('main/plan',
          {
            email: email,
            subjects: state.stSelected,
            course: getters.cWorks.filter((item) => { return item.iType === 'Курсовая' }),
            diploma: getters.cWorks.filter((item) => { return item.iType === 'Дипломная' }),
            filename: getters.loadFilename
          },
          {
            responseType: 'blob'
          })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(response.data)
        link.download = 'Plan.xlsm'
        link.click()
        commit('setPlanFilename', response.headers.get('Filename'))
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    },
    async forceDownload ({ commit, state, getters }) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const response = await Vue.http.post('main/again',
          {
            filename: getters.planFilename
          },
          {
            responseType: 'blob'
          })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(response.data)
        link.download = 'Plan.xlsm'
        link.click()
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.message)
        throw e
      }
    },
    setPayloadFile ({ commit }, payload) {
      commit('setPayloadFile', payload)
    },
    setStSubjects ({ commit }, payload) {
      commit('setStSubjects', payload)
    },
    setStSelected ({ commit }, payload) {
      commit('setStSelected', payload)
    },
    setCWorks ({ commit }, payload) {
      commit('setCWorks', payload)
    },
    setLoadFilename ({ commit }, payload) {
      commit('setLoadFilename', payload)
    },
    setPlanFilename ({ commit }, payload) {
      commit('setPlanFilename', payload)
    }
  },
  getters: {
    stSubjects (state) {
      return state.stSubjects
    },
    stSelected (state) {
      return state.stSelected
    },
    cWorks (state) {
      return state.cWorks
    },
    payloadFile (state) {
      return state.payloadFile
    },
    loadFilename (state) {
      return state.loadFilename
    },
    planFilename (state) {
      return state.planFilename
    }
  }
}
