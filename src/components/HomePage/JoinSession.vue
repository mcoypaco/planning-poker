<template>
  <v-row justify="center">
    <v-col
      cols="12"
      sm="6"
    >
      <v-form @submit.prevent="join">
        <v-card outlined>
          <v-card-title>Join a Session</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="id"
              label="Session ID"
              autocomplete="off"
              outlined
              :error-messages="idErrors"
              @blur="$v.id.$touch()"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              outlined
              type="submit"
            >
              Join
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>
<script>
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      id: null
    }
  },
  computed: {
    /**
     * Error messages for session id
     *
     */
    idErrors () {
      const errors = []

      if (!this.$v.id.$dirty) return

      this.$v.id.required || errors.push('Session ID is required')

      return errors
    }
  },
  methods: {
    /**
     * Join a session
     *
     */
    join () {
      this.$v.$touch()

      if (!this.$v.$invalid) this.$router.replace(`/sessions/${this.id}`)
    }
  },
  validations: {
    /**
     * Validation rules for id
     *
     */
    id: { required }
  }
}
</script>
