<template>
  <v-row justify="center">
    <v-col sm="8" md="6">
      <v-card class="mt-4 mb-2">
        <v-card-title>Registro auto</v-card-title>

        <template v-if="carCreated">
          <v-card-text>
            <v-alert type="success" title="¡Auto creado con éxito!"> </v-alert>
            <v-btn color="primary" class="mt-4" @click="$router.back()">
              Volver
            </v-btn>
          </v-card-text>
        </template>
        <template v-else>
          <form name="registro-form" @submit.prevent>
            <v-card-text>
              <v-alert v-if="errorMessage.length > 0" type="error" class="mb-4">
                {{ errorMessage }}
              </v-alert>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.carid"
                    :disabled="loading"
                    autofocus
                    label="Patente"
                    hide-details="auto"
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.marca"
                    :disabled="loading"
                    label="Marca"
                    hide-details="auto"
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.model"
                    :disabled="loading"
                    autofocus
                    label="Modelo"
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

              <v-text-field
                v-if="store.isEmpleado"
                v-model.number="form.owner"
                :disabled="loading"
                class="mt-4"
                label="Usuario o dirección de mail"
                hide-details="auto"
                type="text"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>

              <v-alert v-if="store.isCliente" type="info" class="mt-4">
                Recordá que solo te vamos a atender si presentás la
                documentación que acredite que el auto te pertenece (cédula
                verde, título del auto) o que podés conducirlo (cédula azul).
              </v-alert>
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-btn to="/" color="dark" :disabled="loading">Cancelar</v-btn>

              <v-btn
                :disabled="loading"
                type="submit"
                color="primary"
                @click="handleSubmit"
              >
                Registrar auto
              </v-btn>
            </v-card-actions>
          </form>
        </template>
      </v-card>
    </v-col>
  </v-row>

  <v-overlay
    :model-value="loading"
    class="align-center justify-center text-center"
  >
    <v-progress-circular indeterminate size="64"></v-progress-circular>
    <p class="mt-3">Registrando auto...</p>
  </v-overlay>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useStore } from '@/store';
import { createCar } from '@/services/Car.service';
import { email, onlyNumbers, required } from '@/rules';

const store = useStore();

const form = reactive({
  carid: '',
  marca: '',
  model: '',
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
// const dialog = ref(false);
const carCreated = ref(false);
const errorMessage = ref('');
const loading = ref(false);
const rules = {
  required,
  email,
  onlyNumbers,
};

async function handleSubmit() {
  errorMessage.value = '';
  loading.value = true;
  try {
    const formData = form;

    if (store.isEmpleado) {
      (formData as any).id_user = store.user?.id;
    }

    if (store.isCliente) {
      (formData as any).owner = store.user?.username;
    }
    const { data } = await createCar(formData);

    if (data[1] === 200) {
      carCreated.value = true;
    } else {
      throw Error(data[0].msj || 'Ocurrió un error al cargar el auto');
    }
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>
