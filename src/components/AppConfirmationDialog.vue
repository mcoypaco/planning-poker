<template>
  <v-row justify="center">
    <v-dialog
      :value="confirmationDialog"
      persistent
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">
          {{ title }}
        </v-card-title>
        <v-card-text>{{ body }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            rounded
            @click.native="closeAndDisagree()"
          >
            {{ cancelLabel }}
          </v-btn>
          <v-btn
            :color="color"
            text
            rounded
            @click.native="closeAndAgree()"
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
  name: 'AppConfirmationDialog',
  computed: {
    ...mapState('dialog', [
      'confirmationDialog',
      'title',
      'body',
      'action',
      'actionLabel',
      'cancel',
      'cancelLabel',
      'color'
    ])
  },
  methods: {
    ...mapActions('dialog', ['closeDialog']),

    /**
     * Hides the dialog and executes the action callback function.
     *
     */
    closeAndAgree () {
      this.closeDialog('confirmationDialog')
      if (this.action) this.action()
    },

    /**
     * Hides the dialog and executes the cancel callback function.
     *
     */
    closeAndDisagree () {
      this.closeDialog('confirmationDialog')
      if (this.cancel) this.cancel()
    }
  }
}
</script>
