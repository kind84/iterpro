<template>
  <div class="employee-container">
    <h1>Feedback to send:</h1>
    <ul class="feedback-list">
      <nuxt-link
        v-for="e2r in employee.employees2Review"
        :key="e2r.id"
        :to="`/employee/feedback/${e2r.id}`"
        tag="li"
        class="feedback-item">{{ e2r.firstName }} {{ e2r.lastName }}
      </nuxt-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Employee",
  middleware: ['check-auth', 'auth'],
  async asyncData({ $axios, store }) {
    const employee = await $axios.$get(`email/${store.state.auth.username}`)
    return { employee }
  }
}
</script>

<style scoped>
.employee-container {
  margin: 1rem;
  width: 20rem;
}

.feedback-list {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.feedback-item {
  display: block;
  background-color: #90ffe5;
  width: 100%;
  text-decoration: none;
  color: black;
  margin-top: 1rem;
  text-align: start;
}

.feedback-item:hover,
.feedback-item:active {
  background-color: #60cab1;
  cursor: pointer;
}
</style>

