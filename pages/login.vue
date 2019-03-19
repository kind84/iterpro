<template>
  <div>
    <h1>The Login Page</h1>
    <nuxt-link
      :to="'/'">Back</nuxt-link>
    <div>Login</div>
  </div>
</template>

<script>
export default {
  layout: 'admin'
}
</script>

<style>
h1 {
  color: black;
}
</style>

