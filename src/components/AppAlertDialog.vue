<template>
  <v-row justify="center">
    <v-dialog
      :value="alertDialog"
      persistent
      :max-width="maxWidth"
    >
      <v-card>
        <v-card-title class="headline">
          {{ title }}
        </v-card-title>
        <v-card-text>{{ body }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            rounded
            @click="closeAndAgree()"
          >
            {{ actionLabel }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'AppAlertDialog',
  computed: {
    ...mapState('dialog', [
      'alertDialog',
      'title',
      'body',
      'action',
      'actionLabel',
      'maxWidth'
    ])
  },
  methods: {
    ...mapActions('dialog', ['closeDialog']),

    /**
     * Hides the dialog and executes the action callback function.
     *
     */
    closeAndAgree () {
      this.closeDialog('alertDialog')
      if (this.action) this.action()
    }
  }
}
</script>
