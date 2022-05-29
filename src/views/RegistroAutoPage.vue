<template>
  <v-row justify="center">
    <v-col sm="8" md="6">
      <v-card class="mt-4 mb-2">
        <v-card-title>Registro auto</v-card-title>

        <template v-if="carCreated">
          <v-card-text>
            <v-alert type="success" title="Auto creado con éxito!">
              <v-divider class="my-2" />
              <p>
                Para poder operar con nosotros tenés que activar la cuenta
                primero.
              </p>
            </v-alert>
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
                    label="Nombre"
                    autocomplete="off"
                    hide-details="auto"
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.marca"
                    :disabled="loading"
                    label="Apellido"
                    autocomplete="off"
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
                    label="Nombre"
                    autocomplete="off"
                    hide-details="auto"
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.year"
                    :disabled="loading"
                    label="Apellido"
                    autocomplete="off"
                    hide-details="auto"
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                v-model.number="form.owner"
                :disabled="loading"
                class="mt-4"
                label="Usuario o dirección de mail"
                autocomplete="off"
                hide-details="auto"
                type="text"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>
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

const store = useStore();

const form = reactive({
  carid: '',
  marca: '',
  model: '',
  year: '',
  owner: '',
});
// const dialog = ref(false);
const carCreated = ref(false);
const errorMessage = ref('');
const loading = ref(false);
const rules = {
  required: (value: string) => !!value || 'Campo requerido',
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Dirección de mail inválida';
  },
  onlyNumbers: (value: string | number) =>
    /^\d+$/.test(value.toString()) || 'Solo se admiten números',
};

async function handleSubmit() {
  errorMessage.value = '';
  loading.value = true;
  try {
    const formData = form;

    if (store.isEmpleado) {
      (formData as any).id_user = store.user?.id;
    }
    const { data } = await createCar(form);

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
