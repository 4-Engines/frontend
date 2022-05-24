<template>
  <reload-p-w-a />

  <v-app :theme="store.theme">
    <v-navigation-drawer v-if="store.isLoggedIn" v-model="drawer">
      <v-list>
        <v-list-item v-if="store.user" :subtitle="store.rolLabel">
          <template #title>
            {{ store.user.name }} {{ store.user.last_name }}
          </template>
          <template #prepend>
            <v-list-item-avatar start>
              <v-avatar color="primary">{{ avatarLabel }}</v-avatar>
            </v-list-item-avatar>
          </template>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list>
        <v-list-item
          :to="item.to"
          v-for="item of menuComputed"
          :key="item.title"
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
            <v-switch color="indigo-lighten-2" hide-details :model-value="!isLightTheme" />
          </v-list-item-action>
        </v-list-item>

        <v-list-item @click="logout">
          <v-list-item-avatar start>
            <v-icon icon="mdi-lock-open" />
          </v-list-item-avatar>
          Salir
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :color="isLightTheme ? 'primary' : '#1E1E1E'">
      <v-app-bar-nav-icon v-if="store.isLoggedIn" @click="drawer = !drawer" />
      <v-app-bar-title>
        <span class="d-block d-sm-none">SiGeA</span>
        <span class="d-none d-sm-block">Sistema de gestión del automotor</span>
      </v-app-bar-title>

      <v-spacer />

      <v-btn v-if="showInstallPromotion" @click="installApp"
        >Instalar App</v-btn
      >
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useStore } from "./store";
import ReloadPWA from "./components/ReloadPWA.vue";
import { onMounted, ref } from "vue";
import { computed } from "@vue/reactivity";

const store = useStore();
const router = useRouter();
const deferredPrompt = ref();
const showInstallPromotion = ref(false);
const drawer = ref(false);

onMounted(() => {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallPromotion.value = true;
  });

  window.addEventListener("appinstalled", () => {
    showInstallPromotion.value = false;
    deferredPrompt.value = null;
  });

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", isLightTheme.value ? "#124B8D" : "#2A2A2A");

  if (store.isLoggedIn) {
    router.replace("/home");
  }
});

const avatarLabel = computed(() => {
  if (!store.isLoggedIn || !store.user) {
    return "";
  }

  return `${store.user.name.charAt(0)}${store.user.last_name.charAt(0)}`;
});

const isLightTheme = computed(() => store.theme === "light");

const menuComputed = computed(() => {
  const menu = [
    {
      title: "Inicio",
      to: "/home",
      icon: "mdi-home",
    },
  ];

  if (store.isCliente) {
    menu.push({
      title: "Mis autos",
      to: "/mis-autos",
      icon: "mdi-car"
    })
  }

  if (store.isEmpleado) {
    menu.push({
      title: "Autos",
      to: "/autos",
      icon: "mdi-car",
    },)

    menu.push({
      title: "Nuevo cliente",
      to: "/registro",
      icon: "mdi-account"
    })
  }

  if (store.isAdmin) {
    menu.push({
      title: "Nuevo empleado",
      to: "/nuevo-empleado",
      icon: "mdi-account",
    })
  }

  return menu;
});

function installApp() {
  deferredPrompt.value.prompt();
}

function toggleTheme() {
  store.theme = isLightTheme.value ? "dark" : "light";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", isLightTheme.value ? "#124B8D" : "#2A2A2A");
}

function logout() {
  store.$patch({
    isLoggedIn: false,
    user: {
      name: "",
      mail: "",
      rol: -1,
    },
  });

  drawer.value = false;

  router.push("/");
}
</script>
