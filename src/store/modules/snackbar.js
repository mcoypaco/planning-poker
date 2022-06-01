/**
 * =========================================
 * Snackbar Store
 * =========================================
 *
 * Handles the snackbar of the application.
 *
 * =========================================
 */
export default {
  namespaced: true,
  strict: process.env.APP_ENV === 'development',
  state () {
    return {
      timeout: null,
      top: '',
      bottom: '',
      right: '',
      left: '',
      multiLine: '',
      vertical: '',
      snackbar: '',
      color: '',
      message: '',
      closeLabel: ''
    }
  },
  mutations: {
    /**
     * Sets the default values for snackbar.
     *
     * @param state
     */
    setDefault (state) {
      state.timeout = 3000
      state.top = true
      state.bottom = false
      state.right = true
      state.left = false
      state.multiLine = false
      state.vertical = false
      state.snackbar = false
      state.color = ''
      state.snackbar = false
      state.closeLabel = 'Close'
      state.message = ''
    },

    /**
     * Overrides snackbar properties.
     *
     * @param state
     * @param config
     */
    setSnackbar (state, config) {
      for (const key in config) {
        state[key] = config[key]
      }

      state.snackbar = true
    }
  },
  actions: {
    /**
     * Shows the snackbar and overrides some properties.
     *
     * @param context
     * @param config
     */
    showSnackbar (context, config) {
      context.commit('setDefault')
      context.commit('setSnackbar', config)
    },

    /**
     * Hides the snackbar in view.
     *
     * @param context
     */
    closeSnackbar (context) {
      context.commit('setDefault')
    }
  }
}
