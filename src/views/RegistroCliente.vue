<template>
  <h2>Registro</h2>
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

async function register() {
  try {
    const response = await createUser(form);
  } catch (error) {}
}
</script>
