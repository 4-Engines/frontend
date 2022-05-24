<template>
  <v-row v-if="!store.isLoggedIn" justify="center">
    <v-col sm="8" md="4">
      <div class="text-center">
        <img src="@/assets/logo.png" width="200" />
        <div class="font-weight-bold">Sistema de gestión del automotor</div>
      </div>
      <div class="mt-10 mb-2">
        <v-alert v-if="errorMessage.length > 0" type="error">{{
          errorMessage
        }}</v-alert>

        <v-text-field
          label="Usuario"
          autofocus
          autocomplete="off"
          hide-details="auto"
          :error="errorMessage.length > 0"
          v-model="form.username"
          variant="outlined"
          :disabled="loading"
        />

        <v-text-field
          class="password-input mt-4"
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          hide-details="auto"
          :error="errorMessage.length > 0"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          v-model="form.password"
          @click:append-inner="showPassword = !showPassword"
          variant="outlined"
          :disabled="loading"
        />

        <v-btn
          :disabled="loading"
          class="mt-4"
          color="primary"
          block
          size="x-large"
          @click="login"
          >{{ loading ? "Ingresando al sistema..." : "Ingresar" }}</v-btn
        >
      </div>

      <div class="text-center">
        <v-dialog v-model="showDialog">
          <template #activator="{ props }">
            <a
              v-if="!loading"
              href="#"
              class="white--text"
              v-bind="props"
              @click.prevent="recuperarMail = ''"
              >¿Olvidaste tu contraseña?</a
            >
          </template>

          <v-card>
            <v-card-title>Recuperar contraseña</v-card-title>

            <v-card-text class="mb-2">
              <v-text-field
                label="Ingresá tu dirección de mail"
                autocomplete="off"
                hide-details="auto"
                type="mail"
                v-model="recuperarMail"
                autofocus
                variant="outlined"
              ></v-text-field>
            </v-card-text>

            <v-card-actions class="justify-end flex-column-reverse flex-sm-row">
              <v-btn text class="mt-3 mt-sm-0" @click="showDialog = false"
                >Cancelar</v-btn
              >

              <v-btn
                color="primary"
                @click="
                  showDialog = false;
                  snackbar = true;
                "
                >Recuperar contraseña</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-col></v-row
  >

  <v-snackbar v-model="snackbar" timeout="2000" bottom left>
    ¡Se envió un mail a tu casilla de correo!
  </v-snackbar>

  <v-snackbar v-model="loginErrorSnackbar" timeout="2000" bottom left>
    Ocurrió un error al intentar ingresar al sistema
  </v-snackbar>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { loginUser } from "@/services/User.service";

const store = useStore();
const router = useRouter();

const errorMessage = ref("");
const showPassword = ref(false);
const recuperarMail = ref("");
const snackbar = ref(false);
const loginErrorSnackbar = ref(false);
const showDialog = ref(false);
const loading = ref(false);

const form = reactive({
  username: '',
  password: ''
})

async function login() {
  loginErrorSnackbar.value = false;
  loading.value = true;

  try {
    const response = await loginUser(form);
    console.log(response);

    /* store.$patch({
      isLoggedIn: true,
      user: {
        name: "Roberto",
        last_name: "Juarroz",
        rol: 1,
        mail: "rjuarroz@gmail.com",
      },
    });

    router.replace("/home"); */
  } catch (error) {
    loginErrorSnackbar.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<style>
.password-input .mdi {
  cursor: pointer;
}
</style>
