<template>
  <div>
    <v-alert
      v-if="error"
      type="error"
    >
      {{ error }}
    </v-alert>
    <v-form
      class="my-2"
      @submit.prevent="signUp"
    >
      <v-text-field
        v-model="name"
        class="my-1"
        label="Name"
        autocomplete="off"
        outlined
        :error-messages="nameErrors"
        @blur="$v.name.$touch()"
      />
      <v-text-field
        v-model="email"
        class="my-1"
        label="Email"
        autocomplete="off"
        outlined
        :error-messages="emailErrors"
        @blur="$v.email.$touch()"
      />
      <v-text-field
        v-model="password"
        class="my-1"
        label="Password"
        autocomplete="off"
        outlined
        :error-messages="passwordErrors"
        :append-icon="showPassword ? 'mdi-eye': 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        @blur="$v.password.$touch()"
        @click:append="showPassword = !showPassword"
      />
      <v-text-field
        v-model="passwordConfirmation"
        class="my-1"
        label="Confirm Password"
        autocomplete="off"
        outlined
        :append-icon="showPasswordConfirmation ? 'mdi-eye': 'mdi-eye-off'"
        :type="showPasswordConfirmation ? 'text' : 'password'"
        :error-messages="passwordConfirmationErrors"
        @blur="$v.passwordConfirmation.$touch()"
        @click:append="showPasswordConfirmation = !showPasswordConfirmation"
      />
      <v-btn
        block
        x-large
        outlined
        rounded
        color="primary"
        type="submit"
        :loading="saving"
      >
        <v-icon left>
          mdi-email
        </v-icon>
        Sign Up
      </v-btn>
    </v-form>
  </div>
</template>
<script>
import { email, minLength, required, sameAs } from 'vuelidate/lib/validators'

import firebaseAuth from '@/services/auth'
import httpException from '@/mixins/http-exception'

export default {
  mixins: [httpException],
  data () {
    return {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      showPassword: false,
      showPasswordConfirmation: false,
      saving: false,
      error: null
    }
  },
  computed: {
    /**
     * Error messages for name.
     *
     */
    nameErrors () {
      const errors = []

      if (!this.$v.name.$dirty) return errors

      this.$v.name.required || errors.push('Name is required.')

      return errors
    },

    /**
     * Error messages for email.
     *
     */
    emailErrors () {
      const errors = []

      if (!this.$v.email.$dirty) return errors

      this.$v.email.email || errors.push('Must be a valid email.')
      this.$v.email.required || errors.push('Email is required.')

      return errors
    },

    /**
     * Error messages for password.
     *
     */
    passwordErrors () {
      const errors = []

      if (!this.$v.password.$dirty) return errors

      this.$v.password.minLength || errors.push('Password must contain at least 8 characters.')
      this.$v.password.required || errors.push('Password is required.')

      return errors
    },

    /**
     * Error messages for passwordConfirmation.
     *
     */
    passwordConfirmationErrors () {
      const errors = []

      if (!this.$v.passwordConfirmation.$dirty) return errors

      this.$v.passwordConfirmation.required || errors.push('Confirm password is required.')
      this.$v.passwordConfirmation.sameAs || errors.push('Passwords does not match.')

      return errors
    }
  },
  methods: {
    /**
     * Sign up with a new account.
     *
     */
    async signUp () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.saving = true

        if (await this.firebaseSignUp()) await this.updateProfile()

        this.saving = false
      }
    },

    /**
     * Create user account in firebase using email and password.
     *
     */
    firebaseSignUp () {
      return firebaseAuth.createUserWithEmailAndPassword(this.email, this.password)
        .then(() => true)
        .catch((error) => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              this.error = 'Email already in use.'
              break

            default:
              this.serverError()
              break
          }
        })
    },

    /**
     * Update the profile displayName
     *
     */
    updateProfile () {
      const payload = {
        displayName: this.name
      }

      return firebaseAuth.currentUser.updateProfile(payload)
        .then(() => {
          const intent = sessionStorage.getItem('intent')

          this.$router.replace(intent || '/')
        })
        .catch(() => this.serverError())
    }
  },
  validations: {
    /**
     * Validation rules for name.
     *
     */
    name: {
      required
    },

    /**
     * Validation rules for email.
     *
     */
    email: {
      email,
      required
    },

    /**
     * Validation rules for password.
     *
     */
    password: {
      minLength: minLength(8),
      required
    },

    /**
     * Validation rules for password confirmation.
     *
     */
    passwordConfirmation: {
      required,
      sameAs: sameAs('password')
    }
  }
}
</script>
