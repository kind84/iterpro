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
    <button
      v-if="es2r && es2r.length > 0"
      @click="showDropdown = !showDropdown">Add to review</button>
    <select
      v-if="showDropdown && es2r && es2r.length > 0"
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
    <button @click="deleteEmployee">Delete</button>
  </div>
</template>

<script>
export default {
  middleware: ['check-auth', 'auth'],
  async asyncData({ $axios, store, route }) {
    const employee = await $axios.$get(`employee/${route.params.id}`)
    // if (store.state.employee == null) {
    //   store.dispatch("updateEmployee", route.params.id)
    // }
    const employees = await $axios.$get("employees")
    const reviews = await $axios.$get(`reviews/${route.params.id}`)
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
      if (this.employee && this.employees) {
        let ids = ""
        if (this.employee.employees2Review) {
          ids = this.employee.employees2Review.map(x => { return x.id })
        }
        return this.employees.filter(e => {
          return e.id !== this.employee.id && !ids.includes(e.id)
        })
      }
    }
  },
  methods: {
    setReview() {
      let token = localStorage.getItem("token")
      console.log(`[Component setReview] token: ${token}`)
      this.$axios.setToken(token, "Bearer")
      this.$axios.$post("set2review", {
        toReview: this.e2r.id,
        reviewer: this.employee.id
      }).then(res => {
        console.log(res)
        this.$axios.$get(`employee/${this.$route.params.id}`)
        .then(res => {
          this.employee = res
          // this.$forceUpdate()
        })
      }).catch(err => {
        console.log(err)
      })
    },
    deleteEmployee() {
      this.$axios.$post(`deleteemployee/${this.employee.id}`)
      .then(res => {
        console.log(res)
        this.$router.go(-1)
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
