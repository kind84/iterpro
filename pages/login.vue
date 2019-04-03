<template>
  <div>
    <h1>The Login Page</h1>
    <form
      class="login-form"
      @submit.prevent="onSubmit">
      <label for="email">Email: </label>
      <input
        id="email"
        v-model="email"
        type="email">
      <label for="password">Password: </label>
      <input
        id="password"
        v-model="password"
        type="password">
      <button type="submit">Login</button>
    </form>
    <p
      v-if="error"
      class="error-msg">{{ error }}</p>
    <nuxt-link
      :to="'/'">Back</nuxt-link>
  </div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
import jwt_decode from 'jwt-decode'

export default {
  layout: 'admin',
  data() {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    onSubmit() {
      this.$axios.$post('login', {
        email: this.email,
        password: this.password
      }).then(res => {
        this.$store.dispatch("setToken", res.token)
        this.$store.dispatch("setRefreshToken", res.refreshToken)
        let token = jwt_decode(res.token)
        let rt = jwt_decode(res.refreshToken)
        this.$store.dispatch("setAuth", token)
        localStorage.setItem("token", res.token)
        localStorage.setItem("refresh", res.refreshToken)
        Cookie.set('token', res.token)  // session cookie
        Cookie.set('refresh', res.refreshToken, { expires: new Date(rt.exp * 1000)})  // expiring cookie
        this.$router.go(-1)
      }).catch(err => {
          console.log(err)
        if (err.response && err.response.status === 401) {
            this.error = "Invalid username or password"
        }
      })
    }
    // async login() {
    //   this.error = null
    //   return this.$auth.loginWith('local', {
    //     data: {
    //       email: this.email,
    //         password: this.password
    //       }
    //     })
    //     .catch(e => {
    //       this.error = e + ''
    //     })
    // }
  }
}
</script>

<style scoped>
h1 {
  color: black;
}

.login-form {
  margin-top: 1rem;
  display: grid;
  grid-template-areas: "label input flag";
  grid-template-columns: 1fr 2fr 1fr;
  grid-auto-rows: 1.5rem;
  grid-gap: 1rem;
  width: 50%;
}

label {
  grid-column: label;
}

input {
  grid-column: input;
}

button {
  grid-column: input;
  width: 6rem;
  height: 2rem;
}

.error-msg {
  color: red;
}
</style>

