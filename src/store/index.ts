import { defineStore } from 'pinia'
import type { User } from '../types/User'

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
    persist: true
})