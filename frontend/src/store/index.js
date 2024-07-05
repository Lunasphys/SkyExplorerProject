import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    loginMessage: '',
    user: null,
    events: [],
    isAuthenticated: false,
  },
  getters: {
    loginMessage: (state) => state.loginMessage,
    user: (state) => state.user,
    events: (state) => state.events,
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => state.user?.role,
    currentUserId: (state) => state.user?._id,
  },
  actions: {
    async login({ commit }, { mail, password }) {
      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          mail,
          password,
        })
        const token = response.data.token
        localStorage.setItem('authToken', token)
        commit('setUser', response.data.user)
        commit('setLoginMessage', response.data.message)
        commit('setAuthenticated', true)
      } catch (error) {
        commit(
          'setLoginMessage',
          error.response?.data?.message || 'Login failed',
        )
      }
    },
    logout({ commit }) {
      localStorage.removeItem('authToken')
      commit('setUser', null)
      commit('setLoginMessage', '')
      commit('setAuthenticated', false)
    },
    async getUser({ commit }) {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('Authentication token not found')
        return
      }

      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        commit('setUser', response.data)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    },
    async fetchEvents({ commit }) {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('Authentication token not found')
        return
      }

      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        commit('setEvents', response.data)
      } catch (error) {
        console.error('Failed to fetch events:', error)
      }
    },
    async addEvent({ commit }, event) {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('Authentication token not found')
        return
      }

      try {
        const response = await axios.post(
          'http://localhost:5000/api/events',
          event,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        commit('addEvent', response.data)
      } catch (error) {
        console.error('Failed to add event:', error)
      }
    },
    async deleteEvent({ commit }, eventId) {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('Authentication token not found')
        return
      }

      try {
        await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        commit('removeEvent', eventId)
      } catch (error) {
        console.error('Failed to delete event:', error)
      }
    },
  },
  mutations: {
    setLoginMessage(state, message) {
      state.loginMessage = message
    },
    setUser(state, user) {
      state.user = user
    },
    setEvents(state, events) {
      state.events = events
    },
    addEvent(state, event) {
      state.events.push(event)
    },
    removeEvent(state, eventId) {
      state.events = state.events.filter((event) => event._id !== eventId)
    },
    setAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    },
  },
})
