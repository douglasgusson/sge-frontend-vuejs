import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home'
import About from '@/views/About'
import Login from '@/views/Login'
import Eventos from '@/views/Eventos'
import Locais from '@/views/Locais'
import Palestrantes from '@/views/Palestrantes'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      guest: true
    }
  },
  {
    path: '/eventos',
    name: 'Eventos',
    component: Eventos,
    meta: {
      guest: true
    }
  },
  {
    path: '/locais',
    name: 'Locais',
    component: Locais,
    meta: {
      guest: true
    }
  },
  {
    path: '/palestrantes',
    name: 'Palestrantes',
    component: Palestrantes,
    meta: {
      guest: true
    }
  },
  {
    path: '/tipos-de-atividade',
    name: 'Tipos de Ativdade',
    component: () => import(/* webpackChunkName: "about" */ '../views/TiposAtividade.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/atividades',
    name: 'Ativdades',
    component: () => import(/* webpackChunkName: "about" */ '../views/Atividades.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/organizadores',
    name: 'Organizadores',
    component: () => import(/* webpackChunkName: "organizadores" */ '../views/Organizadores.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/participantes',
    name: 'Participantes',
    component: () => import(/* webpackChunkName: "participantes" */ '../views/Participantes.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/inscricao',
    name: 'Inscrição',
    component: () => import(/* webpackChunkName: "inscricao" */ '../views/Inscricao.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/participacoes',
    name: 'Participações',
    component: () => import(/* webpackChunkName: "participacoes" */ '../views/Participacoes.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/sobre',
    name: 'Sobre',
    component: About,
    meta: {
      requiresAuth: true,
      is_admin: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      guest: true
    }
  },
]

const router = new VueRouter({ mode: 'history', routes })

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('usuario') == null) {
      next({
        path: '/login', query: { nextUrl: to.fullPath }
      })
    } else {
      let usuario = JSON.parse(localStorage.getItem('usuario'))
      if (to.matched.some(record => record.meta.is_admin)) {
        if (usuario.admin == 1) {
          next()
        }
        else {
          next({ name: 'Home' })
        }
      } else {
        next()
      }
    }

  } else if (to.matched.some(record => record.meta.guest)) {
    next()
  }
})

export default router
