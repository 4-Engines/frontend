<template>
  <v-row justify="center">
    <v-col sm="8" md="6">
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-card class="mt-4 mb-2">
          <v-card-title>Nueva contraseña</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="form.password"
              autofocus
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
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-btn to="/" color="dark">Cancelar</v-btn>
            <v-btn color="primary" type="submit">Cambiar contraseña</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { required } from '@/rules';
import { useOverlay } from '@/composables/useOverlay';
import { useSnackbar } from '@/composables/useSnackbar';
import { useRoute, useRouter } from 'vue-router';
import { resetPassword } from '@/services/User.service';

const overlay = useOverlay();
const snackbar = useSnackbar();
const router = useRouter();
const route = useRoute();
const form = reactive({
  password: '',
});
const showPassword = ref(false);
const repeatPassword = ref('');
const rules = {
  required,
  sameAsPassword: (value: string) =>
    value === form.password || 'Las contraseñas ingresadas no coinciden',
};

async function handleSubmit() {
  try {
    overlay.show('Cambiando contraseña...');
    const { data } = await resetPassword({
      id: route.params.id as string,
      password: form.password,
    });
    snackbar.show(data[0].msj);
    router.replace('/');
  } catch (error: any) {
    snackbar.show(error.message);
  } finally {
    overlay.hide();
  }
}
</script>
