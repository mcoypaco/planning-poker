import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#009688',
        secondary: '#757575',
        accent: '#FFEB3B'
      }
    }
  }
})
