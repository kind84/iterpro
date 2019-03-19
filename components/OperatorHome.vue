<template>
  <div>
    <ul class="employees-list">
      <nuxt-link
        v-for="(employee, index) in employees"
        :to="'/'+employee.id"
        :key="index" />
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const employees = await $axios.get("http://localhost:8080/employees")
    return { employees }
  }
}
</script>
