<template>
  <div class="feedback-container">
    <h1>The Feedback Page</h1>
    <form class="feedback-form">
      <label for="feedback">Feedback</label>
      <textarea
        id="feedback"
        :value="feedback"
        name="feedback"
        rows="10" />
      <label for="feedback">Score</label>
      <input
        id="score"
        :value="score"
        type="number">
      <button>Send</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedback: "",
      score: 0
    }
  }
}
</script>

<style scoped>
.feedback-container {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
