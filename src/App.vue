<template>
  <v-app theme="blue">
    <v-app-bar color="primary">
      <router-link to="/">
        <img class="mr-3" src="../public/logo.png" height="30" />
      </router-link>
      <v-app-bar-title>Sistema de gestión del automotor</v-app-bar-title>
      <v-spacer />

      <!-- <v-btn to="/login">
        <v-icon left>mdi-lock</v-icon>
        Ingresar
      </v-btn> -->
      <div v-if="store.isLoggedIn">{{ store.user.name }}</div>
      <v-btn @click="logout">Salir</v-btn>
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

const store = useStore();
const router = useRouter();

function logout() {
  store.$patch({
    isLoggedIn: false,
    user: {
      name: '',
      mail: '',
      rol: -1
    }
  })

  router.push('/')
}
</script>
