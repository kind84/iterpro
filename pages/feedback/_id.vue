<template>
  <div class="feedback-container">
    <h1>The Feedback Page</h1>
    <form
      class="feedback-form"
      @submit.prevent="onSubmit">
      <label for="feedback">Feedback for {{ employee.firstName }} {{ employee.lastName }}</label>
      <textarea
        id="feedback"
        v-model="feedback"
        name="feedback"
        rows="10" />
      <label for="feedback">Score</label>
      <input
        id="score"
        v-model="score"
        type="number">
      <button>Send</button>
    </form>
  </div>
</template>

<script>
export default {
  middleware: ['check-auth', 'auth'],
  data() {
    return {
      feedback: "",
      score: 0
    }
  },
  computed: {
    employee() {
      return this.$store.state.e2r
    }
  },
  methods: {
    onSubmit() {
      this.$axios.setToken(localStorage.getItem("token"), "Bearer")
      this.$axios.$post('sendfeedback', {
        authorID: this.$store.state.employee.id,
        reviewedID: this.employee.id,
        body: this.feedback,
        score: +this.score
      }).then(res => {
        console.log(res)
        this.$router.push('/')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.feedback-container {
  margin: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.feedback-form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 1rem;
}

button {
  margin-top: 2rem;
  height: 2rem;
  width: 6rem;
  align-self: center;
}

</style>
