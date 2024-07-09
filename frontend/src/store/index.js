import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    loginMessage: '',
    userName: '',
    events: [],
    isAuthenticated: false,
    eventId: '',
    students: [],
    professors: [],
    planes: [],
    professorId: '',
    courses: [],
    leisures: [],
    statistics: {
      totalFlightTime: 0,
      totalLessons: 0,
      totalUsers: 0,
    },
  },
  getters: {
    loginMessage: (state) => state.loginMessage,
    userName: (state) =>
      state.user ? state.user.first_name + ' ' + state.user.last_name : '',
    events: (state) => state.events,
    isAuthenticated: (state) => !!state.user,
    eventId: (state) => (state.event ? state.event._id : ''),
    userRole: (state) => (state.user ? state.user.role : ''),
    currentUserId: (state) => state.user?._id,
    students: (state) => state.students,
    professors: (state) => state.professors,
    planes: (state) => state.planes,
    professorId: (state) => (state.user ? state.user._id : ''),
    courses: (state) => state.events.filter((event) => event.type === 'course'),
    leisures: (state) =>
      state.events.filter((event) => event.type === 'leisure'),
  },
  statistics: (state) => state.statistics,
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
        commit('setEvents', response.data)
      } catch (error) {
        console.error('Failed to fetch events:', error)
        commit('setEvents', [])
      }
    },
    async fetchEventsForProfessor({ commit }, professorId) {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }
        const response = await axios.get(
          `http://localhost:5000/api/events/professor/${professorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        commit('setEvents', response.data)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    },
    addEvent({ commit }, event) {
      commit('addEvent', event)
    },
    async updateEvent({ commit }, updatedEvent) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/events/${updatedEvent._id}`,
          updatedEvent,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          },
        )
        commit('updateEvent', response.data)
      } catch (error) {
        console.error('Error updating event:', error)
      }
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
    async fetchEventsByType({ commit }, type) {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          throw new Error('No token found')
        }
        const response = await axios.get(
          `http://localhost:5000/api/events/type/${type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        commit('setEvents', response.data)
      } catch (error) {
        console.error('Error fetching events:', error)
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
    async fetchStatistics({ commit }) {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/events/statistics',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          },
        )
        commit('setStatistics', response.data)
      } catch (error) {
        console.error('Error fetching statistics:', error)
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
    updateEvent(state, updatedEvent) {
      const index = state.events.findIndex(
        (event) => event._id === updatedEvent._id,
      )
      if (index !== -1) {
        state.events.splice(index, 1, updatedEvent)
      }
    },
    deleteEvent(state, eventId) {
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
    setProfessorId(state, professorId) {
      state.professorId = professorId
    },
    setEventsType(state, events) {
      state.events = events
    },
    setStatistics(state, statistics) {
      state.statistics = statistics
    },
  },
})
