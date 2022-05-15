import { createRouter, createWebHashHistory} from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'

const routes: RouteRecordRaw[] = [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    {
        path: '/',
        component: Login
    },
    {
        path: '/login',
        component: Login
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;