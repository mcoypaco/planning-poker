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
      @submit.prevent="login"
    >
      <v-text-field
        v-model="email"
        label="Email"
        autocomplete="off"
        outlined
        :error-messages="emailErrors"
        @blur="$v.email.$touch"
      />
      <v-text-field
        v-model="password"
        label="Password"
        autocomplete="off"
        outlined
        :append-icon="showPassword ? 'mdi-eye': 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        :error-messages="passwordErrors"
        @blur="$v.password.$touch"
        @click:append="showPassword = !showPassword"
      />
      <v-row>
        <v-col>
          <v-btn
            block
            x-large
            rounded
            outlined
            to="/sign-up"
          >
            <v-icon left>
              mdi-email
            </v-icon>
            Sign Up
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            block
            x-large
            rounded
            outlined
            color="primary"
            :loading="loading"
            type="submit"
          >
            <v-icon left>
              mdi-login
            </v-icon>
            Login
          </v-btn>
        </v-col>
      </v-row>
      <v-btn
        block
        class="text-none"
        color="primary"
        rounded
        text
        to="/password-reset"
      >
        Forgot password?
      </v-btn>
    </v-form>
    <p>or</p>
    <v-btn
      class="my-2"
      block
      x-large
      rounded
      color="primary"
      @click="googleSignIn"
    >
      <v-icon left>
        mdi-google
      </v-icon>
      Login With Google
    </v-btn>
  </div>
</template>
<script>
import { email, required } from 'vuelidate/lib/validators'

import firebaseAuth, { google } from '@/services/auth'

import httpException from '@/mixins/http-exception'

export default {
  mixins: [httpException],
  data () {
    return {
      email: '',
      password: '',
      loading: false,
      loadingGuest: false,
      error: null,
      showPassword: false
    }
  },
  computed: {
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

      this.$v.password.required || errors.push('Password is required.')

      return errors
    }
  },
  methods: {
    /**
     * Login the user.
     *
     */
    async login () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.loading = true

        await this.firebaseSignInWithEmailAndPassword()

        this.loading = false
      }
    },

    /**
     * Firebase sign in using email and password.
     *
     */
    firebaseSignInWithEmailAndPassword () {
      return firebaseAuth.signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          const intent = sessionStorage.getItem('intent')

          this.$router.replace(intent || '/')
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              this.error = 'The email or password is invalid.'

              break

            default:
              this.serverError()
              break
          }
        })
    },

    /**
     * Sign in using a google account
     *
     */
    async googleSignIn () {
      const user = await firebaseAuth.signInWithPopup(google)

      if (user) location.reload()
    }
  },
  validations: {
    /**
     * Validation rules for email
     *
     */
    email: {
      email,
      required
    },

    /**
     * Validation rules for password
     *
     */
    password: {
      required
    }
  }
}
</script>
