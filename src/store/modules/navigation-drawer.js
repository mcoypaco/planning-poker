export default {
  namespaced: true,
  strict: process.env.APP_ENV === 'development',
  state () {
    return {
      drawer: false
    }
  },
  mutations: {
    /**
     * Set the drawer state.
     *
     * @param {*} state
     * @param {*} drawer
     */
    SET_DRAWER (state, drawer) {
      state.drawer = drawer
    }
  },
  actions: {
    /**
     * Hide the drawer
     *
     * @param {*} param0
     */
    hide ({ commit }) {
      commit('SET_DRAWER', false)
    },

    /**
     * Show the drawer
     *
     * @param {*} param0
     */
    show ({ commit }) {
      commit('SET_DRAWER', true)
    },

    /**
     * Toggle the drawer
     *
     * @param {*} param0
     */
    toggle ({ commit, state }) {
      commit('SET_DRAWER', !state.drawer)
    }
  }
}
