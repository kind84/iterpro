<template>
  <div>
    <h1>Feedback to send:</h1>
    <ul class="feedback-list">
      <nuxt-link
        v-for="(e2r, index) in employee.employees2Review"
        :to="'/feedback/' + e2r.id"
        :key="index"
        class="feedback-item"
        @click.native="onFeedback(e2r)">{{ e2r.firstName }} {{ e2r.lastName }}
      </nuxt-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Employee",
  props: {
    employee: {
      type: Object,
      required: true
    }
  },
  methods: {
    onFeedback(e2r) {
      this.$store.dispatch('setE2R', e2r)
    }
  }
}
</script>

<style scoped>
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
}
</style>

