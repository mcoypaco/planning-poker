import Vue from 'vue'
import VueRouter from 'vue-router'

import app from './app'
import auth from './auth'
import PageNotFound from '@/pages/PageNotFound'
import firebaseAuth from '@/services/auth'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    ...app.routes,
    ...auth.routes,
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const currentUser = firebaseAuth.currentUser

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  // if (requiresAuth && currentUser) {
  //   let user = await userService.getUser(firebaseAuth.currentUser.uid)

  //   if (!user.length) {
  //     const id = await userService.createUser()

  //     if (id) {
  //       user = await userService.findUser(id)

  //       store.dispatch('user/setUser', user, true)
  //     }
  //   } else {
  //     store.dispatch('user/setUser', _.head(user), true)
  //   }
  // }

  if (requiresAuth && !currentUser) {
    sessionStorage.setItem('intent', to.path)

    return next('login')
  }

  if (requiresGuest && currentUser) return next(from.path)

  else next()
})

export default router
