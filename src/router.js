import Vue from 'vue'
import Router from 'vue-router'
import Paivat from './views/Paivat.vue'
import Viikot from './views/Viikot.vue'
import Saldot from './views/Saldot.vue'
import Kellonajat from './views/Kellonajat.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'paivat',
      component: Paivat
    },
    {
      path: '/viikot',
      name: 'viikot',
      component: Viikot
    },
    {
      path: '/saldot',
      name: 'saldot',
      component: Saldot
    },
    {
      path: '/kellonajat',
      name: 'kellonajat',
      component: Kellonajat
    }/* ,
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.

      component: () => import(/* webpackChunkName: "about" */ /* './views/About.vue')
    } */
  ]
})
