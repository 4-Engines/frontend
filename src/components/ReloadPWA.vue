<template>
  <v-snackbar v-model="showReload" fixed>
    <span v-if="offlineReady">Aplicación lista para trabajar offline</span>
    <span v-else>Nuevo contenido disponible.</span>

    <template #actions>
      <v-btn v-if="offlineReady" color="primary" variant="text" @click="close"
        >Cerrar</v-btn
      >
      <v-btn
        v-else
        color="primary"
        variant="text"
        @click="handleUpdateServiceWorker"
      >
        Recargar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { computed } from 'vue';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
const showReload = computed(
  () => offlineReady.value || needRefresh.value || true
);

function close() {
  offlineReady.value = false;
  needRefresh.value = false;
}

async function handleUpdateServiceWorker() {
  await updateServiceWorker();
}
</script>
