<template>
  <h1>Detalle del Auto {{ $route.params.id }}</h1>
  <v-card style="overflow: hidden">
    <v-tabs
      v-model="tab"
      centered
      :stacked="!isMobile"
      :grow="isMobile"
      :background-color="store.theme === 'light' ? '#E1E1E1' : '#333333'"
      color="primary"
    >
      <v-tab value="nuevo-turno">
        <v-icon>mdi-calendar-search</v-icon>
        <span class="d-none d-sm-inline-block">Nuevo turno</span>
      </v-tab>

      <v-tab value="historial">
        <v-icon>mdi-history</v-icon>
        <span class="d-none d-sm-inline-block">Historial</span>
      </v-tab>

      <v-tab value="borrar">
        <v-icon>mdi-cog</v-icon>
        <span class="d-none d-sm-inline-block">Administrar</span>
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="nuevo-turno">
        <v-card>
          <v-card-text>Nuevo turno</v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="historial">
        <v-card>
          <v-card-text>Historial</v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="borrar">
        <v-card>
          <v-card-text>Borrar</v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { useStore } from '@/store';
import { breakpointsVuetify, useBreakpoints } from '@vueuse/core';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const store = useStore();
const tab = ref('solicitar-turno');
const TABS = ['solicitar-turno', 'historial', 'borrar'];
const breakpoints = useBreakpoints(breakpointsVuetify);
const isMobile = breakpoints.smaller('xs');

onMounted(() => {
  if (route.query.t && TABS.includes(route.query.t as string)) {
    tab.value = route.query.t as string;
  }
});
</script>
