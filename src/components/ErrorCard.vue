<template>
  <ion-card color="danger">
    <ion-card-header>
      <ion-card-title>{{title }}</ion-card-title>
      <ion-card-subtitle>{{ subtitle }}</ion-card-subtitle>
    </ion-card-header>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/vue';

defineProps<{
  title: string,
  subtitle: string
}>()

</script>