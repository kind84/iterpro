<template>
  <div class="operator-container">
    <h1>Employees</h1>
    <ul class="employees-list">
      <li
        v-for="(employee, index) in employees"
        :key="index"
        class="employee-item"
        @click="pushEmployee(employee)">{{ employee.firstName }} {{ employee.lastName }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    employees: {
      type: Array,
      required: true
    }
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
