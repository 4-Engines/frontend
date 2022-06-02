<template>
  <h2>Autos</h2>

  <p v-if="store.isCliente">
    Desde acá vas a poder administrar los autos que tengas.
  </p>
  <p v-else>Estos son los autos disponibles en el taller.</p>

  <div class="my-5 text-right">
    <v-btn :disabled="loading" color="primary"> Agregar auto </v-btn>
  </div>

  <v-alert v-if="errorMessage.length > 0" type="error" class="mb-4">
    {{ errorMessage }}
  </v-alert>

  <template v-if="isMobile">
    <v-card v-for="car in cars" :key="car._id" class="mb-3">
      <v-card-title>
        <v-avatar class="mr-4" size="x-small" :color="car.color"></v-avatar>
        {{ car.carid }}
        <v-spacer />
        <v-btn
          icon="mdi-calendar-search"
          color="primary"
          flat
          variant="text"
          title="Solicitar turno" />
        <v-btn title="Historial" icon="mdi-history" variant="text" flat />
        <v-btn
          title="Eliminar"
          icon="mdi-car-off"
          variant="text"
          color="red"
          flat
      /></v-card-title>
      <v-card-subtitle>Dueño: {{ car.owner }}</v-card-subtitle>
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
      <!-- <v-card-actions>
        <v-btn color="primary" text>Solicitar turno</v-btn>
        <v-btn color="red" text>Eliminar</v-btn>
      </v-card-actions> -->
    </v-card>
  </template>
  <v-card v-else>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Color</th>
          <th class="text-left">Dominio</th>
          <th class="text-left">Marca</th>
          <th class="text-left">Modelo</th>
          <th class="text-left">Año</th>
          <th v-if="!store.isCliente" class="text-left">Dueño</th>
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
        <tr v-for="car in cars" :key="car._id">
          <td><v-avatar size="x-small" :color="car.color"></v-avatar></td>
          <td>
            <strong>{{ car.carid }}</strong>
          </td>
          <td>{{ car.brand }}</td>
          <td>{{ car.model }}</td>
          <td>{{ car.year }}</td>
          <td v-if="!store.isCliente">{{ car.owner }}</td>
          <td class="text-right">
            <v-btn
              icon="mdi-calendar-search"
              color="primary"
              flat
              variant="text"
              title="Solicitar turno"
            />
            <v-btn title="Historial" icon="mdi-history" variant="text" flat />
            <v-btn
              title="Eliminar"
              icon="mdi-car-off"
              variant="text"
              color="red"
              flat
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useBreakpoints, breakpointsVuetify } from '@vueuse/core';
import { useStore } from '@/store';
import { getAllCars } from '@/services/Car.service';
import type { Car } from '@/types/Car';

const store = useStore();
const cars = ref<Car[]>([]);
const errorMessage = ref('');
const loading = ref(false);
const breakpoints = useBreakpoints(breakpointsVuetify);
const isMobile = breakpoints.smaller('xs');
const emptyList = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    const { data } = await getAllCars(store.user?.id as string);
    cars.value = data[0].cars;

    if (data[0].cars.length === 0) {
      emptyList.value = true;
    }
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;

    cars.value = [
      {
        _id: '1',
        brand: 'Fiat',
        carid: 'AAA123',
        color: '#FFAACC',
        id_taller: 'TallerMasMotor',
        id_user: 'ersdf4',
        model: 'Uno',
        owner: 'jsbarra@gmail.com',
        year: '2017',
        created_at: '22/22/2222',
      },
      {
        _id: '2',
        brand: 'Fiat',
        carid: 'UUU432',
        color: '#004590',
        id_taller: 'TallerMasMotor',
        id_user: 'ersdf4',
        model: 'Idea',
        owner: 'jcortazar@gmail.com',
        year: '2016',
        created_at: '22/22/2222',
      },
    ];
  }
});
</script>
