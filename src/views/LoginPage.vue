<template>
  <v-row v-if="!store.isLoggedIn" justify="center">
    <v-col sm="8" md="4">
      <div class="text-center">
        <img src="@/assets/logo.png" width="200" />
        <div class="font-weight-bold">Sistema de gestión del automotor</div>
      </div>
      <div class="mt-10 mb-2">
        <v-form ref="formRef" @submit.prevent="handleLogin">
          <v-alert v-if="errorMessage.length > 0" type="error" class="mb-4">
            <p>{{ errorMessage }}</p>
            <p v-if="cuentaNoActiva">
              <a
                class="text-white"
                href="#"
                @click="handleResendActivationEmail"
                >Reenviar mail de activación</a
              >
            </p>
          </v-alert>

          <v-text-field
            v-model="form.username"
            label="Usuario o dirección de mail"
            autofocus
            hide-details="auto"
            :error="errorMessage.length > 0"
            variant="outlined"
            :disabled="loading"
            :rules="[rules.required, rules.min3]"
          />

          <v-text-field
            v-model="form.password"
            class="password-input mt-4"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="off"
            hide-details="auto"
            :error="errorMessage.length > 0"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            variant="outlined"
            :disabled="loading"
            :rules="[rules.required]"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-btn
            :disabled="loading"
            class="mt-4"
            color="primary"
            block
            size="x-large"
            type="submit"
          >
            Ingresar
          </v-btn>
        </v-form>
      </div>

      <div v-if="!loading" class="text-center">
        ¿No tenés cuenta? <router-link to="/registro"> Registrate </router-link>
      </div>

      <!-- <div class="text-center">
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
      </div> -->
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { loginUser, resendActiationEmail } from '@/services/User.service';
import { useSnackbar } from '@/composables/useSnackbar';
import { useOverlay } from '@/composables/useOverlay';
import * as rules from '@/rules';

const store = useStore();
const router = useRouter();

const errorMessage = ref('');
const showPassword = ref(false);
// const recuperarMail = ref('');
// const showDialog = ref(false);
const loading = ref(false);
const cuentaNoActiva = ref(false);
const snackbar = useSnackbar();
const overlay = useOverlay();
const formRef = ref<any>(null);

const form = reactive({
  username: '',
  password: '',
});

onMounted(() => {
  if (store.isLoggedIn) {
    router.replace('/home');
  }
});

async function handleLogin() {
  const validateForm = await formRef.value?.validate();
  if (!validateForm.valid) {
    return;
  }

  cuentaNoActiva.value = false;
  errorMessage.value = '';
  loading.value = true;
  overlay.show('Ingresando al sistema...');

  try {
    const { data } = await loginUser(form);

    // @ts-ignore
    if (data.error) {
      // @ts-ignore
      throw Error(data.error);
    }

    if (
      data[0].status === 'error' &&
      data[0].msj.includes('Usuario inactivo')
    ) {
      cuentaNoActiva.value = true;
      throw Error(data[0].msj);
    }

    if (data[0].status === 'error') {
      throw Error(
        data[0].msj || 'Ocurrió un error al intentar ingresar al sistema'
      );
    }

    store.$patch({
      isLoggedIn: true,
      user: data[0].user,
    });

    router.replace('/home');
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
    overlay.hide();
  }
}

async function handleResendActivationEmail() {
  loading.value = true;
  errorMessage.value = '';
  overlay.show('Reenviando mail...');

  try {
    const { data } = await resendActiationEmail(form.username);

    if (data[0].status === 'error') {
      throw Error(data[0].msj);
    }

    snackbar.show(data[0].msj);
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
    overlay.hide();
  }
}
</script>
