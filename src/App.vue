<template>
  <reload-p-w-a />

  <v-app :theme="store.theme">
    <v-navigation-drawer v-if="store.isLoggedIn" v-model="drawer">
      <v-list>
        <v-list-item v-if="store.user" :subtitle="store.rolLabel">
          <template #title>
            {{ store.user.name }} {{ store.user.lastname }}
          </template>
          <template #prepend>
            <v-list-item-avatar start>
              <v-avatar color="primary">
                {{ avatarLabel }}
              </v-avatar>
            </v-list-item-avatar>
          </template>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list>
        <v-list-item
          v-for="item of menuComputed"
          :key="item.title"
          :to="item.to"
          active-color="primary"
        >
          <v-list-item-avatar start>
            <v-icon :icon="item.icon" />
          </v-list-item-avatar>
          {{ item.title }}
        </v-list-item>

        <v-list-item @click="toggleTheme">
          <v-list-item-avatar start>
            <v-icon icon="mdi-weather-night" />
          </v-list-item-avatar>
          <v-list-item-header>
            <v-list-item-title>Modo oscuro</v-list-item-title>
          </v-list-item-header>
          <v-list-item-action end>
            <v-switch
              color="indigo-lighten-2"
              hide-details
              :model-value="!store.isLightTheme"
            />
          </v-list-item-action>
        </v-list-item>

        <v-list-item @click="logout">
          <v-list-item-avatar start>
            <v-icon icon="mdi-car-traction-control" />
          </v-list-item-avatar>
          Salir
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :color="store.isLightTheme ? 'primary' : '#1E1E1E'">
      <v-app-bar-nav-icon v-if="store.isLoggedIn" @click="drawer = !drawer" />
      <v-app-bar-title>
        <span class="d-block d-sm-none">SiGeA</span>
        <span class="d-none d-sm-block">Sistema de gestión del automotor</span>
      </v-app-bar-title>

      <v-spacer />

      <v-btn v-if="showInstallPromotion" @click="installApp">
        Instalar App
      </v-btn>
    </v-app-bar>

    <v-main style="min-height: 100vh">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>

    <v-divider />

    <v-footer>
      <v-row justify="center" no-gutters>
        <v-btn color="primary" variant="text" class="mx-2" rounded="xl" to="/">
          Inicio
        </v-btn>
        <v-btn
          v-if="store.isLoggedIn"
          color="primary"
          variant="text"
          class="mx-2"
          rounded="xl"
          to="/autos"
        >
          {{ store.isCliente ? 'Mis autos' : 'Autos' }}
        </v-btn>
        <v-btn color="primary" variant="text" class="mx-2" rounded="xl">
          Reportar error
        </v-btn>
        <v-btn color="primary" variant="text" class="mx-2" rounded="xl">
          Contacto
        </v-btn>
        <v-col class="text-center mt-4" cols="12">
          Copyright &copy; {{ new Date().getFullYear() }}
          <strong>Four Engines</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>

  <v-snackbar :model-value="snackbar.visible.value" left>{{
    snackbar.message.value
  }}</v-snackbar>

  <v-overlay
    :theme="store.theme"
    :model-value="overlay.visible.value"
    class="align-center justify-center text-center"
  >
    <v-progress-circular indeterminate size="64"></v-progress-circular>
    <p class="mt-3">{{ overlay.message.value }}</p>
  </v-overlay>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import ReloadPWA from '@/components/ReloadPWA.vue';
import { logoutUser } from '@/services/User.service';
import { useSnackbar } from './composables/useSnackbar';
import { useOverlay } from '@/composables/useOverlay';

const store = useStore();
const router = useRouter();
const deferredPrompt = ref();
const showInstallPromotion = ref(false);
const drawer = ref(false);
const loading = ref(false);
const overlay = useOverlay();

const snackbar = useSnackbar();

onMounted(() => {
  store.$patch({});

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallPromotion.value = true;
  });

  window.addEventListener('appinstalled', () => {
    showInstallPromotion.value = false;
    deferredPrompt.value = null;
  });

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', store.isLightTheme ? '#124B8D' : '#2A2A2A');

  if (store.isLoggedIn) {
    router.replace('/home');
  }
});

const avatarLabel = computed(() => {
  if (!store.isLoggedIn || !store.user) {
    return '';
  }

  return `${store.user.name.charAt(0)}${store.user.lastname.charAt(
    0
  )}`.toUpperCase();
});

const menuComputed = computed(() => {
  const menu = [
    {
      title: 'Inicio',
      to: '/home',
      icon: 'mdi-home-variant',
    },
  ];

  if (store.isCliente) {
    menu.push({
      title: 'Mis autos',
      to: '/autos',
      icon: 'mdi-key-chain',
    });
  }

  if (store.isEmpleado) {
    menu.push({
      title: 'Autos',
      to: '/autos',
      icon: 'mdi-car-multiple',
    });

    // menu.push({
    //   title: 'Nuevo cliente',
    //   to: '/registro',
    //   icon: 'mdi-person-add',
    // });
  }

  if (store.isAdmin) {
    menu.push({
      title: 'Nuevo empleado',
      to: '/nuevo-empleado',
      icon: 'mdi-account-plus',
    });
  }

  // menu.push({
  //   title: 'Mis datos',
  //   to: '/mis-datos',
  //   icon: 'mdi-account-circle',
  // });

  return menu;
});

function installApp() {
  deferredPrompt.value.prompt();
}

function toggleTheme() {
  store.theme = store.isLightTheme ? 'dark' : 'light';
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', store.isLightTheme ? '#124B8D' : '#2A2A2A');
}

async function logout() {
  if (store.user) {
    overlay.show('Cerrando sesión...');
    loading.value = true;

    try {
      const { data } = await logoutUser(store.user.id);

      if (data[0].status === 'error') {
        throw Error(data[0].msj || 'Ocurrió un error al cerrar la sesión');
      }

      store.$patch({
        isLoggedIn: false,
        user: null,
      });

      drawer.value = false;

      router.push('/');
    } catch (error: any) {
      console.log(error.message);
    } finally {
      loading.value = false;
      overlay.hide();
    }
  }
}
</script>
