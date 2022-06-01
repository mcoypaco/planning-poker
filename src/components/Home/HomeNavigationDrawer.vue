<template>
  <v-navigation-drawer
    :value="drawer"
    app
  >
    <v-list
      dense
      nav
      class="py-0"
      flat
    >
      <v-skeleton-loader
        v-if="!user"
        type="list-item-avatar-two-line"
      />
      <v-list-item
        v-else
        two-line
      >
        <v-list-item-avatar color="primary">
          <img
            v-if="user.photoURL"
            :src="user.photoURL"
            alt="user.name"
            @error="user.photoURL = null"
          >
          <span
            v-if="user.name && !user.photoURL"
            class="white--text headline"
          >{{ user.name | upperCaseFirstCharacter }}</span>
          <v-icon
            v-if="!user.name && !user.photoURL"
            class="white--text"
          >
            mdi-account-circle
          </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ user.displayName }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list
      dense
      nav
      class="py-0"
      flat
    >
      <v-list-item
        v-for="(link, index) in links"
        :key="index"
        color="primary"
        class="my-2"
        link
        :to="link.url"
      >
        <v-list-item-icon>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn
          rounded=""
          text
          block
          @click="signOut"
        >
          <v-icon left>
            mdi-logout
          </v-icon>
          Logout
        </v-btn>
      </div>
      <v-divider />
      <div class="text-center my-2 overline">
        <span class="text--secondary">Created by </span>
        <a
          href="https://www.linkedin.com/in/mcoy-paco/"
          target="_blank"
          style="text-decoration: none"
        >
          Mcoy Paco
        </a>
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script>
import { mapState } from 'vuex'

import firebaseAuth from '@/services/auth'
import httpException from '@/mixins/http-exception'

export default {
  mixins: [httpException],
  data () {
    return {
      links: [
        {
          icon: 'mdi-home',
          title: 'Home',
          url: '/'
        },
        {
          icon: 'mdi-cards',
          title: 'Sessions',
          url: '/sessions'
        }
      ]
    }
  },
  computed: {
    ...mapState('navigationDrawer', ['drawer']),

    /**
     * Current authenticated user
     *
     */
    user () {
      return firebaseAuth.currentUser
    }
  },
  methods: {
    /**
     * Sign out authenticated user
     *
     */
    signOut () {
      firebaseAuth.signOut()
        .then(() => this.$router.replace('/login'))
        .catch(() => this.serverError())
    }
  }
}
</script>
