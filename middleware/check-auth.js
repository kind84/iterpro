export default function(context) {
  console.log("[Middleware] check-auth")
  context.store.dispatch("initAuth", context.req)
  // client-side sync local storage
  if (!context.req && context.store.state.token !== null && context.store.state.refreshToken !== null) {
    localStorage.setItem("token", context.store.state.token)
    localStorage.setItem("refresh", context.store.state.refreshToken)
  }
}
