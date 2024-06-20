import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    loginMessage: '',
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setLoginMessage(state, message) {
      state.loginMessage = message
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })
        const data = await response.json()
        if (response.ok) {
          commit('setUser', data.token)
          commit('setLoginMessage', data.message)
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        throw new Error('Login failed: ' + error.message)
      }
    },
    logout({ commit }) {
      commit('setUser', null)
      commit('setLoginMessage', '')
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    loginMessage: (state) => state.loginMessage,
  },
})
