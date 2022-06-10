<template>
  <h2 class="mb-4">Servicios</h2>
  <p v-if="store.isCliente" class="mb-6">
    Estos son los servicios que tuviste con nosotros.
  </p>
  <p v-else class="mb-6">
    Estos son los servicios que se le hicieron a este auto.
  </p>

  <v-dialog v-model="nuevoServicioModal" scrollable persistent>
    <v-form ref="formRef" @submit.prevent="handleAddService">
      <v-card :style="{ width: isMobile ? '326px' : '500px' }">
        <v-card-title>Nuevo servicio</v-card-title>

        <v-divider />

        <v-card-text>
          <v-select
            v-model="form.services"
            label="Servicios"
            :items="SERVICIOS"
            :rules="[rules.required]"
            multiple
            chips
            variant="outlined"
            hide-details="auto"
            autofocus
          ></v-select>

          <v-textarea
            v-model="form.details"
            class="mt-4"
            :label="`Observaciones ${isOtherSelected ? '' : '(opcional)'}`"
            hide-details="auto"
            variant="outlined"
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

const props = defineProps({
  active: { type: Boolean, default: false },
  car: { type: Object as PropType<Car>, default: undefined },
});
const emit = defineEmits(['reload']);

const SERVICIOS = [
  { value: 1, title: 'Cambio de aceite y filtro' },
  { value: 2, title: 'Cambio de escobillas limpiaparabrisas' },
  { value: 3, title: 'Cambio filtro de aire' },
  { value: 4, title: 'Mantenimiento programado' },
  { value: 5, title: 'Llantas nuevas' },
  { value: 6, title: 'Cambio de batería' },
  { value: 7, title: 'Servicio/reparación de frenos' },
  { value: 8, title: 'Anticongelante adicional' },
  { value: 9, title: 'Afinación del motor' },
  { value: 10, title: 'Alineación/balanceo de llantas' },
  { value: 0, title: 'Otros' },
];

const store = useStore();
const { isMobile } = useMobile();
const nuevoServicioModal = ref(false);
const overlay = useOverlay();
const snackbar = useSnackbar();
const formRef = ref<any>(null);
const form = reactive({
  services: [] as number[],
  details: '',
});
const isOtherSelected = computed(() => form.services.includes(0));

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
