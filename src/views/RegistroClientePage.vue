<template>
  <v-row justify="center">
    <v-col sm="8" md="6">
      <v-card class="mt-4 mb-2">
        <v-card-title>Nuevo cliente</v-card-title>
        <v-card-subtitle v-if="!store.isLoggedIn"
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
                primero. Te enviamos un mail a {{ form.email }} para que puedas
                hacerlo.
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
                    v-model="form.name"
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
                    v-model="form.lastname"
                    label="Apellido"
                    autocomplete="off"
                    hide-details="auto"
                    variant="outlined"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                v-model="form.username"
                class="mt-4"
                label="Usuario"
                autocomplete="off"
                hide-details="auto"
                variant="outlined"
                :rules="[rules.required]"
              ></v-text-field>

              <v-text-field
                v-model="form.email"
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
                hide-details
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
              <v-btn to="/" color="dark">Cancelar</v-btn>
              <v-spacer />
              <v-btn type="submit" color="primary" @click="handleSubmit">
                Registrate
              </v-btn>

              <!-- <v-dialog v-model="dialog" persistent max-width="400">
                <v-card>
                  <v-card-title class="headline">
                    ¡Ya casi estás registrado!
                  </v-card-title>
                  <v-card-text
                    ><p>
                      Te enviamos un mail a
                      <strong>{{ form.email }}</strong> para que continues con
                      el registro.
                    </p>
                    <p>
                      Una vez que confirmes tu identidad vas a poder ingresar en
                      este sitio y disfrutar del mejor contenido.
                    </p></v-card-text
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="$router.replace('/')">
                      Ir a inicio
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog> -->
            </v-card-actions>
          </form>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useStore } from '@/store';
import { createUser } from '@/services/User.service';

const store = useStore();

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
  required: (value: string) => !!value || 'Campo requerido',
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Dirección de mail inválida';
  },
  sameAsPassword: (value: string) =>
    value === form.password || 'Las contraseñas ingresadas no coinciden',
  onlyNumbers: (value: string | number) =>
    /^\d+$/.test(value.toString()) || 'Solo se admiten números',
};

async function handleSubmit() {
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
