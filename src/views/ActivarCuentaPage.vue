<template>
  <h2>Activar cuenta</h2>

  <v-alert v-if="errorMessage.length > 0" type="error" class="mt-4">
    {{ errorMessage }}
  </v-alert>

  <template v-if="cuentaActivada">
    <v-alert class="mb-4" type="success" title="¡Cuenta activada con éxito!">
      <v-divider class="my-4" />
      <p class="mb-4">
        ¡Felicidades! Ahora ya podés empezar a operar en nuestro sitio.
      </p>
    </v-alert>
    <v-row>
      <v-col sm="2">
        <v-btn color="primary" block>Ingresar</v-btn>
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
import { confirmUser } from '@/services/User.service';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const errorMessage = ref('');
const cuentaActivada = ref(false);
const loading = ref(false);

onMounted(async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    const { data } = await confirmUser(route.params.id as string);

    if (data[0].status === 'error') {
      throw Error(
        data[0].message || 'Ocurrió un error al intentar activar la cuenta'
      );
    }

    cuentaActivada.value = true;
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
});
</script>
