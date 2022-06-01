import firebase from 'firebase/app'
import 'firebase/auth'

import firebaseApp from '@/plugins/firebase'

export const google = new firebase.auth.GoogleAuthProvider()

export default firebaseApp.auth()
