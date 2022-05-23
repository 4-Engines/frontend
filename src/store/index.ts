import { defineStore } from 'pinia'
import type { User } from '@/types/User'
import { Rol } from '@/types/Enums'

type Theme = 'light' | 'dark'
interface Store {
    theme: Theme,
    isLoggedIn: boolean,
    user: User | null
}

export const useStore = defineStore<string, Store>('main', {
    state: () => ({
        theme: 'light',
        isLoggedIn: false,
        user: null
    }),
    getters: {
        isCliente: (state) => state.user?.rol === Rol.Cliente,
        isEmpleado: (state) => state.user?.rol === Rol.Empleado,
        isAdmin: (state) => state.user?.rol === Rol.Admin
    },
    persist: true
})