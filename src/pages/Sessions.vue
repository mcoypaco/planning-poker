<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-skeleton-loader
          v-if="showLoader"
          type="card"
        />
        <v-card
          v-else
          outlined
        >
          <v-card-title>Recent Sessions</v-card-title>
          <v-card-text>
            <p v-if="!sessions.length">
              Nothing to display
            </p>
            <v-list
              v-else
              three-line
            >
              <v-list-item
                v-for="(session, index) in sessions"
                :key="index"
              >
                <v-list-item-content @click="sessionLink(session.id)">
                  <v-list-item-title>
                    {{ session.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ session.deck.name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Last updated: <span v-if="session.updated_at">{{ session.updated_at.toDate() | moment('from', now) }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon
                        v-on="on"
                        @click="deleteSessionConfirmation(session)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Delete Session</span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

import auth from '@/services/auth'
import db from '@/services/db'
import httpException from '@/mixins/http-exception'

export default {
  mixins: [httpException],
  data () {
    return {
      sessions: [],
      now: new Date(),
      loaded: false
    }
  },
  computed: {
    /**
     * Show loading
     *
     */
    showLoader () {
      return !auth.currentUser || !this.loaded
    },

    /**
     * Firebase sessions reference
     *
     */
    sessionsRef () {
      return db.collection('sessions')
    }
  },
  created () {
    this.init()

    setInterval(() => {
      this.now = new Date()
    }, 1000)
  },
  methods: {
    ...mapActions('dialog', ['openConfirmationDialog']),
    ...mapActions('snackbar', ['showSnackbar']),

    async init () {
      this.sessions = await this.getUserSessions()

      this.loaded = true
    },
    /**
     * Get user sessions from firebase
     *
     */
    getUserSessions () {
      return this.sessionsRef
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
     * Delete session
     *
     */
    deleteSessionConfirmation (session) {
      this.openConfirmationDialog({
        title: 'Delete Session',
        body: 'Are you sure you want to remove this session?',
        actionLabel: 'Remove',
        cancelLabel: 'Cancel',
        action: async () => {
          this.loaded = false

          await this.sessionsRef.doc(session.id)
            .delete()
            .then(() => this.showSnackbar({ message: 'Session deleted' }))
            .catch(() => this.serverError())

          this.init()
        }
      })
    },

    /**
     * Return the session link
     *
     */
    sessionLink (id) {
      this.$router.push({ name: 'Session', params: { id } })
    }
  }
}
</script>
<style scoped>
  .v-list-item__content {
    cursor: pointer !important;
  }
</style>
