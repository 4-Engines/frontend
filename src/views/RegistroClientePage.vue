<template>
  <v-row justify="center">
    <v-col sm="8" md="6">
      <v-card class="mt-4 mb-2">
        <v-card-title>Nuevo cliente</v-card-title>
        <v-card-subtitle v-if="!store.isLoggedIn && !userCreated"
          >Si ya estás registrado hace click
          <router-link to="/login">acá</router-link> para iniciar
          sesión.</v-card-subtitle
        >

        <template v-if="userCreated">
          <v-card-text>
            <v-alert type="success" title="¡Usuario creado con éxito!">
              <v-divider class="my-2" />
              <p>
                Para poder operar con nosotros tenés que activar la cuenta
                primero.
              </p>
              <p>
                Te enviamos un mail a <strong>{{ form.email }}</strong> para que
                puedas hacerlo.
              </p>
            </v-alert>
          </v-card-text>
        </template>
        <template v-else>
          <v-form ref="formRef" name="registro-form">
            <v-card-text>
              <v-alert v-if="errorMessage.length > 0" type="error" class="mb-4">
                {{ errorMessage }}
              </v-alert>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.name"
                    :disabled="loading"
                    autofocus
                    label="Nombre"
                    autocomplete="off"
                    hide-details="auto"
                    variant="outlined"
                    :rules="[rules.required, rules.min3]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.lastname"
                    :disabled="loading"
                    label="Apellido"
                    autocomplete="off"
                    hide-details="auto"
                    variant="outlined"
                    :rules="[rules.required, rules.min3]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                v-model="form.username"
                :disabled="loading"
                class="mt-4"
                label="Usuario"
                autocomplete="off"
                hide-details="auto"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>

              <v-text-field
                v-model="form.email"
                :disabled="loading"
                class="mt-4"
                label="Mail"
                autocomplete="off"
                hide-details="auto"
                type="email"
                variant="outlined"
                :rules="[rules.required, rules.email]"
              ></v-text-field>

              <v-text-field
                v-model.number="form.phone"
                :disabled="loading"
                class="mt-4"
                label="Teléfono"
                autocomplete="off"
                hide-details="auto"
                type="text"
                variant="outlined"
                :rules="[rules.required, rules.onlyNumbers]"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                :disabled="loading"
                class="password-input mt-4"
                label="Contraseña"
                :type="showPassword ? 'text' : 'password'"
                hide-details="auto"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                variant="outlined"
                :rules="[rules.required]"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-text-field
                v-model="repeatPassword"
                :disabled="loading"
                class="mt-4"
                label="Repetir contraseña"
                :type="showPassword ? 'text' : 'password'"
                hide-details="auto"
                variant="outlined"
                :rules="[rules.required, rules.sameAsPassword]"
              ></v-text-field>

              <v-switch
                v-model="aceptoTerminos"
                color="primary"
                label="Acepto términos y condiciones"
                hide-details="auto"
                required
                :rules="[
                  (v: boolean) =>
                    !!v || 'Tenés que aceptar los términos antes de continuar',
                ]"
              >
                <template #label>
                  <div>
                    He leído y aceptado los
                    <a href="#" @click.prevent>términos y condiciones</a>
                  </div>
                </template>
              </v-switch>
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-btn to="/" color="dark" :disabled="loading">Cancelar</v-btn>
              <v-btn :disabled="loading" color="primary" @click="handleSubmit">
                Registrate
              </v-btn>
            </v-card-actions>
          </v-form>
        </template>
      </v-card>
    </v-col>
  </v-row>

  <v-overlay
    :model-value="loading"
    class="align-center justify-center text-center"
  >
    <v-progress-circular indeterminate size="64"></v-progress-circular>
    <p class="mt-3">Registrando usuario...</p>
  </v-overlay>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useStore } from '@/store';
import { createUser } from '@/services/User.service';
import { email, onlyNumbers, required, min3 } from '@/rules';

const store = useStore();
const formRef = ref<any>(null);
const form = reactive({
  username: '',
  password: '',
  lastname: '',
  name: '',
  phone: '',
  email: '',
});
const showPassword = ref(false);
const repeatPassword = ref('');
const aceptoTerminos = ref(false);
// const dialog = ref(false);
const userCreated = ref(false);
const errorMessage = ref('');
const loading = ref(false);
const rules = {
  required,
  min3,
  email,
  onlyNumbers,
  sameAsPassword: (value: string) =>
    value === form.password || 'Las contraseñas ingresadas no coinciden',
};

async function handleSubmit() {
  const validateForm = await formRef.value?.validate();
  if (!validateForm.valid) {
    return;
  }

  errorMessage.value = '';
  loading.value = true;
  try {
    const { data } = await createUser(form);

    if (data[1] === 200) {
      userCreated.value = true;
      console.log(data[0].id);
    } else {
      throw Error(data[0].msj || 'Ocurrió un error al ingresar');
    }
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>
