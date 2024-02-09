<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">
        <ion-progress-bar v-if="loading" type="indeterminate"></ion-progress-bar>

        <div class="container-inner" v-if="!loading">
          <ErrorCard
              v-if="error"
              title="Error loading dashboard"
              subtitle="Gitlab server might be down or your internet connection is not working"/>

          <ion-icon :icon="refresh" @click="forceRefresh()"></ion-icon>

          <ion-grid :fixed="true" v-if="!error">
            <ion-row>
              <ion-col>
                <ion-card>
                  <ion-card-header>
                    <ion-icon :icon="codeOutline" size="large"></ion-icon>
                    <ion-card-title>Project Count</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    <ion-label>{{ projectCount }}</ion-label>
                  </ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col>
                <ion-card>
                  <ion-card-header>
                    <ion-icon :icon="gitBranchOutline" size="large"></ion-icon>
                    <ion-card-title>Renovate MRs</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    <ion-label>{{ renvateMRCount }}</ion-label>
                  </ion-card-content>
                </ion-card>
              </ion-col>

            </ion-row>
          </ion-grid>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonLabel,
  IonCard,
  IonProgressBar,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/vue";
import {codeOutline, gitBranchOutline, refresh} from 'ionicons/icons';

import {useGitlabApi} from "@/composables/gitlabApi";
import {onMounted, ref} from "vue";
import {useAppCache} from "@/composables/cache";
import ErrorCard from "@/components/ErrorCard.vue";

const gitlabApi = useGitlabApi();
const cache = useAppCache();

const loading = ref(false)
const error = ref(false)
const projectCount = ref(0)
const renvateMRCount = ref(0)

onMounted(async () => {
  await load()
})

const load = async () => {
  try {
    loading.value = true
    error.value = false

    projectCount.value = await cache.getFromCache('projectCount', async () => {
      return await gitlabApi.getProjectCount()
    })
    renvateMRCount.value = await cache.getFromCache('renovateMRCount', async () => {
      return await gitlabApi.getRenovateMRCount()
    })

    error.value = false
  } catch (e: any) {
    error.value = true
    console.error('Error loading dashboard', e)
  } finally {
    loading.value = false
  }
}

const forceRefresh = async () => {
  await cache.clearCache()
  await load()
}


</script>