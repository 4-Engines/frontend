<template>
  <v-row v-if="!store.isLoggedIn" justify="center">
    <v-col sm="8" md="4">
      <div class="text-center">
        <img src="@/assets/logo.png" width="200" />
        <div class="font-weight-bold">Sistema de gestión del automotor</div>
      </div>
      <div class="mt-10 mb-2">
        <v-alert v-if="errorMessage.length > 0" type="error">
          {{ errorMessage }}
        </v-alert>

        <v-text-field
          v-model="form.username"
          label="Usuario"
          autofocus
          autocomplete="off"
          hide-details="auto"
          :error="errorMessage.length > 0"
          variant="outlined"
          :disabled="loading"
        />

        <v-text-field
          v-model="form.password"
          class="password-input mt-4"
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          hide-details="auto"
          :error="errorMessage.length > 0"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          variant="outlined"
          :disabled="loading"
          @click:append-inner="showPassword = !showPassword"
        />

        <v-btn
          :disabled="loading"
          class="mt-4"
          color="primary"
          block
          size="x-large"
          @click="login"
        >
          {{ loading ? 'Ingresando al sistema...' : 'Ingresar' }}
        </v-btn>
      </div>

      <div v-if="!loading" class="text-center">
        ¿No tenés cuenta? <router-link to="/registro"> Registrate </router-link>
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
                v-model="recuperarMail"
                label="Ingresá tu dirección de mail"
                autocomplete="off"
                hide-details="auto"
                type="mail"
                autofocus
                variant="outlined"
              />
            </v-card-text>

            <v-card-actions class="justify-end flex-column-reverse flex-sm-row">
              <v-btn text class="mt-3 mt-sm-0" @click="showDialog = false">
                Cancelar
              </v-btn>

              <v-btn
                color="primary"
                @click="
                  showDialog = false;
                  snackbar = true;
                "
              >
                Recuperar contraseña
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-col>
  </v-row>

  <v-snackbar v-model="snackbar" timeout="2000" bottom left>
    ¡Se envió un mail a tu casilla de correo!
  </v-snackbar>

  <v-snackbar v-model="loginErrorSnackbar" timeout="2000" bottom left>
    Ocurrió un error al intentar ingresar al sistema
  </v-snackbar>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { loginUser } from '@/services/User.service';

const store = useStore();
const router = useRouter();

const errorMessage = ref('');
const showPassword = ref(false);
const recuperarMail = ref('');
const snackbar = ref(false);
const loginErrorSnackbar = ref(false);
const showDialog = ref(false);
const loading = ref(false);

const form = reactive({
  username: '',
  password: '',
});

onMounted(() => {
  if (store.isLoggedIn) {
    router.replace('/home');
  }
});

async function login() {
  loginErrorSnackbar.value = false;
  loading.value = true;

  try {
    const {
      data: [user],
    } = await loginUser(form);

    store.$patch({
      isLoggedIn: true,
      user: {
        name: 'Roberto',
        lastname: 'Juarroz',
        rol: user.rol,
        mail: 'rjuarroz@gmail.com',
        id: '456987',
        phone: 111654968,
        username: 'rjuarroz',
      },
    });

    router.replace('/home');
  } catch (error) {
    loginErrorSnackbar.value = true;
  } finally {
    loading.value = false;
  }
}
</script>
