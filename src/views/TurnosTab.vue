<template>
  <h2 class="mb-4">Turnos</h2>

  <p class="mb-6">
    Este auto no tiene ningún turno, para solicitar uno llená el formulario.
  </p>

  <v-form ref="formRef" @submit.prevent="handleNewAppointment">
    <v-text-field
      v-model="form.date"
      type="date"
      label="Fecha"
      variant="outlined"
      :rules="[rules.required]"
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
      :rules="[rules.required]"
    ></v-textarea>

    <div class="text-right">
      <v-btn color="primary" type="submit">Solicitar turno</v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { PropType, reactive, ref } from 'vue';
import { useStore } from '@/store';
import { newAppointment } from '@/services/Appointment.service';
import type { Car } from '@/types/Car';
import { required } from '@/rules';
import { useOverlay } from '@/composables/useOverlay';
import { useSnackbar } from '@/composables/useSnackbar';

const props = defineProps({
  car: { type: Object as PropType<Car>, default: undefined },
});

const store = useStore();
const overlay = useOverlay();
const snackbar = useSnackbar();
const errorMessage = ref('');
const turnoSolicitado = ref(false);
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
const rules = {
  required,
};

async function handleNewAppointment() {
  errorMessage.value = '';

  try {
    overlay.show('Solicitando turno...');
    await newAppointment({
      id_owner: store.user?.id as string,
      id_car: props.car?._id as string,
      date: form.date,
      time: form.time,
      comments: form.comments,
    });
    turnoSolicitado.value = true;
    snackbar.show('¡Turno solicitado con éxito!');
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    overlay.hide();
  }
}
</script>
