export default function (context) {
  console.log("auth")
  if (!context.store.getters.isAuthenticated) {
    context.redirect('/')
  }
}
