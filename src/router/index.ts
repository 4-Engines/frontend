import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useStore } from '@/store';

import Login from '@/views/LoginPage.vue';
import NotFound from '@/views/NotFoundPage.vue';
import Autos from '@/views/AutosPage.vue';
import Auto from '@/views/AutoPage.vue';
import Home from '@/views/HomePage.vue';
import ActivarCuenta from '@/views/ActivarCuentaPage.vue';
import RegistroCliente from '@/views/RegistroClientePage.vue';

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
    path: '/autos',
    component: Autos,
  },
  {
    path: '/autos/:id',
    component: Auto,
  },
  {
    path: '/confirm/:id',
    component: ActivarCuenta,
  },
  {
    path: '/registro',
    component: RegistroCliente,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const store = useStore();

  if (to.path !== '/' && to.path !== '/registro' && !store.isLoggedIn) {
    return '/';
  }
});

export default router;
