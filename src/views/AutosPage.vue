<template>
  <h2>Autos</h2>

  <p v-if="store.isCliente">
    Desde acá vas a poder administrar los autos que tengas.
  </p>
  <p v-else>Estos son los autos disponibles en el taller.</p>

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
          size="small"
          title="Información del auto"
          @click="showCarDetail(car)" />

        <v-btn
          icon="mdi-calendar-search"
          :color="actionButtonColor"
          flat
          variant="text"
          size="small"
          title="Turnos"
          :to="`/autos/${car.carid}`" />

        <v-btn
          title="Servicios"
          icon="mdi-hammer-wrench"
          :color="actionButtonColor"
          variant="text"
          size="small"
          flat
          :to="`/autos/${car.carid}?t=servicios`" />
        <v-btn
          title="Eliminar auto"
          icon="mdi-car-off"
          color="red"
          variant="text"
          size="small"
          flat
          @click="showDeleteCardDialog(car)"
      /></v-card-title>
      <v-card-subtitle v-if="car.status === 'no active'"
        ><v-chip size="small" color="red">NO ACTIVO</v-chip></v-card-subtitle
      >
      <v-card-text>
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-left">Marca</th>
              <th class="text-left">Modelo</th>
              <th class="text-left">Titular</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ car.brand }}</td>
              <td>{{ car.model }}</td>
              <td>{{ car.owner }}</td>
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
          <th v-if="!store.isCliente">Titular</th>
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
              @click="showCarDetail(car)"
            />
            <v-btn
              icon="mdi-calendar-search"
              :color="actionButtonColor"
              size="small"
              flat
              variant="text"
              title="Turnos"
              :to="`/autos/${car.carid}`"
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

            <v-btn
              title="Eliminar auto"
              icon="mdi-car-off"
              color="red"
              size="small"
              variant="text"
              flat
              @click="showDeleteCardDialog(car)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>

  <div class="my-16"></div>

  <registro-auto-modal ref="registroAuto" @reload="fetchCars" />

  <v-dialog v-model="detailDialog">
    <v-card :style="{ width: isMobile ? '326px' : '500px' }">
      <v-img
        src="/car-placeholder.jpg"
        class="white--text align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="200px"
        cover
      >
        <v-card-title class="text-white">
          <v-avatar
            size="x-small"
            class="mr-3"
            :color="selectedCar?.color"
          ></v-avatar>
          {{ selectedCar?.carid }}
        </v-card-title>
      </v-img>

      <v-card-text>
        <p>{{ selectedCar?.brand }} {{ selectedCar?.model }}</p>
        <p>Año: {{ selectedCar?.year }}</p>
        <p>Titular: {{ selectedCar?.owner }}</p>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn color="dark" @click="detailDialog = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteCarDialog">
    <v-card>
      <v-card-title>Eliminar auto</v-card-title>
      <v-divider />
      <v-card-text
        ><p>
          ¿Estás seguro de que querés eliminar el auto con dominio
          <strong>{{ selectedCar?.carid }}</strong
          >?
        </p>
        <p class="mt-2">Esta acción no puede deshacerse.</p></v-card-text
      >
      <v-divider />
      <v-card-actions>
        <v-btn color="dark" @click="deleteCarDialog = false">Cerrar</v-btn>
        <v-btn color="red" @click="handleDeleteCar">Eliminar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-fab-transition>
    <v-btn
      class="v-btn--fab"
      icon="mdi-plus"
      title="Agregar auto"
      color="primary"
      @click="registroAuto.registroAutoModal = true"
    />
  </v-fab-transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from '@/store';
import { getAllCars, getMyCars } from '@/services/Car.service';
import type { Car } from '@/types/Car';
import { useMobile } from '@/composables/useMobile';
import RegistroAutoModal from './RegistroAutoModal.vue';

const store = useStore();
const cars = ref<Car[]>([]);
const errorMessage = ref('');
const loading = ref(false);
const { isMobile } = useMobile();
const emptyList = ref(false);
const filter = ref('');
const registroAuto = ref<any>(null);
const detailDialog = ref(false);
const actionButtonColor = computed(() =>
  store.isLightTheme ? '#6D6D6D' : '#ADADAD'
);
const deleteCarDialog = ref(false);

onMounted(() => {
  fetchCars();
});
const selectedCar = ref<Car>();

const carsFiltered = computed(() => {
  if (filter.value === '') {
    return cars.value;
  }

  return cars.value.filter((car) =>
    car.carid.toLocaleUpperCase().includes(filter.value.toLocaleUpperCase())
  );
});

function showCarDetail(car: Car) {
  selectedCar.value = car;
  detailDialog.value = true;
}

function showDeleteCardDialog(car: Car) {
  selectedCar.value = car;
  deleteCarDialog.value = true;
}

function handleDeleteCar() {
  deleteCarDialog.value = false;
}

async function fetchCars() {
  loading.value = true;
  try {
    const { data } = await (store.isEmpleado
      ? getAllCars(store.user?.id as string)
      : getMyCars(store.user?.username as string));

    if (data[0].status === 'error') {
      throw Error(data[0].msj);
    }
    cars.value = store.isEmpleado ? data[0].car : data[0].cars;

    if (
      (data[0].car && data[0].car.length === 0) ||
      (data[0].cars && data[0].cars.length === 0)
    ) {
      emptyList.value = true;
    }
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>
