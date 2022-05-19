<template>
  <v-snackbar v-model="showReload" fixed>
    <span v-if="offlineReady">Aplicación lista para trabajar offline</span>
    <span v-else
      >Nuevo contenido disponible, tocá en recargar para actualizar.</span
    >

    <template v-slot:actions>
      <v-btn v-if="!offlineReady" color="blue" variant="text" @click="updateServiceWorker">
        Recargar
      </v-btn>
      <v-btn color="blue" variant="text" @click="close"> Cerrar </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRegisterSW } from "virtual:pwa-register/vue";
import { computed } from "@vue/reactivity";
const { updateServiceWorker } = useRegisterSW();

export default defineComponent({
  name: "ReloadPWA",
  setup() {
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
    const close = async () => {
      offlineReady.value = false;
      needRefresh.value = false;
    };

    const showReload = computed(() => offlineReady.value || needRefresh.value || true);
    return {
      offlineReady,
      needRefresh,
      updateServiceWorker,
      close,
      showReload,
    };
  },
  methods: {
    async close() {
      this.offlineReady = false;
      this.needRefresh = false;
    },
    async updateServiceWorker() {
      await updateServiceWorker();
    },
  },
});
</script>
