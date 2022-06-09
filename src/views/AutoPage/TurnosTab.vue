<template>
  <h2 class="mb-4">Turnos</h2>

  <p class="mb-6">
    Este auto no tiene ningún turno, para solicitar uno llená el formulario.
  </p>

  <v-dialog v-model="turnoModal" scrollable persistent>
    <v-form ref="formRef" @submit.prevent="handleNewAppointment">
      <v-card :style="{ width: isMobile ? 'auto' : '500px' }">
        <v-card-title>Nuevo turno</v-card-title>

        <v-divider />

        <v-card-text>
          <v-text-field
            v-model="form.date"
            type="date"
            label="Fecha"
            variant="outlined"
            :rules="[rules.required]"
          />

          <label>Hora</label>
          <v-chip-group
            v-model="form.time"
            selected-class="text-primary"
            column
          >
            <v-chip v-for="label in times" :key="label" filter>{{
              label
            }}</v-chip>
          </v-chip-group>

          <v-textarea
            v-model="form.comments"
            class="mt-4"
            rows="3"
            variant="outlined"
            label="Comentarios (opcional)"
            :rules="[rules.required]"
          ></v-textarea>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn color="dark" text @click="handleCloseModal"> Cerrar </v-btn>
          <v-btn color="primary" text type="submit">Solicitar turno</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { PropType, reactive, ref } from 'vue';
import { useStore } from '@/store';
import { newAppointment } from '@/services/Appointment.service';
import type { Car } from '@/types/Car';
import * as rules from '@/rules';
import { useOverlay } from '@/composables/useOverlay';
import { useSnackbar } from '@/composables/useSnackbar';
import { useMobile } from '@/composables/useMobile';

const props = defineProps({
  car: { type: Object as PropType<Car>, default: undefined },
});
const emit = defineEmits(['reload']);

const store = useStore();
const { isMobile } = useMobile();
const overlay = useOverlay();
const snackbar = useSnackbar();
const turnoModal = ref(false);
const formRef = ref<any>(null);
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

function resetForm() {
  form.date = '';
  form.time = '';
  form.comments = '';
}

function handleCloseModal() {
  turnoModal.value = false;
  resetForm();
}

async function handleNewAppointment() {
  const validateForm = await formRef.value?.validate();
  if (!validateForm.valid) {
    return;
  }

  try {
    overlay.show('Solicitando turno...');
    await newAppointment({
      id_owner: store.user?.id as string,
      id_car: props.car?._id as string,
      date: form.date,
      time: form.time,
      comments: form.comments,
    });
    snackbar.show('¡Turno solicitado con éxito!');
    turnoModal.value = false;
    resetForm();
    emit('reload');
  } catch (error: any) {
    snackbar.show(error.message || 'Ocurrió un error al solicitar el turno');
  } finally {
    overlay.hide();
  }
}

defineExpose({
  turnoModal,
});
</script>
