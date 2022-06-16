<template>
  <h2 class="mb-4">Servicios</h2>
  <p v-if="store.isCliente" class="mb-6">
    Estos son los servicios que tuviste con nosotros.
  </p>
  <p v-else class="mb-6">
    Estos son los servicios que se le hicieron a este auto.
  </p>

  <v-expansion-panels
    v-for="service in services"
    :key="service.created_at"
    class="mb-4"
  >
    <v-expansion-panel>
      <v-expansion-panel-title>
        <v-list-item
          class="text-left py-0 px-0"
          :prepend-icon="getServiceObject(service.services[0])?.icon"
          :title="service.created_at"
          :subtitle="getServiceSubtitle(service.services)"
        >
        </v-list-item>

        <template #actions="{ expanded }">
          <v-icon
            color="primary"
            :icon="expanded ? 'mdi-information' : 'mdi-information-outline'"
          ></v-icon>
        </template>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <h4 class="mt-2 mb-4">Servicios realizados</h4>

        <div
          v-for="label in getServicesLabel(service.services)"
          :key="label"
          class="mb-2"
        >
          <v-chip label> {{ label }}</v-chip>
        </div>

        <h4 class="mt-5 mb-4">Observaciones</h4>

        {{ service.details || 'Sin observaciones' }}

        <template
          v-if="service.services.length > 1 || service.services[0] !== 0"
        >
          <v-divider class="mt-4"></v-divider>
          <p class="mt-3 font-weight-bold">
            TOTAL: {{ getTotalAmountByServices(service.services) }}
          </p>
        </template>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-dialog v-model="nuevoServicioModal" scrollable persistent>
    <v-form ref="formRef" @submit.prevent="handleAddService">
      <v-card :style="{ width: isMobile ? '326px' : '500px' }">
        <v-card-title>Nuevo servicio</v-card-title>

        <v-divider />

        <v-card-text>
          <v-select
            v-model="form.services"
            label="Servicios"
            :items="formattedServices"
            :rules="[rules.required]"
            multiple
            chips
            variant="outlined"
            hide-details="auto"
            autofocus
          ></v-select>

          <p class="mt-3 text-right font-weight-bold">
            TOTAL: {{ totalAmount }}
          </p>

          <v-textarea
            v-model="form.details"
            class="mt-4"
            :label="`Observaciones ${isOtherSelected ? '' : '(opcional)'}`"
            hide-details="auto"
            variant="outlined"
            rows="3"
            :rules="isOtherSelected ? [rules.required] : undefined"
          ></v-textarea>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn color="dark" text @click="handleCloseModal"> Cerrar </v-btn>
          <v-btn color="primary" type="submit" text> Cargar servicio </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { PropType, reactive, ref, computed } from 'vue';
import { useStore } from '@/store';
import { useMobile } from '@/composables/useMobile';
import { useOverlay } from '@/composables/useOverlay';
import { useSnackbar } from '@/composables/useSnackbar';
import * as rules from '@/rules';
import { newService } from '@/services/Service.service';
import type { Car } from '@/types/Car';
import { SERVICES } from '@/constants/Services';
import { currencyFormatter } from '@/utils/currencyFormatter';
import { Service } from '@/types/Service';

const props = defineProps({
  active: { type: Boolean, default: false },
  car: { type: Object as PropType<Car>, default: undefined },
});
const emit = defineEmits(['reload']);

const store = useStore();
const { isMobile } = useMobile();
const overlay = useOverlay();
const snackbar = useSnackbar();
const services = ref<Service[]>([
  {
    id_car: 'AAA123',
    created_at: '27/05/2022 15:00',
    details: '',
    id_user: '1',
    services: [2, 3, 6],
  },
  {
    id_car: 'AAA123',
    created_at: '27/05/2022 15:00',
    details: '',
    id_user: '1',
    services: [3],
  },
  {
    id_car: 'AAA123',
    created_at: '27/05/2022 15:00',
    details: '',
    id_user: '1',
    services: [4, 3, 6],
  },
  {
    id_car: 'AAA123',
    created_at: '27/05/2022 15:00',
    details: '',
    id_user: '1',
    services: [5, 3, 6],
  },
  {
    id_car: 'AAA123',
    created_at: '06/06/2022 15:00',
    details: '',
    id_user: '1',
    services: [6],
  },
  {
    id_car: 'AAA123',
    created_at: '27/05/2022 15:00',
    details: '',
    id_user: '1',
    services: [7, 3, 6],
  },
  {
    id_car: 'AAA123',
    created_at: '27/05/2022 15:00',
    details: '',
    id_user: '1',
    services: [8, 3, 6],
  },
  {
    id_car: 'AAA123',
    created_at: '27/05/2022 15:00',
    details: '',
    id_user: '1',
    services: [9, 3, 6],
  },
  {
    id_car: 'AAA123',
    created_at: '27/05/2022 15:00',
    details: '',
    id_user: '1',
    services: [10, 3, 6],
  },
  {
    id_car: 'AAA123',
    created_at: '12/06/2022 15:00',
    details: 'Se hicieron muchas cosas',
    id_user: '1',
    services: [0],
  },
]);
const nuevoServicioModal = ref(false);
const formRef = ref<any>(null);
const form = reactive({
  services: [] as number[],
  details: '',
});
const isOtherSelected = computed(() => form.services.includes(0));
const formattedServices = computed(() =>
  SERVICES.map((service) => {
    const obj = {
      value: service.value,
      title: `${service.title} (${currencyFormatter.format(service.price)})`,
    };

    if (service.price === 0) {
      obj.title = service.title;
    }

    return obj;
  })
);
const totalAmount = computed(() => getTotalAmountByServices(form.services));

function getTotalAmountByServices(services: number[]) {
  const amount = SERVICES.filter((service) =>
    services.includes(service.value)
  ).reduce((a, b) => a + b.price, 0);

  return currencyFormatter.format(amount);
}

function getServicesLabel(services: number[]) {
  const servicesFiltered = formattedServices.value.filter((service) =>
    services.includes(service.value)
  );

  return servicesFiltered.map((service) => service.title);
}

function getServiceObject(serviceNumber: number) {
  return SERVICES.find((service) => service.value === serviceNumber);
}

function getServiceSubtitle(services: number[]) {
  let label = getServiceObject(services[0])?.title;

  if (services.length === 2) {
    label += ` (+${services.length - 1} servicio)`;
  }

  if (services.length > 2) {
    label += ` (+${services.length - 1} servicios)`;
  }

  return label;
}

function handleCloseModal() {
  nuevoServicioModal.value = false;
  formRef.value.reset();
}

async function handleAddService() {
  const validateForm = await formRef.value?.validate();
  if (!validateForm.valid) {
    return;
  }

  try {
    overlay.show('Cargando servicio...');
    await newService({
      details: form.details,
      services: form.services,
      id_car: props.car?._id as string,
      id_user: store.user?.username as string,
    });
    snackbar.show('¡Servicio cargado con éxito!');
    nuevoServicioModal.value = false;
    formRef.value.reset();
    emit('reload');
  } catch (error: any) {
    snackbar.show(error.message || 'Ocurrió un error al cargar el servicio');
  } finally {
    overlay.hide();
  }
}

defineExpose({
  nuevoServicioModal,
});
</script>
