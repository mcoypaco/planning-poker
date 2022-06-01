const Auth = () => import('../layouts/Auth')
const Login = () => import('../pages/Login')
const PasswordReset = () => import('../pages/PasswordReset')
const SignUp = () => import('../pages/SignUp')

export default {
  routes: [
    {
      path: '/login',
      component: Auth,
      children: [
        {
          path: '',
          component: Login
        }
      ],
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/sign-up',
      component: Auth,
      children: [
        {
          path: '',
          component: SignUp
        }
      ],
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/password-reset',
      component: Auth,
      children: [
        {
          path: '',
          component: PasswordReset
        }
      ],
      meta: {
        requiresGuest: true
      }
    }
  ]
}
