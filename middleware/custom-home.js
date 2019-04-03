export default function(context) {
  console.log("[Middleware] custom-home")
  if (context.store.getters.isAuthenticated) {
    console.log("[Middleware] custom home: auth ok")
    console.log(`[Middleware] custom home: auth ${JSON.stringify(context.store.state.auth)}`)
    console.log(`[Middleware] custom home: employee ${JSON.stringify(context.store.state.employee)}`)
    if (context.store.state.auth.role === "employee") {
      context.redirect(`/employee/${context.store.state.employee.id}`)
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
