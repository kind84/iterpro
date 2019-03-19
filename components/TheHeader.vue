<template>
  <ul class="main-nav">
    <nuxt-link
      :to="'/'"
      class="nav-item">Home</nuxt-link>
    <nuxt-link
      :to="'/login'"
      class="nav-item">Login</nuxt-link>
    <nuxt-link
      :to="'/signup'"
      class="nav-item">Signup</nuxt-link>
  </ul>
</template>

<style scoped>
  .main-nav {
    position: fixed;
    top: 0;
    left: 0;
    height: 3rem;
    background-color: #35495e;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .nav-item {
    display: block;
    color: white;
    margin: 0 2rem;
    text-decoration: none;
  }
</style>
