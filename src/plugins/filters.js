import Vue from 'vue'

Vue.filter('upperCaseFirstCharacter', function (value) {
  return value.charAt(0).toUpperCase()
})
