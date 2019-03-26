<template>
  <div class="employee__container">
    <p><strong>First Name:</strong> {{ employee.firstName }}</p>
    <p><strong>Last Name:</strong> {{ employee.lastName }}</p>
    <ul>
      <li
        v-for="(r, i) in reviews"
        :key="i">
        <p>{{ r.body }}</p>
        <p>Score: {{ r.score }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, store }) {
    const reviews = await $axios.$get("reviews/"+store.state.employee.id)
    return { reviews }
  },
  computed: {
    employee() {
      return this.$store.state.employee
    }
  }
}
</script>

<style scoped>
.employee__container {
  margin: 1rem;
}
</style>
