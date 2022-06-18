<template>
  <h2 class="mb-4">Turnos</h2>

  <p v-if="turnos.length === 0" class="mb-6">
    Este auto no tiene ningún turno, para solicitar uno llená el formulario.
  </p>

  <p v-else class="mb-6">Estos son los turnos encontrados para este auto.</p>

  <v-card
    v-for="turno in turnos"
    :key="`${turno.fecha}-${turno.turno}`"
    class="mb-4"
  >
    <v-list-item>
      <v-list-item-avatar start color="primary">
        <v-icon :class="{ 'text-grey-darken-4': !store.isLightTheme }"
          >mdi-calendar-check</v-icon
        >
      </v-list-item-avatar>
      <v-list-item-header>
        <v-list-item-title>
          {{ turno.fecha }} {{ turno.turno }}
        </v-list-item-title>
        <v-list-item-subtitle> Titular: {{ turno.id }} </v-list-item-subtitle>
      </v-list-item-header>
    </v-list-item>
  </v-card>

  <v-dialog v-model="turnoModal" scrollable persistent>
    <v-form ref="formRef" @submit.prevent="handleNewAppointment">
      <v-card :style="{ width: isMobile ? '326px' : '500px' }">
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

          <p
            class="mt-5 font-weight-bold text-right rounded pa-4 mb-2 d-flex"
            :class="
              store.isLightTheme ? 'bg-grey-lighten-2' : 'bg-grey-darken-3'
            "
          >
            TOTAL
            <v-spacer />
            {{ totalAmount }}
          </p>

          <!-- <v-textarea
            v-model="form.details"
            class="mt-4"
            rows="3"
            variant="outlined"
            :label="`Observaciones ${isOtherSelected ? '' : '(opcional)'}`"
            :rules="isOtherSelected ? [rules.required] : undefined"
          ></v-textarea> -->
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn color="dark" text type="reset" @click="handleCloseModal">
            Cerrar
          </v-btn>
          <v-btn color="primary" text type="submit">Solicitar turno</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
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
import { Appointment } from '@/types/Appointment';

const props = defineProps({
  car: { type: Object as PropType<Car>, default: undefined },
  turnos: { type: Array as PropType<Appointment[]>, default: () => [] },
});
const emit = defineEmits(['reload']);

const store = useStore();
const { isMobile } = useMobile();
const overlay = useOverlay();
const snackbar = useSnackbar();
const turnoModal = ref(false);
const formRef = ref<any>(null);
const times = ref([
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
]);
const form = reactive({
  date: '',
  time: '',
  details: '',
  services: [] as number[],
});
// const isOtherSelected = computed(() => form.services.includes(0));
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
}

async function handleNewAppointment() {
  const validateForm = await formRef.value?.validate();
  if (!validateForm.valid) {
    return;
  }

  try {
    overlay.show('Solicitando turno...');

    const fechaArr = form.date.split('-').reverse();
    if (parseInt(fechaArr[1]) < 10) {
      fechaArr[1] = fechaArr[1].charAt(1);
    }
    const hora = times.value[parseInt(form.time)];

    await newAppointment({
      user: store.user?.username as string,
      carid: props.car?.carid as string,
      fecha: fechaArr.join('/'),
      hora,
      // details: form.details,
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
