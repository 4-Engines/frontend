import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useStore } from '@/store';

import Login from '@/views/LoginPage.vue';
import NotFound from '@/views/NotFoundPage.vue';
import Autos from '@/views/AutosPage.vue';
import Auto from '@/views/AutoPage.vue';
import Home from '@/views/HomePage.vue';
import MisDatos from '@/views/MisDatosPage.vue';
import ActivarCuenta from '@/views/ActivarCuentaPage.vue';
import RegistroCliente from '@/views/RegistroClientePage.vue';
import RegistroAuto from '@/views/RegistroAutoPage.vue';

const routes: RouteRecordRaw[] = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  {
    path: '/',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/mis-autos',
    component: Autos,
  },
  {
    path: '/mis-datos',
    component: MisDatos,
  },
  {
    path: '/autos',
    component: Autos,
  },
  {
    path: '/autos/:id',
    component: Auto,
  },
  {
    path: '/activar/:id',
    component: ActivarCuenta,
  },
  {
    path: '/registro',
    component: RegistroCliente,
  },
  {
    path: '/registro-auto',
    component: RegistroAuto,
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

export default router;
