<template>
  <h2>Bienvenido/a, {{ store.user?.name }}</h2>
</template>

<script setup lang="ts">
import { useStore } from '@/store';

const store = useStore();
</script>
