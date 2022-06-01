<template>
  <v-app>
    <router-view />
    <vue-progress-bar />
    <v-content>
      <AppAlertDialog />
      <AppConfirmationDialog />
      <AppSnackbar />
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'

import AppAlertDialog from '@/components/AppAlertDialog'
import AppConfirmationDialog from '@/components/AppConfirmationDialog'
import AppSnackbar from '@/components/AppSnackbar'

export default {
  name: 'App',
  components: {
    AppAlertDialog,
    AppConfirmationDialog,
    AppSnackbar
  },
  data () {
    return {
      //
    }
  },
  mounted () {
    this.$Progress.finish()
  },
  created () {
    this.loading()

    this.navigationDrawer()
  },
  methods: {
    ...mapActions('navigationDrawer', ['hide', 'show']),

    /**
     * Show the progress loader
     *
     */
    loading () {
      this.$Progress.start()

      this.$router.beforeEach((to, from, next) => {
        this.$Progress.start()
        next()
      })

      this.$router.afterEach(() => this.$Progress.finish())
    },

    /**
     * Show or hide the navigation drawer
     *
     */
    navigationDrawer () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          this.hide()
          break

        default:
          this.show()
          break
      }
    }
  }
}
</script>
