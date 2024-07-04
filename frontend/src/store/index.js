import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    loginMessage: '',
  },
  getters: {
    loginMessage: (state) => state.loginMessage,
  },
  actions: {
    async login({ commit }, { mail, password }) {
      console.log('Dispatching login action with:', { mail, password })
      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          mail,
          password,
        })
        commit('setLoginMessage', response.data.message)
      } catch (error) {
        console.error(
          'Login action failed:',
          error.response?.data?.message || error.message,
        )
        commit(
          'setLoginMessage',
          error.response?.data?.message || 'Login failed',
        )
      }
    },
  },
  mutations: {
    setLoginMessage(state, message) {
      state.loginMessage = message
    },
  },
})
