<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click="toggle" />
    <v-toolbar-title>{{ title }}</v-toolbar-title>
  </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      //
    }
  },
  computed: {
    /**
     * Name of the current route
     *
     */
    title () {
      return this.$route.name
    }
  },
  methods: {
    ...mapActions('navigationDrawer', ['toggle'])
  }

}
</script>
