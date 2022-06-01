<template>
  <div>
    <VoteResultDialog ref="dialog" />
    <v-card outlined>
      <v-card-title>
        {{ session.name }}
      </v-card-title>
      <v-card-text>
        <div v-if="!session.started_at">
          <p>Invite members to join your session.</p>
          <v-text-field
            id="link"
            outlined
            readonly
            label="Link"
            :value="link"
            append-icon="mdi-content-copy"
            @click:append="copy"
          />
        </div>
        <v-alert
          v-if="hasMembers && session.started_at"
          :type="allVoted ? 'success' : 'info'"
        >
          <span v-if="allVoted">All members have voted</span>
          <span v-else>Waiting for all members to vote</span>
        </v-alert>
        <p v-if="!hasMembers">
          Nothing to display
        </p>
        <div v-else>
          <v-subheader>Members</v-subheader>
          <v-list two-line>
            <v-list-item
              v-for="(member, index) in members"
              :key="index"
            >
              <v-list-item-avatar color="primary">
                <img
                  v-if="member.photoURL"
                  :src="member.photoURL"
                  alt="member.displayName"
                  @error="member.photoURL = null"
                >
                <span
                  v-if="member.displayName && !member.photoURL"
                  class="white--text headline"
                >{{ member.displayName | upperCaseFirstCharacter }}</span>
                <v-icon
                  v-if="!member.displayName && !member.photoURL"
                  class="white--text"
                >
                  mdi-account-circle
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ member.displayName }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="session.started_at">
                  Last updated: <span v-if="member.updated_at">{{ member.updated_at.toDate() | moment('from', now) }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-row align="center">
                  <v-col v-if="!member.vote && session.started_at">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on="on">
                          mdi-account-question
                        </v-icon>
                      </template>
                      <span>Waiting for vote</span>
                    </v-tooltip>
                  </v-col>
                  <v-col v-if="member.vote && session.started_at">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          color="primary"
                          v-on="on"
                        >
                          mdi-account-check
                        </v-icon>
                      </template>
                      <span>Voted</span>
                    </v-tooltip>
                  </v-col>
                  <v-col>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          icon
                          v-on="on"
                          @click="removeMemberConfirmation(member)"
                        >
                          <v-icon>mdi-account-remove</v-icon>
                        </v-btn>
                      </template>
                      <span>Remove Member</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
      <v-card-actions>
        <div v-if="session.started_at">
          <v-btn
            outlined
            class="mx-2 hidden-xs-only"
            :loading="ending"
            @click="sessionEnd"
          >
            End Session
          </v-btn>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                class="mx-2 hidden-sm-and-up"
                :loading="ending"
                @click="sessionEnd"
                v-on="on"
              >
                <v-icon>mdi-stop-circle</v-icon>
              </v-btn>
            </template>
            <span>End Session</span>
          </v-tooltip>
        </div>
        <v-spacer />
        <div v-if="!session.started_at && hasMembers">
          <v-btn
            class="hidden-xs-only"
            color="primary"
            outlined
            :loading="starting"
            @click="sessionStart"
          >
            Start Session
          </v-btn>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="hidden-sm-and-up"
                color="primary"
                icon
                :loading="starting"
                @click="sessionStart"
                v-on="on"
              >
                <v-icon>mdi-play-circle</v-icon>
              </v-btn>
            </template>
            <span>Start Session</span>
          </v-tooltip>
        </div>
        <div v-if="session.started_at && hasMembers">
          <div class="hidden-xs-only">
            <v-btn
              outlined
              color="warning"
              class="mx-2"
              :loading="loading"
              @click="resetVotesConfirmation"
            >
              Reset Votes
            </v-btn>
            <v-btn
              class="mx-2"
              outlined
              color="primary"
              @click="showVotes"
            >
              Show Votes
            </v-btn>
          </div>
          <div class="hidden-sm-and-up">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="warning"
                  class="mx-2"
                  :loading="loading"
                  @click="resetVotesConfirmation"
                  v-on="on"
                >
                  <v-icon>
                    mdi-restart
                  </v-icon>
                </v-btn>
              </template>
              <span>Reset Votes</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="mx-2"
                  icon
                  color="primary"
                  @click="showVotes"
                  v-on="on"
                >
                  <v-icon>
                    mdi-view-carousel
                  </v-icon>
                </v-btn>
              </template>
              <span>Show Votes</span>
            </v-tooltip>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import firebase from 'firebase/app'
import { mapActions, mapState } from 'vuex'

import db from '@/services/db'
import httpException from '@/mixins/http-exception'
import VoteResultDialog from './VoteResultDialog'

export default {
  components: { VoteResultDialog },
  mixins: [httpException],
  data () {
    return {
      link: window.location,
      starting: false,
      ending: false,
      now: new Date(),
      loading: false
    }
  },
  computed: {
    ...mapState('session', ['session', 'members']),

    /**
     * Checks if all members have voted
     *
     */
    allVoted () {
      if (!this.members) return false

      return this.members.every(member => !!member.vote)
    },

    /**
     * Check if session has members
     *
     */
    hasMembers () {
      if (!this.members) return false

      return this.members.length
    },

    /**
     * Firestore session reference
     *
     */
    sessionRef () {
      return db.doc(`sessions/${this.$route.params.id}`)
    },

    /**
     * Firestore session members reference
     *
     */
    membersRef () {
      return db.collection(`sessions/${this.$route.params.id}/members`)
    }
  },
  async created () {
    this.setMembers(await this.init())

    setInterval(() => {
      this.now = new Date()
    }, 1000)
  },
  methods: {
    ...mapActions('session', ['setMembers']),
    ...mapActions('dialog', ['openConfirmationDialog']),
    ...mapActions('snackbar', ['showSnackbar']),

    /**
     * Init the required data
     *
     */
    init () {
      return this.membersRef.get()
        .then(querySnapshot => querySnapshot.docs.map(doc => {
          const item = doc.data()

          item.id = doc.id

          return item
        }))
        .catch(() => this.serverError())
    },

    /**
     * Copy to clipboard
     *
     */
    copy () {
      const copyText = document.getElementById('link')

      copyText.select()
      copyText.setSelectionRange(0, 99999)

      document.execCommand('copy')

      this.showSnackbar({ message: 'Copied to clipboard' })
    },

    /**
     * Start the session.
     *
     */
    async sessionStart () {
      this.starting = true

      const payload = {
        started_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp()
      }

      await this.sessionRef
        .update(payload)
        .catch(() => this.serverError())

      this.starting = false
    },

    /**
     * End the session.
     *
     */
    async sessionEnd () {
      this.ending = true

      const payload = {
        started_at: firebase.firestore.FieldValue.delete(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp()
      }

      await this.sessionRef
        .update(payload)
        .catch(() => this.serverError())

      this.ending = false
    },

    /**
     * Show the results dialog
     *
     */
    showVotes () {
      this.$refs.dialog.dialog = true
    },

    /**
     * Reset votes confirmation
     *
     */
    resetVotesConfirmation () {
      this.openConfirmationDialog({
        title: 'Reset All Votes',
        body: 'Are you sure you want to reset all votes?',
        actionLabel: 'Reset',
        cancelLabel: 'Cancel',
        action: async () => {
          this.loading = true

          await this.resetVotes()
            .then(() => this.showSnackbar({ message: 'Votes reset successful' }))
            .catch(() => this.serverError())

          this.loading = false
        }
      })
    },

    /**
     * Reset all votes
     *
     */
    resetVotes () {
      return this.membersRef.get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              vote: firebase.firestore.FieldValue.delete(),
              updated_at: firebase.firestore.FieldValue.serverTimestamp()
            })
          })
        })
        .catch(() => this.serverError())
    },

    /**
     * Remove member prompt
     *
     */
    removeMemberConfirmation (member) {
      this.openConfirmationDialog({
        title: 'Remove Member',
        body: 'Are you sure you want to remove member?',
        actionLabel: 'Remove',
        cancelLabel: 'Cancel',
        action: () => this.removeMember(member.id)
      })
    },

    /**
     * Remove the member document
     *
     */
    removeMember (id) {
      return this.membersRef
        .doc(id)
        .delete()
        .then(() => this.showSnackbar({ message: 'Member removed' }))
        .catch(() => this.serverError())
    }
  }

}
</script>
