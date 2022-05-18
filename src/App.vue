<template>
  <reload-p-w-a />
  <v-app theme="blue">
    <v-navigation-drawer v-if="store.isLoggedIn" v-model="drawer">
      <v-list>
        <v-list-item :subtitle="store.user.mail">
          <template #title>
            {{ store.user.name }} {{ store.user.last_name }}
          </template>
          <template #prepend>
            <v-list-item-avatar start>
              <v-avatar color="primary"></v-avatar>
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
        >
          <v-list-item-avatar start>
            <v-icon :icon="item.icon"></v-icon>
          </v-list-item-avatar>
          {{ item.title }}
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-avatar start>
            <v-icon icon="mdi-lock-open"></v-icon>
          </v-list-item-avatar>
          Salir
        </v-list-item>
      </v-list>

      <v-alert color="primary" style="border-radius: 0;" density="compact" v-if="!showInstallPromotion">
        <p>Instalá nuestra aplicación. No va a ocupar lugar en tu teléfono.</p>
        <v-btn color="white" class="mt-2" @click="installApp">Instalar</v-btn>
      </v-alert>
    </v-navigation-drawer>

    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon v-if="store.isLoggedIn" @click="drawer = !drawer" />

      <!--  <router-link to="/">
        <img class="mr-3" src="../public/logo.png" height="30" />
      </router-link> -->
      <v-app-bar-title>Sistema de gestión del automotor</v-app-bar-title>
      <v-spacer />

      <!-- <v-btn to="/login">
        <v-icon left>mdi-lock</v-icon>
        Ingresar
      </v-btn> -->
      <!-- <v-btn @click="logout">Salir</v-btn> -->
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <!-- <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view> -->
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
const deferredPrompt = ref<Event>();
const showInstallPromotion = ref(false);
const drawer = ref(false);

onMounted(() => {
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt.value = e;
    // Update UI notify the user they can install the PWA
    showInstallPromotion.value = true;
  });
});

const menuComputed = computed(() => {
  const menu = [
    {
      title: "Inicio",
      to: "/home",
      icon: "mdi-home",
    },
    {
      title: "Autos",
      to: "/autos",
      icon: "mdi-car",
    },
  ];

  return menu;
});

function installApp() {
  // @ts-ignore
  deferredPrompt.value.prompt();
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

  router.push("/");
}
</script>
