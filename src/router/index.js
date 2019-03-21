import Vue from 'vue'
import Router from 'vue-router'
import NlcpApp from '@/components/nlcp/App'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '',
    component: NlcpApp
  }]
})

export default router
