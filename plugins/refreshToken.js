import Cookie from 'js-cookie'
import jwt_decode from 'jwt-decode'

export default ({ $axios, store }) => {
  console.log("[Plugin] refreshToken")

  $axios.onRequest(config => {
    // Get token from header
    let headers = JSON.stringify(config.headers)
    console.log(`[Plugin] headers: ${headers}`)
    let bearer = config.headers.common['Authorization']
    console.log(`[Plugin] bearer: ${bearer}`)
    if (!bearer) {
      return
    }
    let token = bearer.split(" ")[1]

    let auth = jwt_decode(token)
    if (!auth || new Date().getTime() > new Date(auth.exp * 1000).getTime()) {
      let rt = store.state.refreshToken
      $axios.setToken(rt, "Bearer")
      return $axios.$get('refreshtoken')
      .then(res => {
        if (process.client) {
          rt = jwt_decode(res.refreshToken)
          console.log(`[plugin refreshToken] token: ${JSON.stringify(res.token)}`)
          console.log(`[plugin refreshToken] refresh: ${JSON.stringify(rt)}`)
          // store new tokens in cookie
          Cookie.set('token', res.token)  // session cookie
          Cookie.set('refresh', res.refreshToken, { expires: new Date(rt.exp * 1000)})  // expiring cookie
          // store new tokens in localStorage
          localStorage.setItem("token", res.token)
          localStorage.setItem("refresh", res.refreshToken)
        }
        console.log("[plugin refreshToken] => setToken")
        store.dispatch("setToken", res.token)
        console.log("[plugin refreshToken] => setRefreshToken")
        store.dispatch("setRefreshToken", res.refreshToken)
        auth = jwt_decode(res.token)
        console.log("[plugin refreshToken] => setAuth")
        store.dispatch("setAuth", auth)
        console.log(`[Plugin] final token: ${res.token}`)
        $axios.setToken(res.token, "Bearer")
        token = res.token
        config.headers.common['Authorization'] = `Bearer ${token}`
        console.log(`[Plugin] config: ${JSON.stringify(config)}`)
        return config
      }).catch(err => {
        console.log(err)
      })
    }
  }, error => {
    return Promise.reject(error)
  })
}
