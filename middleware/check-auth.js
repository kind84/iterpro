export default function(context) {
  console.log("check auth")
  context.store.dispatch("initAuth", context.req)
  if (!context.req && context.store.state.token !== null && context.store.state.refreshToken !== null) {
    localStorage.setItem("token", context.store.state.token)
    localStorage.setItem("refresh", context.store.state.refreshToken)
  }
}
