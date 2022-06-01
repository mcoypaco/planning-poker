const Home = () => import('../layouts/Home')
const HomePage = () => import('../pages/HomePage')
const Session = () => import('../pages/Session')
const Sessions = () => import('../pages/Sessions')

export default {
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomePage
        },
        {
          path: 'sessions',
          name: 'Sessions',
          component: Sessions
        },
        {
          path: 'sessions/:id',
          name: 'Session',
          component: Session
        }
      ],
      meta: {
        requiresAuth: true
      }
    }
  ]
}
