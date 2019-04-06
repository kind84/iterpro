export default function(context) {
  console.log("[Middleware] custom-home")
  if (context.store.getters.isAuthenticated) {
    console.log("[Middleware] custom home: auth ok")
    if (context.store.state.auth.role === "employee") {
      context.redirect(`/employee`)
      return
    }
    if (context.store.state.auth.role === "operator") {
      context.redirect('/operator')
      return
    }
    console.log("[Middleware] custom home: no redirect")
  } else {
    console.log("[Middleware] custom home: no auth")
  }
}
