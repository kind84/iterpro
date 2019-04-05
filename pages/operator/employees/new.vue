<template>
  <div class="new-employee__container">
    <h1>Add Employee</h1>
    <form
      class="new-employee-form"
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
        type="text"><span v-if="errors['lastName']">{{ errors['lastName'] }}</span>
      <label
        :class="{'error-msg': error !== null}"
        for="email">Email: </label>
      <input
        id="email"
        :style="style"
        v-model="email"
        :pattern="emailPattern">
      <button type="submit">Add</button>
    </form>
  </div>
</template>

<script>
export default {
  middleware: ['check-auth', 'auth'],
  data() {
    return {
      firstName: null,
      lastName: null,
      email: '',
      error: null,
      style: '',
      emailPattern: "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$",
      errors: {
        firstName: null,
        lastName: null,
        email: null,
      }
    }
  },
  methods: {
    checkErrors() {
      this.errors = {}

      if (this.firstName === "") {
        this.errors['firstName'] = 'First name required'
      }
      if (this.lastName === "") {
        this.errors['lastName'] = 'Last name required'
      }
    },
    onSubmit() {
      this.$axios.$post('addemployee', {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
      }).then(res => {
        console.log(res)
        this.$router.go(-1)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.new-employee__container {
  margin: 1rem;
}

.new-employee-form {
  margin-top: 1rem;
  display: grid;
  grid-template-areas: "label input flag";
  grid-template-columns: 6rem 2fr 2fr;
  grid-auto-rows: 1.5rem;
  grid-gap: 1rem;
  width: 80%;
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
