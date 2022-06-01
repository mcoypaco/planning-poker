import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('dialog', ['openAlertDialog']),

    /**
     * Server error prompt
     *
     */
    serverError () {
      this.openAlertDialog({
        title: 'Oops! Something went wrong',
        body: 'Please try again or refresh the page.'
      })
    }
  }
}
