<template>
  <h2 class="mb-4">Servicios</h2>
  <p class="mb-6">Estos son los servicios que tuviste con nosotros.</p>

  <v-dialog
    v-model="nuevoServicioModal"
    :fullscreen="isMobile"
    :scrim="!isMobile"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark :color="isMobile ? 'primary' : 'transparent'">
        <v-toolbar-title>Nuevo servicio</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon variant="text" @click="nuevoServicioModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-btn color="primary" @click="nuevoServicioModal = false">
          Cargar servicio
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-btn
    v-if="store.isEmpleado && active"
    title="Agregar nuevo servicio"
    icon="mdi-plus"
    color="primary"
    size="large"
    style="position: fixed; right: 20px; bottom: 20px"
    @click="nuevoServicioModal = true"
  ></v-btn>
</template>

<script setup lang="ts">
import { useStore } from '@/store';
import { useMobile } from '@/composables/useMobile';
import { ref } from 'vue';

defineProps({
  active: { type: Boolean, default: false },
});

const store = useStore();
const { isMobile } = useMobile();
const nuevoServicioModal = ref(false);
</script>
