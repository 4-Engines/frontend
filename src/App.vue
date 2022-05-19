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
    </v-navigation-drawer>

    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon v-if="store.isLoggedIn" @click="drawer = !drawer" />
      <v-app-bar-title>
        <span class="d-block d-sm-none">SiGeA</span>
        <span class="d-none d-sm-block">Sistema de gestión del automotor</span>
      </v-app-bar-title>

      <v-spacer />

      <v-btn v-if="showInstallPromotion" @click="installApp">Instalar App</v-btn>
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
});

const avatarLabel = computed(() => {
  if (!store.isLoggedIn) {
    return "";
  }

  return `${store.user.name.charAt(0)}${store.user.last_name.charAt(0)}`;
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
