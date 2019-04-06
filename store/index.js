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
    console.log(`[setToken] ${JSON.stringify(token)}`)
    state.token = token
  },
  setRefreshToken (state, token) {
    console.log(`[setRefreshToken] ${JSON.stringify(token)}`)
    state.refreshToken = token
  },
  setAuth (state, auth) {
    console.log(`[setAuth] ${JSON.stringify(auth)}`)
    state.auth = auth
  },
  setEmployee (state, employee) {
    console.log(`[setEmployee] ${JSON.stringify(employee)}`)
    state.employee = employee
  },
  logout (state) {
    console.log("[logout]")
    state.auth = null
    state.token = null
    state.refreshToken = null
  },
  setE2R (state, e2r) {
    state.e2r = e2r
  }
}

export const actions = {
  nuxtServerInit({ commit, dispatch }, { req }) {
    console.log("[nuxtServerInit]")
    let auth = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        if (parsed.token) {  // same session
          auth = jwt_decode(parsed.token)
          if (!auth || new Date().getTime() > new Date(auth.exp * 1000).getTime()) {
            dispatch("refreshToken", parsed.refresh)
            return
          } else {
            commit('setToken', parsed.token)
            commit('setAuth', auth)
          }
        } else if (parsed.refresh) {  // new session
          dispatch("refreshToken", parsed.refresh)
          commit('setRefreshToken', parsed.refresh)
          return
        }
      } catch (err) {
        console.log("unable to parse token: " + err)
      }
    }
  },
  initAuth ({ commit, dispatch }, req) {
    console.log("[initAuth]")
    let auth = null
    let token = null
    let refreshToken = null
    if (req) {  // server-side
      console.log(`[initAuth] req: ${req.headers.cookie}`)
      if(!req.headers.cookie) {
        commit("logout")
        return
      }
      const parsed = cookieparser.parse(req.headers.cookie)
      if (!parsed || ( !parsed.token && !parsed.refresh)) {
        commit("logout")
        return
      }
      if (parsed.token) {  // same session
        token = parsed.token
        auth = jwt_decode(parsed.token)
      }
      refreshToken = parsed.refresh
    } else {  // client-side
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
      // new session
      dispatch("refreshToken", refreshToken)
    }
    console.log(`[initAuth] token: ${token}`)
    console.log(`[initAuth] refresh token: ${refreshToken}`)
    console.log(`[initAuth] auth: ${JSON.stringify(auth)}`)
    if (auth && auth.role === 'employee') {
      this.$axios.$get(`email/${auth.username}`)
      .then(res => {
        console.log(`[initAuth] employee: ${JSON.stringify(res)}`)
        commit('setEmployee', res)
        if (token) {
          console.log("[initAuth] => setToken")
          commit('setToken', token)
          console.log("[initAuth] => setAuth")
          commit("setAuth", auth)
        }
        console.log("[initAuth] => setRefreshToken")
        commit('setRefreshToken', refreshToken)
      }).catch(err => {
        console.log(err)
      })
    } else {
      if (token) {
        console.log("[initAuth] => setToken")
        commit('setToken', token)
        console.log("[initAuth] => setAuth")
        commit("setAuth", auth)
      }
      console.log("[initAuth] => setRefreshToken")
      commit('setRefreshToken', refreshToken)
    }
  },
  refreshToken({ commit }, rt) {
    console.log(`[refreshToken] rt: ${rt}`)
    this.$axios.setToken(rt, "Bearer")
    this.$axios.$get('refreshtoken')
    .then(res => {
      if (process.client) {
        rt = jwt_decode(res.refreshToken)
        console.log(`[refreshToken] token: ${JSON.stringify(res.token)}`)
        console.log(`[refreshToken] refresh: ${JSON.stringify(rt)}`)
        // store new tokens in cookie
        Cookie.set('token', res.token)  // session cookie
        Cookie.set('refresh', res.refreshToken, { expires: new Date(rt.exp * 1000)})  // expiring cookie
        // store new tokens in localStorage
        localStorage.setItem("token", res.token)
        localStorage.setItem("refresh", res.refreshToken)
      }
      console.log("[refreshToken] => setToken")
      commit("setToken", res.token)
      console.log("[refreshToken] => setRefreshToken")
      commit("setRefreshToken", res.refreshToken)
      let token = jwt_decode(res.token)
      console.log("[refreshToken] => setAuth")
      commit("setAuth", token)
    }).catch(err => {
      console.log(err)
    })
  },
  setEmployee ({ commit }, employee) {
    commit('setEmployee', employee)
  },
  updateEmployee ({ commit }, id) {
    console.log(`[Store action] updateEmployee - id: ${id}`)
    this.$axios.$get("employee/" + id)
    .then(res => {
      commit('setEmployee', res)
    }).catch(err => {
      console.log(err)
    })
  },
  setToken ({ commit }, token) {
    commit('setToken', token)
  },
  setRefreshToken ({ commit }, token) {
    commit('setRefreshToken', token)
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
