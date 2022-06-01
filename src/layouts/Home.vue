<template>
  <div>
    <HomeNavigationDrawer />
    <HomeToolbar />
    <v-content>
      <router-view />
    </v-content>
  </div>
</template>
<script>
import HomeNavigationDrawer from '@/components/Home/HomeNavigationDrawer'
import HomeToolbar from '@/components/Home/HomeToolbar'

export default {
  components: {
    HomeNavigationDrawer,
    HomeToolbar
  },
  data () {
    return {
      //
    }
  }
}
</script>
