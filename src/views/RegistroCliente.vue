<template>
  <h2>Nuevo cliente</h2>
  
    <v-row justify="center">
      <v-col sm="8" md="6">
        <v-card class="mt-4 mb-2">
          <v-card-title>Registro</v-card-title>
          <v-card-subtitle>Si ya estás registrado hace click <router-link to="/login">acá</router-link> para iniciar sesión</v-card-subtitle>
          <form name="registro-form" @submit.prevent>
            <v-card-text>
              <v-text-field
                label="Mail"
                autocomplete="off"
                hide-details="auto"
                v-model="form.email"
                type="email"
                required
              ></v-text-field>

              <v-text-field
                label="Usuario"
                autocomplete="off"
                hide-details="auto"
                v-model="form.username"
              ></v-text-field>

              <v-text-field
                class="mt-2"
                label="Contraseña"
                :type="showPassword ? 'text' : 'password'"
                hide-details="auto"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                v-model="form.password"
                @click:append="showPassword = !showPassword"
              ></v-text-field>

              <v-text-field
                label="Nombre"
                autocomplete="off"
                hide-details="auto"
                v-model="form.name"
              ></v-text-field>

              <v-text-field
                label="Apellido"
                autocomplete="off"
                hide-details="auto"
                v-model="form.lastname"
              ></v-text-field>
            </v-card-text>

            <v-divider />


            <v-card-text>
              <!-- <a href="#">Ver términos y condiciones</a> -->
              <v-checkbox
                v-model="aceptoTerminos"
                label="Acepto términos y condiciones"
              >
                <template #label>
                  <div>He leído y aceptado los <a href="#" @click.stop>términos y condiciones</a></div>
                </template>
              </v-checkbox>
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
                      <strong>{{ form.mail }}</strong> para que continues con el
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
import { reactive } from "vue";
import { createUser } from "@/services/User.service";

const form = reactive({
  username: "",
  password: "",
  lastname: "",
  name: "",
  phone: "",
  email: "",
});
const showPassword = ref(false);

async function register() {
  try {
    const response = await createUser(form);
  } catch (error) {}
}
</script>
