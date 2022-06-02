<template>
  <h1>Auto {{ $route.params.id }}</h1>
  <v-card>
    <v-tabs v-model="tab" centered>
      <v-tab value="nuevo-turno">
        <v-icon>mdi-calendar-search</v-icon>
        Nuevo turno
      </v-tab>

      <v-tab value="historial">
        <v-icon>mdi-history</v-icon>
        Historial
      </v-tab>

      <v-tab value="borrar">
        <v-icon>mdi-car-off</v-icon>
        Borrar
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
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const tab = ref('solicitar-turno');
const TABS = ['solicitar-turno', 'historial', 'borrar'];

onMounted(() => {
  if (route.query.t && TABS.includes(route.query.t as string)) {
    tab.value = route.query.t as string;
  }
});
</script>
