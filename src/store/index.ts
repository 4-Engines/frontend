import { defineStore } from 'pinia'
import { User } from '../types/User'

interface Store {
    isLoggedIn: boolean,
    user: User
}

export const useStore = defineStore<string, Store>('main', {
    state: () => ({
        isLoggedIn: false,
        user: {
            name: '',
            mail: '',
            rol: -1
        }
    })
})