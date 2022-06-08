<template>
  <h2>Autos</h2>

  <p v-if="store.isCliente">
    Desde acá vas a poder administrar los autos que tengas.
  </p>
  <p v-else>Estos son los autos disponibles en el taller.</p>

  <div class="my-5 text-right">
    <v-btn color="primary" to="/registro-auto">Agregar auto</v-btn>
  </div>

  <v-alert v-if="errorMessage.length > 0" type="error" class="mb-4">
    {{ errorMessage }}
  </v-alert>

  <v-text-field
    v-model="filter"
    :disabled="errorMessage.length > 0"
    variant="outlined"
    label="Filtrar por dominio"
    class="mb-3"
    density="comfortable"
    hide-details
    prepend-inner-icon="mdi-magnify"
    clearable
  />

  <template v-if="isMobile">
    <v-card v-if="loading">
      <v-card-text class="text-center py-7">
        <v-progress-circular indeterminate size="32"></v-progress-circular>
        <p class="mt-3">Cargando...</p>
      </v-card-text>
    </v-card>

    <v-card v-if="emptyList">
      <v-card-text class="text-center py-5">
        <v-icon size="64">mdi-gauge-empty</v-icon>
        <p class="mt-3">No se encontraron autos</p>
      </v-card-text>
    </v-card>

    <v-card v-for="car in carsFiltered" :key="car._id" class="mb-3">
      <v-card-title>
        <v-avatar class="mr-4" size="x-small" :color="car.color"></v-avatar>
        <v-chip label
          ><strong>{{ car.carid }}</strong></v-chip
        >
        <v-spacer />
        <v-btn
          icon="mdi-car-info"
          :color="actionButtonColor"
          flat
          variant="text"
          title="Información del auto"
          :to="`/autos/${car.carid}`" />
        <v-btn
          icon="mdi-calendar-search"
          :color="actionButtonColor"
          flat
          variant="text"
          title="Turnos"
          :to="`/autos/${car.carid}?t=turnos`" />
        <!-- <v-btn title="Historial" icon="mdi-history" variant="text" flat /> -->
        <v-btn
          title="Servicios"
          icon="mdi-hammer-wrench"
          :color="actionButtonColor"
          variant="text"
          flat
          :to="`/autos/${car.carid}?t=servicios`"
      /></v-card-title>
      <v-card-subtitle>Responsable: {{ car.owner }}</v-card-subtitle>
      <v-card-text v-if="car.status === 'no active'" class="pb-0"
        ><v-chip size="small" color="red">NO ACTIVO</v-chip></v-card-text
      >
      <v-card-text>
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-left">Marca</th>
              <th class="text-left">Modelo</th>
              <th class="text-left">Año</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ car.brand }}</td>
              <td>{{ car.model }}</td>
              <td>{{ car.year }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </template>

  <v-card v-else>
    <v-table>
      <thead>
        <tr>
          <th style="width: 1%"></th>
          <th>Dominio</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th v-if="!store.isCliente">Responsable</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="store.isCliente ? 6 : 7" class="text-center py-7">
            <v-progress-circular indeterminate size="32"></v-progress-circular>
            <p class="mt-3">Cargando...</p>
          </td>
        </tr>
        <tr v-if="emptyList">
          <td :colspan="store.isCliente ? 6 : 7" class="text-center py-5">
            <v-icon size="64">mdi-gauge-empty</v-icon>
            <p class="mt-3">No se encontraron autos</p>
          </td>
        </tr>
        <tr v-for="car in carsFiltered" :key="car._id">
          <td><v-avatar size="x-small" :color="car.color"></v-avatar></td>
          <td>
            <v-chip label
              ><strong>{{ car.carid }}</strong></v-chip
            >
          </td>
          <td>{{ car.brand }}</td>
          <td>{{ car.model }}</td>
          <td>{{ car.year }}</td>
          <td v-if="!store.isCliente">{{ car.owner }}</td>
          <td class="text-right">
            <v-chip v-if="car.status === 'no active'" size="small" color="red"
              >NO ACTIVO</v-chip
            >
            <v-btn
              icon="mdi-car-info"
              :color="actionButtonColor"
              size="small"
              flat
              variant="text"
              title="Información del auto"
              :to="`/autos/${car.carid}`"
            />
            <v-btn
              icon="mdi-calendar-search"
              :color="actionButtonColor"
              size="small"
              flat
              variant="text"
              title="Turnos"
              :to="`/autos/${car.carid}?t=turnos`"
            />
            <!-- <v-btn title="Historial" icon="mdi-history" variant="text" flat /> -->
            <v-btn
              title="Servicios"
              icon="mdi-hammer-wrench"
              :color="actionButtonColor"
              size="small"
              variant="text"
              flat
              :to="`/autos/${car.carid}?t=servicios`"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@/store';
import { getAllCars, getMyCars } from '@/services/Car.service';
import type { Car } from '@/types/Car';
import { useMobile } from '@/composables/useMobile';

const store = useStore();
const cars = ref<Car[]>([]);
const errorMessage = ref('');
const loading = ref(false);
const { isMobile } = useMobile();
const emptyList = ref(false);
const filter = ref('');

const actionButtonColor = computed(() =>
  store.isLightTheme ? '#6D6D6D' : '#ADADAD'
);

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await (store.isEmpleado
      ? getAllCars(store.user?.id as string)
      : getMyCars(store.user?.username as string));

    if (data[0].status === 'error') {
      throw Error(data[0].msj);
    }
    cars.value = data[0].cars;

    if (data[0].cars.length === 0) {
      emptyList.value = true;
    }
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
});

const carsFiltered = computed(() => {
  if (filter.value === '') {
    return cars.value;
  }

  return cars.value.filter((car) =>
    car.carid.toLocaleUpperCase().includes(filter.value.toLocaleUpperCase())
  );
});
</script>
