<template>
  <h1 style="margin-left: 10px">{{ groupName }}</h1>

  <ion-card v-for="mr in mergeRequests" :key="mr.id">
    <ion-card-header>
      <ion-card-title>{{ mr.title }}
        <img :src="mr.author.avatar_url" alt="author" style="width: 24px" />
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-label>{{ mr.source_branch + ' -> ' + mr.target_branch }}</ion-label>
    </ion-card-content>
  </ion-card>

</template>

<script setup lang="ts">

import {MergeRequest} from "@/composables/gitlabApi";
import {codeOutline} from "ionicons/icons";
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonLabel} from "@ionic/vue";

defineProps<{
  groupName: string,
  mergeRequests: MergeRequest[]
}>()

</script>