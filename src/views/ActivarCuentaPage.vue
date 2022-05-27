<template>
  <h2 class="mb-4">Activar cuenta</h2>

  <template v-if="!loading">
    <v-alert v-if="cuentaActiva" type="info">
      Esta cuenta fue activada en otra oportunidad. Si no fuiste vos quien la
      activó contactactate con nosotros para poder ayudarte.
    </v-alert>

    <v-alert v-if="errorMessage.length > 0" type="error">
      {{ errorMessage }}
    </v-alert>

    <v-alert
      v-if="cuentaActivada"
      type="success"
      title="¡Cuenta activada con éxito!"
    >
      <v-divider class="my-4" />
      <p class="mb-4">
        ¡Felicidades! Ahora ya podés empezar a operar en nuestro sitio.
      </p>
      <p class="mb-4">
        Podés loguearte con tu nombre de usuario o tu mail y la contraseña que
        ingresaste:
      </p>
      <p>
        Nombre de usuario: <strong>{{ cliente?.username }}</strong>
      </p>
      <p>
        Mail: <strong>{{ cliente?.email }}</strong>
      </p>
    </v-alert>

    <v-row class="mt-4">
      <v-col sm="2">
        <v-btn color="primary" block to="/">Ingresar</v-btn>
      </v-col>
    </v-row>
  </template>

  <v-overlay
    :model-value="loading"
    class="align-center justify-center text-center"
  >
    <v-progress-circular indeterminate size="64"></v-progress-circular>
    <p class="mt-3">Activando cuenta...</p>
  </v-overlay>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { confirmUser } from '@/services/User.service';
import type { Cliente } from '@/types/User';

const route = useRoute();
const errorMessage = ref('');
const cuentaActivada = ref(false);
const cuentaActiva = ref(false);
const loading = ref(false);
const cliente = ref<Pick<Cliente, 'username' | 'email'>>();

onMounted(async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    const { data } = await confirmUser(route.params.id as string);

    if (data[0].msj === 'Usuario ya confirmado') {
      cuentaActiva.value = true;
      return;
    }

    if (data[0].status === 'error') {
      throw Error(
        data[0].msj || 'Ocurrió un error al intentar activar la cuenta'
      );
    }

    cliente.value = data[0];
    cuentaActivada.value = true;
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
});
</script>
