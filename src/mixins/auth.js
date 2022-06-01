import firebaseAuth from '@/services/auth'

export default {
  computed: {
    /**
     * Firebase authenticated user
     *
     */
    user () {
      return firebaseAuth.currentUser
    }
  }
}
