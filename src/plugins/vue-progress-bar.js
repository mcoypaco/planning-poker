import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'
import colors from 'vuetify/lib/util/colors'

Vue.use(VueProgressBar, {
  color: colors.teal.base,
  failedColor: colors.red.base
})
