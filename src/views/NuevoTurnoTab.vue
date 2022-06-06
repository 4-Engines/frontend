<template>
  <h2 class="mb-4">Nuevo turno</h2>
  <v-text-field
    v-model="form.date"
    type="date"
    label="Fecha"
    variant="outlined"
  />

  <label>Hora</label>
  <v-chip-group v-model="form.time" selected-class="text-primary" column>
    <v-chip v-for="label in times" :key="label" filter>{{ label }}</v-chip>
  </v-chip-group>

  <v-textarea
    v-model="form.comments"
    class="mt-4"
    rows="3"
    variant="outlined"
    label="Comentarios (opcional)"
  ></v-textarea>

  <div class="text-right">
    <v-btn color="primary">Solicitar turno</v-btn>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

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

const form = reactive({
  date: '',
  time: '',
  comments: '',
});
</script>
