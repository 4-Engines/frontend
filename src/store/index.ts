import { defineStore } from 'pinia';
import type { User } from '@/types/User';
import { Rol } from '@/types/Enums';

type Theme = 'light' | 'dark';

export const useStore = defineStore('main', {
  state: () => ({
    theme: 'light' as Theme,
    isLoggedIn: false,
    user: null as User | null
  }),
  getters: {
    isCliente: (state) => state.user?.rol === Rol.Cliente,
    isEmpleado: (state) => state.user?.rol === Rol.Empleado,
    isAdmin: (state) => state.user?.rol === Rol.Admin,
    rolLabel() {
      if (this.isCliente) {
        return 'Cliente';
      }

      if (this.isEmpleado) {
        return 'Empleado';
      }

      if (this.isAdmin) {
        return 'Reponsable del taller';
      }

      return '';
    }
  },
  persist: true
});
