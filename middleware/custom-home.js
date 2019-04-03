export default function(context) {
  console.log("custom home")
  if (context.store.getters.isAuthenticated) {
    if (context.store.state.auth.role === "employee") {
      context.redirect('/employee')
    }
    if (context.store.state.auth.role === "operator") {
      context.redirect('/operator')
    }
  }
}
