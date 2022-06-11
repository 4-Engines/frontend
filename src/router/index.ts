import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useStore } from '@/store';

import Login from '@/views/LoginPage.vue';
import NotFound from '@/views/NotFoundPage.vue';
import Autos from '@/views/AutosPage.vue';
import Auto from '@/views/AutoPage/AutoPage.vue';
import Home from '@/views/HomePage.vue';
import MisDatos from '@/views/MisDatosPage.vue';
import ActivarCuenta from '@/views/ActivarCuentaPage.vue';
import RegistroCliente from '@/views/RegistroClientePage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Página no encontrada',
    },
  },
  {
    path: '/',
    component: Login,
    meta: {
      title: 'Login',
    },
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: 'Inicio',
    },
  },
  {
    path: '/mis-datos',
    component: MisDatos,
    meta: {
      title: 'Mis datos',
    },
  },
  {
    path: '/autos',
    component: Autos,
    meta: {
      title: 'Autos',
    },
  },
  {
    path: '/autos/:id',
    component: Auto,
    meta: {
      title: 'Auto',
    },
  },
  {
    path: '/activar/:id',
    component: ActivarCuenta,
    meta: {
      title: 'Acticar cuenta',
    },
  },
  {
    path: '/registro',
    component: RegistroCliente,
    meta: {
      title: 'Registro',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const store = useStore();

  if (
    to.path !== '/' &&
    to.path !== '/registro' &&
    to.path.indexOf('/activar') < 0 &&
    !store.isLoggedIn
  ) {
    return '/';
  }
});

const DEFAULT_TITLE = 'Sistema de gestión del automotor';

router.afterEach((to) => {
  document.title = `${to.meta.title} - ${DEFAULT_TITLE}` || DEFAULT_TITLE;
});

export default router;
