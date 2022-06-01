import Vue from 'vue'

import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import firebaseAuth from '@/services/auth'
import './plugins/filters'
import './plugins/firebase'
import './plugins/vuefire'
import './plugins/vuelidate'
import './plugins/vue-moment'
import './plugins/vue-progress-bar'
import './registerServiceWorker'

Vue.config.productionTip = false

let app = ''

firebaseAuth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
