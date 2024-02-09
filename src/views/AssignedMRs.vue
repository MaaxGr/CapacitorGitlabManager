<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Assigned MRs</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">
        <ion-progress-bar v-if="loading" type="indeterminate"></ion-progress-bar>

        <div class="container-inner" v-if="!loading">
          <ErrorCard
              v-if="error"
              title="Error loading merge requests"
              subtitle="Gitlab server might be down or your internet connection is not working"/>

          <ion-icon :icon="refresh" @click="forceRefresh()"></ion-icon>

         <MrProjectGroup :key="value" v-for="(value, key) of mrGroupData" :group-name="getProjectName(parseInt(key))"
                          :merge-requests="value"/>

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
  IonProgressBar,
  IonTitle,
  IonToolbar
} from "@ionic/vue";
import {refresh} from 'ionicons/icons';

import {MergeRequest, Project, useGitlabApi} from "@/composables/gitlabApi";
import {onMounted, Ref, ref} from "vue";
import {groupBy} from "@/composables/utils";
import {useAppCache} from "@/composables/cache";
import ErrorCard from "@/components/ErrorCard.vue";
import MrProjectGroup from "@/components/MrProjectGroup.vue";

const gitlabApi = useGitlabApi()
const cache = useAppCache();

const loading = ref(false)
const error = ref(false)

const assignedMRs: Ref<MergeRequest[]> = ref([]);
const allProjects: Ref<Project[]> = ref([]);

const mrProjects = ref({})

const mrGroupData: Ref<Record<string, MergeRequest[]>> = ref({})

onMounted(async () => {
  await load()
})

async function load() {
  try {
    error.value = false
    loading.value = true

    const localMrs: MergeRequest[] = await gitlabApi.getAssignedMRs()
    assignedMRs.value = localMrs

    mrGroupData.value = groupBy(localMrs, mr => mr.project_id)
    allProjects.value = await cache.getProjectsCached()

    const projectMap: any = {}

    for (const localMr of localMrs) {
      projectMap[localMr.project_id] = allProjects.value?.find(p => p.id === localMr.project_id)
    }
    mrProjects.value = projectMap
    error.value = false
  } catch (e: any) {
    error.value = true
    console.error(e)
  } finally {
    loading.value = false
  }
}


function getProjectName(projectId: number) {
  return allProjects.value.find(p => p.id === projectId)?.name ?? 'Unknown'
}

const forceRefresh = async () => {
  await cache.clearCacheEntry(cache.cacheKeyProjects)
  await load()
}


</script>