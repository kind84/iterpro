import Cookie from 'js-cookie'

export default ({ $axios }) => {
  console.log("Auth plugin")
  if (Cookie.get('refresh') != null) {
    return
  }

  if (process.server) {
    console.log("Auth server")
    return
  }

  console.log("Auth client")
  $axios.onRequest(config => {
    // Get token from local storage
    const token = localStorage.getItem("refresh")

    // Update token axios header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  })
}
