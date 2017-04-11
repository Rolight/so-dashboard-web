import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Hello from '@/components/Hello'
import client from '@/components/client'
import Websites from '@/components/Websites'

Vue.use(Router)

function authenticated () {
  if (localStorage.getItem('accessToken') !== null) {
    client.defaults.headers.common['Authorization'] = 'JWT ' + localStorage.getItem('accessToken')
    client.post('/api/user/', {
      token: localStorage.getItem('accessToken')
    })
    .then((response) => {
    })
    .catch((error) => {
      console.log(error)
      localStorage.removeItem('accessToken')
    })
    return true
  }
  return false
}

function logout () {
  localStorage.removeItem('accessToken')
}

function requireAuth (to, from, next) {
  console.log(authenticated())
  if (!authenticated()) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/',
      beforeEnter: requireAuth,
      component: Hello
    }, {
      path: '/logout',
      beforeEnter (to, from, next) {
        logout()
        next({ name: 'Login' })
      }
    }, {
      path: '/websites/',
      beforeEnter: requireAuth,
      component: Websites
    }
  ]
})