import db from '@/services/db'

export default {
  namespaced: true,
  strict: process.env.APP_ENV === 'development',
  state () {
    return {
      session: null,
      members: null,
      member: null
    }
  },
  mutations: {
    /**
     * Set the member state
     *
     * @param {*} state
     * @param {*} member
     */
    SET_MEMBER (state, member) {
      state.member = member
    },

    /**
     * Set the members state
     *
     * @param {*} state
     * @param {*} members
     */
    SET_MEMBERS (state, members) {
      state.members = members
    },

    /**
     * Set the session state
     *
     * @param {*} state
     * @param {*} session
     */
    SET_SESSION (state, session) {
      state.session = session
    }
  },
  actions: {
    /**
     * Commit the SET_MEMBER mutation
     *
     * @param {*} param0
     * @param {*} members
     */
    setMember ({ commit, state }, member) {
      commit('SET_MEMBER', member)

      let subscription

      // Listen for updates in firebase
      if (member) {
        const resolve = doc => {
          const data = doc.data()

          data.id = doc.id

          commit('SET_MEMBER', data)
        }

        const reject = () => commit('dialog/OPEN_ALERT_DIALOG', {
          title: 'Oops! Something went wrong',
          body: 'Please try again or refresh the page.'
        }, { root: true })

        subscription = db.collection('sessions')
          .doc(state.session.id)
          .collection('members')
          .doc(member.id)
          .onSnapshot(resolve, reject)
      } else {
        if (subscription) subscription.unsubscribe()
      }
    },

    /**
     * Commit the SET_MEMBERS mutation
     *
     * @param {*} param0
     * @param {*} members
     */
    setMembers ({ commit, state }, members) {
      commit('SET_MEMBERS', members)

      let subscription

      // Listen for updates in firebase
      if (members) {
        const resolve = querySnapshot => {
          const data = querySnapshot.docs.map(doc => {
            const item = doc.data()

            item.id = doc.id

            return item
          })

          commit('SET_MEMBERS', data)
        }

        const reject = () => true

        subscription = db.collection('sessions')
          .doc(state.session.id)
          .collection('members')
          .onSnapshot(resolve, reject)
      } else {
        if (subscription) subscription.unsubscribe()
      }
    },

    /**
     * Commit the SET_SESSION mutation
     *
     * @param {*} param0
     * @param {*} session
     */
    setSession ({ commit }, session) {
      commit('SET_SESSION', session)

      let subscription

      // Listen for updates in firebase
      if (session) {
        const resolve = doc => {
          const data = doc.data()

          data.id = doc.id

          commit('SET_SESSION', data)
        }

        const reject = () => true

        subscription = db.collection('sessions')
          .doc(session.id)
          .onSnapshot(resolve, reject)
      } else {
        if (subscription) subscription.unsubscribe()
      }
    }
  }
}
