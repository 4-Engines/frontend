<template>
  <v-row justify="center">
    <v-col sm="8" md="4">
      <div class="text-center mt-3">
        <img src="../../public/logo.png" width="200">
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
            v-model="user"
            variant="outlined"
          ></v-text-field>

          <v-text-field
            class="password-input mt-4"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            hide-details="auto"
            :error="errorMessage.length > 0"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            v-model="pass"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
          >
          </v-text-field>

          <v-btn class="mt-4" color="primary" block size="x-large" @click="login">Ingresar</v-btn>
      </div>

      <div class="text-center">
        <v-dialog v-model="showDialog">
          <template #activator="{ props }">
            <a
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

  <v-snackbar v-model="snackbar" :timeout="4000" right bottom>
    ¡Se envió un mail a tu casilla de correo!
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from "vue";

const errorMessage = ref("");
const user = ref("");
const pass = ref("");
const showPassword = ref(false);
const recuperarMail = ref("");
const snackbar = ref(false);
const showDialog = ref(false);

function login() {}
</script>

<style>
.password-input .mdi {
  cursor: pointer;
}
</style>
