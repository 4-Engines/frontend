<template>
  <v-row justify="center">
    <v-col sm="8" md="6">
      <v-card class="mt-4 mb-2">
        <v-card-title>Nuevo cliente</v-card-title>
        <v-card-subtitle
          >Si ya estás registrado hace click&nbsp;<router-link to="/login"
            >acá</router-link
          >&nbsp;para iniciar sesión</v-card-subtitle
        >
        <form name="registro-form" @submit.prevent>
          <v-card-text>
            <v-text-field
              v-model="form.email"
              label="Mail"
              autofocus
              autocomplete="off"
              hide-details="auto"
              type="email"
              variant="outlined"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.username"
              class="mt-4"
              label="Usuario"
              autocomplete="off"
              hide-details="auto"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.password"
              class="mt-4"
              label="Contraseña"
              :type="showPassword ? 'text' : 'password'"
              hide-details="auto"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              variant="outlined"
              @click:append="showPassword = !showPassword"
            ></v-text-field>

            <v-text-field
              v-model="form.name"
              class="mt-4"
              label="Nombre"
              autocomplete="off"
              hide-details="auto"
              variant="outlined"
            ></v-text-field>

            <v-text-field
              v-model="form.lastname"
              class="mt-4"
              label="Apellido"
              autocomplete="off"
              hide-details="auto"
              variant="outlined"
            ></v-text-field>
          </v-card-text>

          <v-divider />

          <v-card-text>
            <!-- <a href="#">Ver términos y condiciones</a> -->
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

          <v-card-actions>
            <v-btn type="submit" color="primary" dark @click="handleSubmit">
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
// import { createUser } from '@/services/User.service';

const form = reactive({
  username: '',
  password: '',
  lastname: '',
  name: '',
  phone: '',
  email: ''
});
const showPassword = ref(false);
const aceptoTerminos = ref(false);
const dialog = ref(false);

async function handleSubmit() {
  /* try {
    const response = await createUser(form);
  } catch (error) {} */
}
</script>
