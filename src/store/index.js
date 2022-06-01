import Vue from 'vue'
import Vuex from 'vuex'

import dialog from './modules/dialog'
import navigationDrawer from './modules/navigation-drawer'
import session from './modules/session'
import snackbar from './modules/snackbar'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    dialog,
    navigationDrawer,
    session,
    snackbar
  }
})
