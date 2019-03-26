<template>
  <section class="container">
    <h1 v-if="!isOperator && !isEmployee">Welcome, please login or signup</h1>
    <EmployeeHome
      v-if="isEmployee"
      :employee="employee"/>
    <OperatorHome
      v-if="isOperator"
      :employees="employees"/>
  </section>
</template>

<script>
import EmployeeHome from '~/components/EmployeeHome.vue'
import OperatorHome from '~/components/OperatorHome.vue'

export default {
  middlewares: ['check-auth'],
  components: {
    EmployeeHome,
    OperatorHome
  },
  async asyncData({ $axios, store }) {
    const employees = await $axios.$get("employees")
    let employee  = null
    if (store.state.auth) {
      employee = await $axios.$get("email/" + store.state.auth.username)
    }
    return { employees, employee }
  },
  computed: {
    isOperator() {
      return this.$store.getters.isAuthenticated && this.$store.state.auth.role === 'operator'
    },
    isEmployee() {
      return this.$store.getters.isAuthenticated && this.$store.state.auth.role === 'employee'
    }
  }
}
</script>

<style>
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
