<template>
  <v-dialog v-model="registroAutoModal" scrollable persistent>
    <v-form ref="formRef" @submit.prevent="handleSubmit">
      <v-card :style="{ width: isMobile ? '326px' : '500px' }">
        <v-card-title>Registro auto</v-card-title>

        <v-divider />

        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.carid"
                autofocus
                label="Patente"
                hide-details="auto"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.year"
                :items="years"
                label="Año"
                variant="outlined"
                :rules="[rules.required]"
                hide-details="auto"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.brand"
                label="Marca"
                hide-details="auto"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.model"
                label="Modelo"
                hide-details="auto"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                v-model="form.color"
                hide-details="auto"
                label="Color"
                variant="outlined"
                type="color"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                v-if="store.isEmpleado"
                v-model.number="form.owner"
                label="Usuario o dirección de mail"
                hide-details="auto"
                type="text"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-alert v-if="store.isCliente" type="info" class="mt-4">
            Recordá que solo te vamos a atender si presentás la documentación
            que acredite que el auto te pertenece (cédula verde, título del
            auto) o que podés conducirlo (cédula azul).
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn color="dark" text @click="handleCloseModal">Cancelar</v-btn>

          <v-btn color="primary" text type="submit"> Registrar auto </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useStore } from '@/store';
import { createCar } from '@/services/Car.service';
import * as rules from '@/rules';
import { useMobile } from '@/composables/useMobile';
import { useOverlay } from '@/composables/useOverlay';
import { useSnackbar } from '@/composables/useSnackbar';

const emit = defineEmits(['reload']);

const store = useStore();
const { isMobile } = useMobile();
const overlay = useOverlay();
const snackbar = useSnackbar();
const registroAutoModal = ref(false);
const formRef = ref<any>(null);
const form = reactive({
  carid: '',
  brand: '',
  model: '',
  color: '#000000',
  year: '',
  owner: '',
});
const years = ref([
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022',
]);

function resetForm() {
  form.brand = '';
  form.carid = '';
  form.color = '#000000';
  form.model = '';
  form.owner = '';
  form.year = '';
}

function handleCloseModal() {
  registroAutoModal.value = false;
  resetForm();
}

async function handleSubmit() {
  const validateForm = await formRef.value?.validate();
  if (!validateForm.valid) {
    return;
  }

  try {
    overlay.show('Registrando auto...');
    const formData = form;

    if (store.isEmpleado) {
      (formData as any).id_user = store.user?.id;
    }

    if (store.isCliente) {
      (formData as any).owner = store.user?.username;
    }
    const { data } = await createCar(formData);

    if (data[1] === 200) {
      snackbar.show('¡Turno solicitado con éxito!');
      registroAutoModal.value = false;
      resetForm();
      emit('reload');
    } else {
      throw Error(data[0].msj || 'Ocurrió un error al cargar el auto');
    }
  } catch (error: any) {
    snackbar.show(error.message || 'Ocurrió un error al solicitar el turno');
  } finally {
    overlay.hide();
  }
}

defineExpose({
  registroAutoModal,
});
</script>
