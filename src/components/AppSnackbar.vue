<template>
  <v-snackbar
    :timeout="timeout"
    :top="top"
    :bottom="bottom"
    :right="right"
    :left="left"
    :multi-line="multiLine"
    :vertical="vertical"
    :value="snackbar"
    @input="closeSnackbar"
  >
    {{ message }}
    <v-btn
      text
      color="primary"
      @click.native="closeSnackbar"
    >
      {{ closeLabel }}
    </v-btn>
  </v-snackbar>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState('snackbar', [
      'timeout',
      'top',
      'bottom',
      'right',
      'left',
      'multiLine',
      'vertical',
      'snackbar',
      'message',
      'closeLabel'
    ])
  },
  methods: {
    ...mapActions('snackbar', ['closeSnackbar'])
  }
}
</script>
