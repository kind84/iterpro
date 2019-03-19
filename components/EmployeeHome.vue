<template>
  <div>
    <h1>Feedback to send:</h1>
    <ul>
      <nuxt-link
        :to="'/feedback/' + feedback"
        v-for="(feedback, index) in feedbacks"
        :key="index">{{feedback}}</nuxt-link>
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, $route }) {
    const feedbacks = await $axios.get("http://localhost:8080/tobereviewed/")
    return { feedbacks }
  }
}
</script>
