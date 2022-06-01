<template>
  <v-row justify="center">
    <v-col
      cols="12"
      sm="6"
    >
      <v-form @submit.prevent="create">
        <v-card outlined>
          <v-card-title>Create a Session</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="name"
              label="Session Name"
              autocomplete="off"
              outlined
              :error-messages="nameErrors"
              @blur="$v.name.$touch"
            />
            <v-select
              v-model="deck"
              label="Cards"
              item-text="name"
              outlined
              :items="decks"
              :return-object="true"
              :loading="!decks.length"
              :error-messages="deckErrors"
              @blur="$v.deck.$touch"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              outlined
              type="submit"
              :loading="saving"
            >
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import firebase from 'firebase/app'
import { required } from 'vuelidate/lib/validators'

import httpException from '@/mixins/http-exception'
import auth from '@/services/auth'
import db from '@/services/db'

export default {
  mixins: [httpException],
  data () {
    return {
      name: '',
      deck: null,
      decks: [],
      saving: false,
      id: null
    }
  },
  computed: {
    /**
     * Error messages for name
     *
     */
    nameErrors () {
      const errors = []

      if (!this.$v.name.$dirty) return errors

      this.$v.name.required || errors.push('Name is required')

      return errors
    },

    /**
     * Error messages for deck
     *
     */
    deckErrors () {
      const errors = []

      if (!this.$v.deck.$dirty) return errors

      this.$v.deck.required || errors.push('Deck is required')

      return errors
    }
  },
  methods: {
    /**
     * Create the session and redirect
     *
     */
    async create () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.saving = true

        const id = await this.createSession()

        if (id) this.$router.push({ name: 'Session', params: { id } })

        this.saving = false
      }
    },

    /**
     * Firebase create session
     *
     *
     */
    createSession () {
      const payload = {
        uid: auth.currentUser.uid,
        name: this.name,
        deck: this.deck,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp()
      }

      return db.collection('sessions')
        .add(payload)
        .then(docRef => docRef.id)
        .catch(() => this.serverError())
    }
  },
  firestore: {
    decks: db.collection('decks')
  },
  validations: {
    /**
     * Validation rules for name
     *
     */
    name: { required },

    /**
     * Validation rules for deck
     *
     */
    deck: { required }
  }
}
</script>
