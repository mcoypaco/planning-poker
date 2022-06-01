<template>
  <v-container>
    <v-row
      v-if="loading"
      justify="center"
      align="center"
    >
      <v-col>
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </v-col>
    </v-row>
    <div v-else>
      <v-row
        v-if="session"
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          lg="6"
        >
          <Host v-if="isHost" />
          <Member v-else />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
import { mapActions, mapState } from 'vuex'

import auth from '@/services/auth'
import db from '@/services/db'
import httpException from '@/mixins/http-exception'
import Host from '@/components/Session/Host'
import Member from '@/components/Session/Member'

export default {
  components: { Host, Member },
  mixins: [httpException],
  data () {
    return {
      loading: false,
      isHost: false
    }
  },
  computed: {
    ...mapState('session', ['session'])
  },
  beforeRouteEnter (to, from, next) {
    next(async vm => {
      vm.loading = true

      vm.setSession(null)

      const session = await vm.findSession()

      if (!session) return

      vm.setSession(session)

      vm.isHost = auth.currentUser.uid === vm.session.uid

      vm.loading = false
    })
  },
  methods: {
    ...mapActions('session', ['setSession']),

    /**
     * Find and subscribe to session
     *
     */
    findSession () {
      return db.doc(`sessions/${this.$route.params.id}`)
        .get()
        .then(snapshot => {
          const data = snapshot.data()

          data.id = snapshot.id

          return data
        })
        .catch(() => {
          this.$router.push({ name: 'PageNotFound' })
        })
    }
  }
}
</script>
