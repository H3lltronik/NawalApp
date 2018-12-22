import Vue from 'vue'
import Router from 'vue-router'
import RegisterTherapy from '@/components/registerTherapy'
import ViewTherapy from '@/components/viewTherapys'
import LoginPage from '@/components/loginComponent'
import AuthGuard from './auth-guard.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/registerTheraphy',
      name: 'Register Therapy',
      component: RegisterTherapy,
      beforeEnter: AuthGuard
    },
    {
      path: '/viewTherapy',
      name: 'Registered Therapy',
      component: ViewTherapy,
      beforeEnter: AuthGuard
    }
  ],
  mode: 'history'
})
