<template>
  <v-dialog
    v-model="dialog"
    width="600"
    scrollable
  >
    <v-card>
      <v-card-title>
        Results
        <v-spacer />
        <v-btn
          icon
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row warp>
          <v-col
            v-for="(result, index) in results"
            :key="index"
            cols="12"
          >
            <v-card outlined>
              <v-card-title>
                <v-icon
                  v-if="isFibonacci && icon(result.card)"
                  large
                >
                  {{ icon(result.card) }}
                </v-icon>
                <span
                  v-if="!icon(result.card)"
                  class="display-2"
                >{{ result.card }}</span>
              </v-card-title>
              <v-card-text v-if="result.members">
                <v-list>
                  <v-list-item
                    v-for="(member, idx) in result.members"
                    :key="idx"
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
                      >
                        mdi-account-circle
                      </v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ member.displayName }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dialog: false
    }
  },
  computed: {
    ...mapState('session', ['session', 'members']),

    /**
     * Check if session deck is fibonacci.
     *
     */
    isFibonacci () {
      if (!this.session) return false

      return this.session.deck.name === 'Fibonacci'
    },

    /**
     * Results of the vote
     *
     */
    results () {
      if (!this.session || !this.members) return []

      return this.session.deck.cards.map(card => {
        const item = {
          card
        }

        item.members = this.members.filter(member => member.vote === card)

        return item
      }).filter(card => card.members.length)
    }
  },
  methods: {
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
    }
  }
}
</script>
