<template>
  <h2 class="mb-4">Turnos</h2>

  <p class="mb-6">
    Este auto no tiene ningún turno, para solicitar uno llená el formulario.
  </p>

  <v-dialog v-model="turnoModal" scrollable persistent>
    <v-card :style="{ width: isMobile ? '326px' : '500px' }">
      <v-form ref="formRef" @submit.prevent="handleNewAppointment">
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

          <v-select
            v-model="form.services"
            class="mt-6"
            label="Servicios"
            :items="formattedServices"
            :rules="[rules.required]"
            multiple
            chips
            variant="outlined"
            hide-details="auto"
          >
          </v-select>

          <p class="mt-3 text-right font-weight-bold">
            TOTAL: {{ totalAmount }}
          </p>

          <v-textarea
            v-model="form.comments"
            class="mt-4"
            rows="3"
            variant="outlined"
            :label="`Observaciones ${isOtherSelected ? '' : '(opcional)'}`"
            :rules="isOtherSelected ? [rules.required] : undefined"
          ></v-textarea>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn color="dark" text @click="handleCloseModal"> Cerrar </v-btn>
          <v-btn color="primary" text type="submit">Solicitar turno</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, PropType, reactive, ref } from 'vue';
import { useStore } from '@/store';
import { newAppointment } from '@/services/Appointment.service';
import type { Car } from '@/types/Car';
import * as rules from '@/rules';
import { useOverlay } from '@/composables/useOverlay';
import { useSnackbar } from '@/composables/useSnackbar';
import { useMobile } from '@/composables/useMobile';
import { SERVICES } from '@/constants/Services';
import { currencyFormatter } from '@/utils/currencyFormatter';

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
  services: [] as number[],
});
const isOtherSelected = computed(() => form.services.includes(0));
const formattedServices = computed(() =>
  SERVICES.map((service) => ({
    value: service.value,
    title: `${service.title} (${currencyFormatter.format(service.price)})`,
  }))
);
const totalAmount = computed(() => {
  const amount = SERVICES.filter((service) =>
    form.services.includes(service.value)
  ).reduce((a, b) => a + b.price, 0);

  return currencyFormatter.format(amount);
});

function handleCloseModal() {
  turnoModal.value = false;
  formRef.value.reset();
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
    formRef.value.reset();
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
