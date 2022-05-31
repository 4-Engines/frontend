<template>
  <h2>Autos</h2>

  <p>Desde acá vas a poder administrar los autos que tengas.</p>

  <div class="mt-5 text-right">
    <v-btn color="primary"> Agregar nuevo auto </v-btn>
  </div>

  {{ cars }}
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getAllCars } from '@/services/Car.service';
import type { Car } from '@/types/Car';
import { useStore } from '@/store';

const store = useStore();
const cars = ref<Car[]>([]);

onMounted(async () => {
  try {
    const { data } = await getAllCars(store.user?.id as string);
    cars.value = data;
  } catch (error) {
    console.log(error);
  }
});
</script>
