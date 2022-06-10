<template>
  <v-breadcrumbs>
    <v-breadcrumbs-item to="/autos">Autos</v-breadcrumbs-item>
    <v-breadcrumbs-divider>/</v-breadcrumbs-divider>
    <v-breadcrumbs-item disabled :to="`/autos/${car?.carid}`">{{
      car?.carid
    }}</v-breadcrumbs-item>
  </v-breadcrumbs>

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
        value="turnos"
        @click="router.push({ path: route.path, query: { t: 'turnos' } })"
      >
        <v-icon>mdi-calendar-search</v-icon>
        <span class="d-none d-sm-inline-block">Turnos</span>
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

      <v-window-item value="turnos">
        <turnos-tab ref="turnosTabRef" :car="car" @reload="fetchCar" />
      </v-window-item>

      <v-window-item value="servicios">
        <servicio-tab ref="servicioTabRef" :car="car" @reload="fetchCar" />
      </v-window-item>

      <v-window-item value="administrar">
        <h2 class="mb-4">Administrar</h2>
        <v-alert color="red" variant="outlined">Eliminar auto</v-alert>
      </v-window-item>
    </v-window>
  </v-card>

  <!-- <v-btn
    v-if="tab === 'turnos'"
    title="Solicitar turno"
    icon="mdi-calendar-plus"
    color="primary"
    size="large"
    style="position: fixed; right: 20px; bottom: 20px"
  ></v-btn>

  <v-btn
    v-if="store.isEmpleado && tab === 'servicios'"
    title="Agregar nuevo servicio"
    icon="mdi-cart-plus"
    color="primary"
    size="large"
    style="position: fixed; right: 20px; bottom: 20px"
    @click="servicioTabRef.nuevoServicioModal = true"
  ></v-btn> -->

  <v-fab-transition>
    <v-btn
      v-if="activeFab"
      :key="activeFab.icon"
      class="v-btn--fab"
      :icon="activeFab.icon"
      color="primary"
      :title="activeFab.title"
      @click="activeFab.click"
    />
  </v-fab-transition>
</template>

<script setup lang="ts">
import { useMobile } from '@/composables/useMobile';
import { getCar } from '@/services/Car.service';
import { useStore } from '@/store';
import type { Car } from '@/types/Car';
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TurnosTab from './TurnosTab.vue';
import ServicioTab from './ServicioTab.vue';
import { useSnackbar } from '@/composables/useSnackbar';
import { useOverlay } from '@/composables/useOverlay';

const TABS = ['detalle', 'turnos', 'servicios', 'administrar'];

const router = useRouter();
const route = useRoute();
const store = useStore();
const snackbar = useSnackbar();
const overlay = useOverlay();
const tab = ref('detalle');
const { isMobile } = useMobile();
const car = ref<Car>();
const servicioTabRef = ref<any>(null);
const turnosTabRef = ref<any>(null);
const activeFab = computed(() => {
  switch (tab.value) {
    case 'turnos':
      return {
        title: 'Solicitar turno',
        icon: 'mdi-calendar-plus',
        click: () => (turnosTabRef.value.turnoModal = true),
      };
    case 'servicios':
      return {
        title: 'Agregar nuevo servicio',
        icon: 'mdi-cart-plus',
        click: () => (servicioTabRef.value.nuevoServicioModal = true),
      };
    default:
      return null;
  }
});

watch(
  () => route.query.t,
  (value) => (tab.value = value as string)
);

onMounted(() => {
  if (route.query.t && TABS.includes(route.query.t as string)) {
    tab.value = route.query.t as string;
  }

  fetchCar();
});

async function fetchCar() {
  try {
    overlay.show('Cargando auto...');
    const { data } = await getCar(route.params.id as string);
    car.value = data[0].car;
  } catch (error: any) {
    snackbar.show(
      error.message || 'Ocurrió un error al obtener la información del auto'
    );
  } finally {
    overlay.hide();
  }
}
</script>
