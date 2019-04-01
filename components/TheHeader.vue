<template>
  <ul
    :key="logged"
    class="main-nav">
    <nuxt-link
      :to="'/'"
      class="nav-item">Home</nuxt-link>
    <li
      v-if="logged"
      class="nav-item"
      @click="logout">Logout</li>
    <div
      v-else
      class="guest-nav">
      <nuxt-link
        :to="'/login'"
        class="nav-item">Login</nuxt-link>
      <nuxt-link
        :to="'/signup'"
        class="nav-item">Signup</nuxt-link>
    </div>
  </ul>
</template>

<script>
import Cookie from 'js-cookie'

export default {
  computed: {
    logged() {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
      localStorage.removeItem('token')
      localStorage.removeItem('refresh')
      Cookie.remove('token')
      Cookie.remove('refresh')
      this.$router.push('/')
    }
  }
}
</script>


<style scoped>
  .main-nav {
    height: 3rem;
    grid-area: header;
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

  .nav-item:hover,
  .nav-item:active {
    cursor: pointer;
    color: #90ffe5
  }

  .guest-nav {
    display: flex;
    flex-direction: row;
  }
</style>
