import { createRouter, createWebHashHistory} from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useStore } from '@/store';

import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'
import Autos from '@/views/Autos.vue'
import Auto from '@/views/Auto.vue'
import Home from '@/views/Home.vue'
import ActivarCuenta from '@/views/ActivarCuenta.vue'
import RegistroCliente from '@/views/RegistroCliente.vue'

const routes: RouteRecordRaw[] = [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    {
        path: '/',
        component: Login
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/autos',
        component: Autos
    },
    {
        path: '/autos/:id',
        component: Auto
    },
    {
        path: '/activar-cuenta/:id',
        component: ActivarCuenta
    },
    {
        path: '/registro',
        component: RegistroCliente
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from) => {
    const store = useStore();

    if (to.path !== '/' && !store.isLoggedIn) {
        return '/'
    }
})

export default router;