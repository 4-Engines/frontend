<template>
  <h1>Detalle del Auto {{ car?.carid }}</h1>

  <p>Responsable: {{ car?.owner }}</p>

  <v-card class="mt-4" style="overflow: hidden">
    <v-tabs
      v-model="tab"
      centered
      :stacked="!isMobile"
      :grow="isMobile"
      :background-color="store.isLightTheme ? '#E1E1E1' : '#333333'"
      color="primary"
    >
      <v-tab
        value="detalle"
        @click="router.push({ path: route.path, query: { t: 'detalle' } })"
      >
        <v-icon>mdi-car</v-icon>
        <span class="d-none d-sm-inline-block">Detalle</span>
      </v-tab>

      <v-tab
        value="turno"
        @click="router.push({ path: route.path, query: { t: 'turno' } })"
      >
        <v-icon>mdi-calendar-search</v-icon>
        <span class="d-none d-sm-inline-block">Nuevo turno</span>
      </v-tab>

      <v-tab
        value="servicios"
        @click="router.push({ path: route.path, query: { t: 'servicios' } })"
      >
        <v-icon>mdi-hammer-wrench</v-icon>
        <span class="d-none d-sm-inline-block">Servicios</span>
      </v-tab>

      <v-tab
        value="administrar"
        @click="router.push({ path: route.path, query: { t: 'administrar' } })"
      >
        <v-icon>mdi-cog</v-icon>
        <span class="d-none d-sm-inline-block">Administrar</span>
      </v-tab>
    </v-tabs>

    <v-window v-model="tab" class="px-4 py-4">
      <v-window-item value="detalle">
        <h2 class="mb-4">Detalle</h2>
        <p>Detalle</p>
      </v-window-item>

      <v-window-item value="turno">
        <nuevo-turno-tab :car="car" />
      </v-window-item>

      <v-window-item value="servicios">
        <h2 class="mb-4">Servicios</h2>

        <div v-if="store.isEmpleado" class="mt-4 text-right">
          <v-btn color="primary">Agregar servicio</v-btn>
        </div>

        <p>Servicios</p>
      </v-window-item>

      <v-window-item value="administrar">
        <h2 class="mb-4">Administrar</h2>
        <v-alert color="red" variant="outlined">Borrar auto</v-alert>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { getCar } from '@/services/Car.service';
import { useStore } from '@/store';
import type { Car } from '@/types/Car';
import { breakpointsVuetify, useBreakpoints } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NuevoTurnoTab from './NuevoTurnoTab.vue';

const TABS = ['detalle', 'turno', 'servicios', 'administrar'];

const router = useRouter();
const route = useRoute();
const store = useStore();
const tab = ref('detalle');
const breakpoints = useBreakpoints(breakpointsVuetify);
const isMobile = breakpoints.smaller('xs');
const loading = ref(false);
const car = ref<Car>();

watch(
  () => route.query.t,
  (value) => (tab.value = value as string)
);

onMounted(async () => {
  if (route.query.t && TABS.includes(route.query.t as string)) {
    tab.value = route.query.t as string;
  }

  try {
    loading.value = true;
    const { data } = await getCar(route.params.id as string);
    car.value = data[0].car;
  } catch (error) {
    console.log(error);

    car.value = {
      _id: '6486484',
      brand: 'Toyota',
      carid: 'AAA234',
      color: '#FFAACC',
      created_at: '05/05/2022',
      id_taller: '46845',
      id_user: '654867',
      model: 'Etios',
      owner: 'rjuarroz@gmail.com',
      status: 'active',
      year: '2012',
    };
  } finally {
    loading.value = false;
  }
});
</script>
