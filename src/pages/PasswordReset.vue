<template>
  <div>
    <v-form
      class="my-2"
      @submit.prevent="send"
    >
      <v-text-field
        v-model="email"
        label="Email"
        autocomplete="off"
        outlined
        :error-messages="emailErrors"
        @blur="$v.email.$touch()"
      />
      <v-btn
        block
        outlined
        rounded
        x-large
        color="primary"
        type="submit"
        :loading="sending"
      >
        Send Password Reset Link
      </v-btn>
    </v-form>
  </div>
</template>
<script>
import { email, required } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

import firebaseAuth from '@/services/auth'
import httpException from '@/mixins/http-exception'

export default {
  mixins: [httpException],
  data () {
    return {
      email: '',
      sending: false
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
    }
  },
  methods: {
    ...mapActions('snackbar', ['showSnackbar']),

    /**
     * Send a password reset link.
     *
     */
    async send () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.sending = true

        await this.firebaseSendPasswordResetEmail()

        this.sending = false

        this.$router.replace('/login')
      }
    },

    /**
     * Send a password reset link using firebase.
     *
     */
    firebaseSendPasswordResetEmail () {
      return firebaseAuth.sendPasswordResetEmail(this.email)
        .then(() => this.showSnackbar({ message: 'Password reset link was sent to your email.' }))
        .catch(() => this.serverError())
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
    }
  }
}
</script>
