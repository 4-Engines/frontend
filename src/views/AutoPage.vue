<template>
  <h1>Detalle del Auto {{ car?.carid }}</h1>

  <p>Responsable: {{ car?.owner }}</p>

  <v-card class="mt-4" style="overflow: hidden">
    <v-tabs
      v-model="tab"
      centered
      :stacked="!isMobile"
      :grow="isMobile"
      :background-color="store.theme === 'light' ? '#E1E1E1' : '#333333'"
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
        value="historial"
        @click="router.push({ path: route.path, query: { t: 'historial' } })"
      >
        <v-icon>mdi-history</v-icon>
        <span class="d-none d-sm-inline-block">Historial</span>
      </v-tab>

      <v-tab
        value="administrar"
        @click="router.push({ path: route.path, query: { t: 'administrar' } })"
      >
        <v-icon>mdi-cog</v-icon>
        <span class="d-none d-sm-inline-block">Administrar</span>
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="detalle">
        <v-card title="Detalle">
          <v-card-text>Detalle</v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="turno">
        <v-card title="Nuevo turno">
          <v-card-text>
            <v-text-field v-model="date" type="date" label="Fecha" />

            <label>Hora</label>
            <v-chip-group v-model="time" selected-class="text-primary">
              <v-chip v-for="label in times" :key="label" filter>{{
                label
              }}</v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="historial">
        <v-card title="Historial">
          <v-card-text>Historial</v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item value="administrar">
        <v-card title="Administrar">
          <v-card-text>
            <v-alert>Borrar auto</v-alert>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { getCar } from '@/services/Car.service';
import { useStore } from '@/store';
import { Car } from '@/types/Car';
import { breakpointsVuetify, useBreakpoints } from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const TABS = ['detalle', 'turno', 'historial', 'administrar'];

const router = useRouter();
const route = useRoute();
const store = useStore();
const tab = ref('detalle');
const breakpoints = useBreakpoints(breakpointsVuetify);
const isMobile = breakpoints.smaller('xs');
const loading = ref(false);
const car = ref<Car>();
const date = ref('');
const times = ref([
  '9:00 am',
  '10:00 am',
  '11:00 am',
  '12:00 pm',
  '15:00 pm',
  '16:00 pm',
  '17:00 pm',
  '18:00 pm',
]);
const time = ref('');

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
