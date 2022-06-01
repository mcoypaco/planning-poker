<template>
  <v-container>
    <CreateSession />
    <JoinSession />
  </v-container>
</template>
<script>
import CreateSession from '@/components/HomePage/CreateSession'
import JoinSession from '@/components/HomePage/JoinSession'

export default {
  components: {
    CreateSession,
    JoinSession
  },
  data () {
    return {
      //
    }
  }
}
</script>
