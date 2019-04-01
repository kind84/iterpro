<template>
  <div>
    <h1>The Signup Page</h1>
    <form
      class="signup-form"
      @input="checkErrors"
      @submit.prevent="onSubmit">
      <label for="firstname">First Name: </label>
      <input
        id="firstname"
        v-model="firstName"
        type="text"><span v-if="errors['firstName']">{{ errors['firstName'] }}</span>
      <label for="lastname">Last Name: </label>
      <input
        id="lastname"
        v-model="lastName"
        type="text">
      <label
        :class="{'error-msg': error !== null}"
        for="email">Email: </label>
      <input
        id="email"
        :style="style"
        v-model.lazy="email"
        :pattern="emailPattern">
      <div
        v-if="available"
        class="available">✔️</div>
      <label for="password">Password: </label>
      <input
        id="password"
        v-model="password"
        type="password">
      <label for="role">Role: </label>
      <select
        id="role"
        v-model="role"
        name="role">
        <option value="employee">Employee</option>
        <option value="operator">Operator</option>
      </select>
      <button type="submit">Signup</button>
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
      firstName: null,
      lastName: null,
      email: '',
      password: '',
      role: '',
      error: null,
      available: null,
      style: '',
      emailPattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$",
      errors: {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
      }
    }
  },
  watch: {
    email() {
      if (this.email && this.email !== '') {
        this.$axios.post('username', { username: this.email })
        .then(() => {
          this.available = true
          this.error = null
          this.style = ''
        }).catch(err => {
          console.log("error")
          if (err && err.response.status === 403) {
            this.error = err.response.data
            this.style = "border-color: red"
            this.available = false
          }
        })
      } else {
        this.error = null
        this.available = false
        this.style = ''
      }
    }
  },
  methods: {
    checkErrors() {
      this.errors = {}

      if (this.firstName === "") {
        this.errors['firstName'] = 'First name required'
        return
      }
      if (this.lastName === "") {
        this.errors['lastName'] = 'Last name required'
        return
      }
    },
    onSubmit() {
      this.$axios.$post('signup', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        role: this.role
      }).then(res => {
        console.log(res)
        this.$store.dispatch("setToken", res.token)
        let token = jwt_decode(res.token)
        this.$store.dispatch('setAuth', token)
        localStorage.setItem("token", res.token)
        localStorage.setItem("refresh", res.refreshToken)
        Cookie.set('token', res.token)  // session cookie
        Cookie.set('refresh', res.refreshToken)  // session cookie
        this.$router.push('/')
      }).catch(err => {
        console.log(err)
        if (err.response.status === 403) {
          this.error = err.response.data
          this.style = "border-color: red"
          this.available = false
        }
      })
    }
  }
}
</script>

<style scoped>
h1 {
  color: black;
}

.signup-form {
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

select {
  grid-column: input;
}

button {
  grid-column: input;
  width: 6rem;
  height: 2rem;
}

.available {
  grid-column: flag;
}

.error-msg {
  color: red;
}
</style>

