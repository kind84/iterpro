const cookieparser = process.server ? require('cookieparser') : undefined
import jwt_decode from 'jwt-decode'

export const state = () => ({
  employee: null,
  auth: null
})

export const mutations = {
  setEmployee (state, employee) {
    state.employee = employee
  },
  setAuth (state, auth) {
    state.auth = auth
  },
  logout (state) {
    state.auth = null
    localStorage.removeItem("token")
  }
}

export const actions = {
  nuxtServerInit({ commit, dispatch }, { req }) {
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = jwt_decode(parsed.token)
        if (!auth || new Date().getTime() > new Date(auth.exp * 1000).getTime()) {
          commit('logout')
          return
        }
        dispatch('setAuth', auth)
      } catch (err) {
        console.log("unable to parse token")
      }
    }
    commit('setAuth', auth)
  },
  initAuth ({ commit }, req) {
    let auth = null
    if (req) {
      if(!req.headers.cookie) {
        return
      }
      const parsed = cookieparser.parse(req.headers.cookie)
      if (!parsed || !parsed.token) {
        return
      }
      auth = jwt_decode(parsed.token)
    } else {
      const token = localStorage.getItem("token")
      if (!token) {
        return
      }
      auth = jwt_decode(token)
    }
    if (!auth || new Date().getTime() > new Date(auth.exp * 1000).getTime()) {
      commit("logout")
      return
    }
    if (auth.role === 'employee') {
      this.$axios.$get('email/' + auth.username)
      .then(res => {
        commit('setEmployee', res)
      }).catch(err => {
        console.log(err)
      })
    }
    commit("setAuth", auth)
  },
  setEmployee ({ commit }, employee) {
    commit('setEmployee', employee)
  },
  setAuth ({ commit }, auth) {
    commit('setAuth', auth)
  },
  logout ({ commit }) {
    commit('logout')
  }
}

export const getters = {
  isAuthenticated (state) {
    return state.auth !==  null
  }
}
