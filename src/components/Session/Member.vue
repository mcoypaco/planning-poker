<template>
  <v-card outlined>
    <v-card-title>{{ session.name }}</v-card-title>
    <v-card-text>
      <p v-if="!session.started_at">
        Waiting for host to start the session.
      </p>
      <div v-else>
        <p>
          <span v-if="!selected">Click on a card to vote.</span>
          <span v-else>Click on selected card to remove vote.</span>
        </p>
        <v-item-group v-model="selected">
          <v-row
            wrap
          >
            <v-col
              v-for="(card, index) in session.deck.cards"
              :key="index"
              cols="6"
              sm="4"
            >
              <v-item v-slot:default="{ active, toggle }">
                <v-card
                  outlined
                  :color="active ? 'primary' : ''"
                  @click="toggle"
                >
                  <v-card-text>
                    <v-icon
                      v-if="isFibonacci && icon(card)"
                      large
                    >
                      {{ icon(card) }}
                    </v-icon>
                    <span
                      v-if="!icon(card)"
                      class="display-1"
                    >
                      {{ card }}
                    </span>
                  </v-card-text>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import firebase from 'firebase/app'
import { mapState, mapActions } from 'vuex'
import debounce from 'lodash/debounce'
import head from 'lodash/head'

import auth from '@/services/auth'
import db from '@/services/db'
import httpException from '@/mixins/http-exception'

export default {
  mixins: [httpException],
  data () {
    return {
      selected: null
    }
  },
  computed: {
    ...mapState('session', ['session', 'member']),

    /**
     * Firebase members collection reference
     *
     */
    membersRef () {
      return db.collection(`sessions/${this.$route.params.id}/members`)
    },

    /**
     * Check if session deck is fibonacci.
     *
     */
    isFibonacci () {
      if (!this.session) return false

      return this.session.deck.name === 'Fibonacci'
    }
  },
  watch: {
    selected: debounce(function () {
      this.vote()
    }, 2000),

    member: {
      handler () {
        if (this.member.vote) {
          this.selected = this.session.deck.cards.indexOf(this.member.vote)
        } else {
          this.selected = null
        }
      }
    }
  },
  mounted () {
    this.memberJoined()
  },
  methods: {
    ...mapActions('session', ['setMember']),

    /**
     * Set the icon from card value.
     *
     */
    icon (card) {
      let icon

      switch (card) {
        case 'infinity':
          icon = 'mdi-infinity'
          break

        case 'coffee':
          icon = 'mdi-coffee'
          break

        default:
          icon = null
          break
      }

      return icon
    },

    /**
     * Member joined the session
     *
     */
    async memberJoined () {
      // Blocks call if user is host
      if (this.session.uid === auth.currentUser.uid) return

      const data = await this.checkMember()

      if (data.length) {
        this.setMember(head(data))

        return
      }

      const id = await this.createMember()

      if (id) this.setMember(await this.findMember(id))
    },

    /**
     * Check if user is already a member of the session.
     *
     */
    checkMember () {
      return this.membersRef
        .where('uid', '==', auth.currentUser.uid)
        .get()
        .then(querySnapshot => querySnapshot.docs.map(doc => {
          const data = doc.data()

          data.id = doc.id

          return data
        }))
        .catch(() => this.serverError())
    },

    /**
     * Create the member document
     *
     */
    createMember () {
      const payload = {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp()
      }

      return this.membersRef
        .add(payload)
        .then(docRef => docRef.id)
        .catch(() => this.serverError())
    },

    /**
     * Find the member by id
     *
     */
    findMember (id) {
      return this.membersRef
        .doc(id)
        .get()
        .then(snapshot => {
          const data = snapshot.data()

          data.id = snapshot.id

          return snapshot
        })
        .catch(() => this.serverError())
    },

    /**
     * Update the member's vote
     *
     */
    vote () {
      const payload = {
        vote: Number.isInteger(this.selected)
          ? this.session.deck.cards[this.selected]
          : firebase.firestore.FieldValue.delete(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp()
      }

      this.membersRef
        .doc(this.member.id)
        .update(payload)
        .catch(() => this.serverError())
    }
  }
}
</script>
