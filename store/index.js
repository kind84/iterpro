const cookieparser = process.server ? require('cookieparser') : undefined
import jwt_decode from 'jwt-decode'
import Cookie from 'js-cookie'

export const state = () => ({
  token: null,
  refreshToken: null,
  auth: null,
  employee: null,
  e2r: null
})

export const mutations = {
  setToken (state, token) {
    console.log("setToken: " + JSON.stringify(token))
    state.token = token
  },
  setRefreshToken (state, token) {
    console.log("setRefreshToken: " + JSON.stringify(token))
    state.refreshToken = token
  },
  setAuth (state, auth) {
    console.log("setAuth: " + JSON.stringify(auth))
    state.auth = auth
  },
  setEmployee (state, employee) {
    console.log("setEmployee: " + JSON.stringify(employee))
    state.employee = employee
  },
  logout (state) {
    console.log("logout")
    state.auth = null
  },
  setE2R (state, e2r) {
    state.e2r = e2r
  }
}

export const actions = {
  nuxtServerInit({ commit, dispatch }, { req }) {
    console.log("nuxtServerInit")
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = jwt_decode(parsed.token)
        if (!auth || new Date().getTime() > new Date(auth.exp * 1000).getTime()) {
          dispatch("refreshToken", parsed.refresh)
          return
        }
        commit('setToken', parsed.token)
        commit('setRefreshToken', parsed.refresh)
        commit('setAuth', auth)
      } catch (err) {
        console.log("unable to parse token: " + err)
      }
    }
  },
  initAuth ({ commit, dispatch }, req) {
    console.log("initAuth")
    let auth = null
    let token = null
    let refreshToken = null
    if (req) {
      console.log("initAuth req: " + req.headers.cookie)
      if(!req.headers.cookie) {
        return
      }
      const parsed = cookieparser.parse(req.headers.cookie)
      if (!parsed || !parsed.token) {
        commit("logout")
        return
      }
      token = parsed.token
      refreshToken = parsed.refresh
      auth = jwt_decode(parsed.token)
    } else {
      const t = localStorage.getItem("token")
      const r = localStorage.getItem("refresh")
      if (!t || !r) {
        commit("logout")
        return
      }
      token = t
      refreshToken = r
      auth = jwt_decode(token)
    }
    if (!auth || new Date().getTime() > new Date(auth.exp * 1000).getTime()) {
      dispatch("refreshToken", refreshToken)
    }
    console.log("token: " + token)
    console.log("Refresh token: " + refreshToken)
    console.log("auth: " + JSON.stringify(auth))
    if (auth.role === 'employee') {
      this.$axios.$get('email/' + auth.username)
      .then(res => {
        console.log("employee: " + JSON.stringify(res))
        commit('setEmployee', res)
      }).catch(err => {
        console.log(err)
      })
    }
    commit('setToken', token)
    commit('setRefreshToken', refreshToken)
    commit("setAuth", auth)
  },
  refreshToken({ commit }, rt) {
    console.log("Refresh token: " + rt)
    this.$axios.setToken(rt, "Bearer")
    this.$axios.$get('refreshtoken')
    .then(res => {
      if (process.server) {
        // server-side: store new tokens in cookie
        Cookie.set('token', res.token)  // session cookie
        Cookie.set('refresh', res.refreshToken)  // session cookie
      } else {
        // client-side: store new tokens in localStorage
        localStorage.setItem("token", res.token)
        localStorage.setItem("refresh", res.refreshToken)
      }
      commit("setToken", res.token)
      let token = jwt_decode(res.token)
      commit("setAuth", token)
    }).catch(err => {
      console.log(err)
    })
  },
  setEmployee ({ commit }, employee) {
    commit('setEmployee', employee)
  },
  setToken ({ commit }, token) {
    commit('setToken', token)
  },
  setAuth ({ commit }, auth) {
    commit('setAuth', auth)
  },
  logout ({ commit }) {
    commit('logout')
  },
  setE2R ({ commit }, e2r) {
    commit('setE2R', e2r)
  }
}

export const getters = {
  isAuthenticated (state) {
    return state.auth !==  null
  }
}
