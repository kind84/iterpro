<template>
  <div>
    <p>First Name: {{ employee.firstName }}</p>
    <p>Last Name: {{ employee.lastName }}</p>
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
  props: {
    employee: {
      type: Object,
      required: true
    }
  },
  async asyncData({ $axios }) {
    const reviews = await $axios.get("http://localhost:8080/reviews/"+this.employee.id)
    return { reviews }
  }
}
</script>
