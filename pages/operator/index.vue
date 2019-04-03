<template>
  <div class="operator-container">
    <h1>Employees</h1>
    <ul class="employees-list">
      <nuxt-link
        v-for="employee in employees"
        :key="employee.id"
        :to="`/operator/employees/${employee.id}`"
        tag="li"
        class="employee-item">{{ employee.firstName }} {{ employee.lastName }}</nuxt-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Operator",
  middleware: ['check-auth'],
  async asyncData({ $axios }) {
    const employees = await $axios.$get("employees")
    return { employees }
  },
  methods:{
    pushEmployee(e) {
      this.$store.dispatch('setEmployee', e),
      this.$router.push('/employees/'+e.id)
    }
  }
}
</script>

<style scoped>
.operator-container {
  margin: 1rem;
  width: 20rem;
}

.employees-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  padding: 0;
  margin: 0;
}

.employee-item {
  display: block;
  background-color: #90ffe5;
  width: 100%;
  text-decoration: none;
  color: black;
  margin-top: 1rem;
  text-align: start;
}

.employee-item:active,
.employee-item:hover {
  cursor: pointer;
  background-color: #60cab1;
}
</style>
