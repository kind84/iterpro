<template>
  <div>
    <h1>Feedback to send:</h1>
    <ul>
      <li
        v-for="(e2r, index) in employee.employees2Review"
        :key="index">{{ e2r.firstName }} {{ e2r.lastName }}
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
  }
}
</script>
