<template>
  <v-row v-if="!store.isLoggedIn" justify="center">
    <v-col sm="8" md="4">
      <div class="text-center">
        <v-img src="/logo.png" height="150" />
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
            :rules="[rules.required]"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-btn
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

      <div class="text-center">
        ¿No tenés cuenta? <router-link to="/registro"> Registrate </router-link>
      </div>

      <div class="text-center">
        <a href="#" class="white--text" @click.prevent="handleRecoverPassword"
          >¿Olvidaste tu contraseña?</a
        >
      </div>
    </v-col>
  </v-row>

  <v-dialog v-model="showDialog" persistent>
    <v-form
      ref="resetPasswordFormRef"
      @submit.prevent="handleSubmitResetPassword"
    >
      <v-card :style="{ width: isMobile ? '326px' : '500px' }">
        <v-card-title>Generar nueva contraseña</v-card-title>

        <v-divider />

        <v-card-text class="mb-3 mt-2">
          <p>
            Te vamos a enviar un mail para que puedas setear una nueva
            contraseña.
          </p>
          <v-text-field
            v-model="resetPasswordField"
            class="mt-6"
            label="Dirección de mail"
            autocomplete="off"
            hide-details="auto"
            type="mail"
            autofocus
            variant="outlined"
            :rules="[rules.required, rules.email]"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="justify-end flex-column-reverse flex-sm-row">
          <v-btn
            class="mt-3 mt-sm-0"
            type="reset"
            text
            @click="handleCloseResetPasswordModal"
          >
            Cancelar
          </v-btn>

          <v-btn color="primary" type="submit"> Enviar mail </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import {
  loginUser,
  resendActivationEmail,
  sendResetPasswordEmail,
} from '@/services/User.service';
import { useSnackbar } from '@/composables/useSnackbar';
import { useOverlay } from '@/composables/useOverlay';
import * as rules from '@/rules';
import { useMobile } from '@/composables/useMobile';

const store = useStore();
const router = useRouter();

const { isMobile } = useMobile();
const errorMessage = ref('');
const showPassword = ref(false);
const resetPasswordField = ref('');
const showDialog = ref(false);
const cuentaNoActiva = ref(false);
const snackbar = useSnackbar();
const overlay = useOverlay();
const formRef = ref<any>(null);
const resetPasswordFormRef = ref<any>(null);

const form = reactive({
  username: '',
  password: '',
});

onMounted(() => {
  if (store.isLoggedIn) {
    router.replace('/home');
  }
});

function handleRecoverPassword() {
  if (form.username.includes('@')) {
    resetPasswordField.value = form.username;
  }

  showDialog.value = true;
}

function handleCloseResetPasswordModal() {
  resetPasswordField.value = '';
  showDialog.value = false;
}

async function handleSubmitResetPassword() {
  const validateForm = await resetPasswordFormRef.value?.validate();
  if (!validateForm.valid) {
    return;
  }

  try {
    overlay.show('Enviando mail...');

    const { data } = await sendResetPasswordEmail(resetPasswordField.value);
    showDialog.value = false;
    resetPasswordFormRef.value.reset();
    snackbar.show(data[0].msj);
  } catch (error: any) {
    snackbar.show(error.message || 'Ocurrió un error al enviar mail');
  } finally {
    overlay.hide();
  }
}

async function handleLogin() {
  const validateForm = await formRef.value?.validate();
  if (!validateForm.valid) {
    return;
  }

  cuentaNoActiva.value = false;
  errorMessage.value = '';
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
    overlay.hide();
  }
}

async function handleResendActivationEmail() {
  errorMessage.value = '';
  overlay.show('Reenviando mail...');

  try {
    const { data } = await resendActivationEmail(form.username);

    if (data[0].status === 'error') {
      throw Error(data[0].msj);
    }

    snackbar.show(data[0].msj);
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    overlay.hide();
  }
}
</script>
