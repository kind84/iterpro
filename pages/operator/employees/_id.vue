<template>
  <div
    :key="reload"
    class="employee__container">
    <p><strong>First Name:</strong> {{ employee.firstName }}</p>
    <p><strong>Last Name:</strong> {{ employee.lastName }}</p>
    <ul
      v-if="reviews.length > 0"
      class="reviews-list">
      <strong>Reviews:</strong>
      <li
        v-for="(r, i) in reviews"
        :key="i"
        class="review">
        <p>{{ r.body }}</p>
        <p>Score: {{ r.score }}</p>
      </li>
    </ul>
    <br>
    <ul class="reviews-list">
      <strong>To review:</strong>
      <li
        v-for="eIIr in employee.employees2Review"
        :key="eIIr.id"
        class="review">{{ eIIr.firstName }} {{ eIIr.lastName }}</li>
    </ul>
    <br>
    <button @click="showDropdown = !showDropdown">Add to review</button>
    <select
      v-if="showDropdown && es2r"
      id="employees"
      v-model="e2r"
      name="employees">
      <option
        v-for="e in es2r"
        :key="e.id"
        :value="e">{{ e.firstName }} {{ e.lastName }}</option>
    </select>
    <button
      v-if="showDropdown"
      @click="setReview">Confirm</button>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, store, route }) {
    const employee = await $axios.$get("employee/" + route.params.id)
    if (store.state.employee == null) {
      store.dispatch("updateEmployee", route.params.id)
    }
    const employees = await $axios.$get("employees")
    const reviews = await $axios.$get("reviews/" + route.params.id)
    return { reviews, employee, employees }
  },
  data() {
    return {
      showDropdown: false,
      e2r: null,
      reload: false
    }
  },
  computed: {
    es2r() {
      let ids = this.$store.state.employee.employees2Review.map(x => { return x.id })
      return this.employees.filter(e => {
        return e.id !== this.$store.state.employee.id && !ids.includes(e.id)
      })
    }
  },
  methods: {
    setReview() {
      this.$axios.$post("set2review", {
        toReview: this.e2r.id,
        reviewer: this.employee.id
      }).then(res => {
        console.log(res)
        this.$store.dispatch("updateEmployee", this.employee.id)
        this.reload = true
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.employee__container {
  width: 20rem;
  margin: 1rem;
}

.reviews-list {
  margin-top: 0.5rem;
  padding: 0;
}

.review {
  margin-top: 0.5rem;
  list-style: none;
  background-color: #90ffe5;
}
</style>
