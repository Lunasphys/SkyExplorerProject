import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    loginMessage: '',
    user: null,
    events: [],
    isAuthenticated: false,
    students: [],
    professors: [],
    planes: [],
  },
  getters: {
    loginMessage: (state) => state.loginMessage,
    user: (state) => state.user,
    events: (state) => state.events,
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => (state.user ? state.user.role : ''),
    currentUserId: (state) => state.user?._id,
    students: (state) => state.students,
    professors: (state) => state.professors,
    planes: (state) => state.planes,
  },
  actions: {
    async login({ commit }, { mail, password }) {
      try {
        const response = await axios.post('http://localhost:5000/api/login', {
          mail,
          password,
        })
        const token = response.data.token
        const role = response.data.user.role
        localStorage.setItem('authToken', token)
        localStorage.setItem('userRole', role)
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
    async fetchUser({ commit }) {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }
        const response = await axios.get('http://localhost:5000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        commit('setUser', response.data)
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    },
    async fetchEvents({ commit }) {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('Authentication token not found')
        return
      }

      try {
        const response = await axios.get('http://localhost:5000/api/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('API Response:', response)
        commit('setEvents', response.data)
        console.log('Events fetched successfully')
      } catch (error) {
        console.error('Failed to fetch events:', error)
        commit('setEvents', [])
      }
    },
    addEvent({ commit }, event) {
      commit('addEvent', event)
    },
    async fetchStudents({ commit }) {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('Authentication token not found')
        return
      }

      try {
        const response = await axios.get('http://localhost:5000/api/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        commit('setStudents', response.data)
      } catch (error) {
        console.error('Failed to fetch students:', error)
      }
    },
    async fetchProfessors({ commit }) {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('Authentication token not found')
        return
      }

      try {
        const response = await axios.get(
          'http://localhost:5000/api/professors',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        commit('setProfessors', response.data)
      } catch (error) {
        console.error('Failed to fetch professors:', error)
      }
    },
    async getAvailablePlanes({ commit }, { day, hour, duration }) {
      if (!day || !hour || !duration) {
        console.error('day, hour, and duration are required')
        return
      }

      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('Authentication token not found')
        return
      }

      try {
        const response = await axios.get(
          'http://localhost:5000/api/events/availablePlanes',
          {
            params: { day, hour, duration },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        commit('setPlanes', response.data)
      } catch (error) {
        console.error('Failed to fetch available planes:', error)
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
    setEvents(state, events) {
      state.events = Array.isArray(events) ? events : []
    },
    setLoginMessage(state, message) {
      state.loginMessage = message
    },
    setUser(state, user) {
      state.user = user
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
    setStudents(state, students) {
      state.students = students
    },
    setProfessors(state, professors) {
      state.professors = professors
    },
    setPlanes(state, planes) {
      state.planes = planes
    },
  },
})
