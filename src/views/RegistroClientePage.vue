<template>
  <v-row justify="center">
    <v-col sm="8" md="6">
      <v-card class="mt-4 mb-2">
        <v-card-title>Nuevo cliente</v-card-title>
        <v-card-subtitle v-if="!store.isLoggedIn"
          >Si ya estás registrado hace click&nbsp;<router-link to="/login"
            >acá</router-link
          >&nbsp;para iniciar sesión.</v-card-subtitle
        >
        <form name="registro-form" @submit.prevent>
          <v-card-text>
            <v-row>
              <v-col>
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
              <v-col>
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
                  <a href="#" @click.stop>términos y condiciones</a>
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

            <v-dialog v-model="dialog" persistent max-width="400">
              <v-card>
                <v-card-title class="headline">
                  ¡Ya casi estás registrado!
                </v-card-title>
                <v-card-text
                  ><p>
                    Te enviamos un mail a
                    <strong>{{ form.email }}</strong> para que continues con el
                    registro.
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
            </v-dialog>
          </v-card-actions>
        </form>
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
const dialog = ref(false);
const rules = {
  required: (value: string) => !!value || 'Campo requerido',
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || 'Dirección de mail inválida';
  },
  sameAsPassword: (value: string) =>
    value === form.password || 'Las contraseñas ingresadas no coinciden',
};

async function handleSubmit() {
  try {
    const { data } = await createUser(form);
    console.log(data[0].msj);
  } catch (error) {
    console.log(error);
  }
}
</script>
