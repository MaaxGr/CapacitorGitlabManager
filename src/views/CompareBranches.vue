<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Compare Branches</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">
        <ion-progress-bar v-if="loading" type="indeterminate"></ion-progress-bar>

        <div class="container-inner" v-if="!loading">
          <ErrorCard
              v-if="error"
              title="Error loading branch comparison"
              subtitle="Gitlab server might be down or your internet connection is not working"/>

          <ion-icon :icon="refresh" @click="forceRefresh()"></ion-icon>

          <ion-card>
            <ion-card-header>
              <ion-card-title>Test Branch behind Main</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <table>
                <tr>
                  <th>Project</th>
                  <th>Test behind main</th>
                  <th>Main behind test</th>
                  <th>Staging behind main</th>
                  <th>Main behind staging</th>
                </tr>
                <tr v-for="comparison of visibleComparisons" :key="comparison.projectName">
                  <td>{{ comparison.projectName }}</td>
                  <td><span>{{ comparison.testCommitsBehindMain }}</span></td>
                  <td><span>{{ comparison.mainCommitsBehindTest }}</span></td>
                  <td><span>{{ comparison.stagingCommitsBehindMain }}</span></td>
                  <td><span>{{ comparison.mainCommitsBehindStaging }}</span></td>
                </tr>
              </table>
            </ion-card-content>
          </ion-card>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon, IonLabel,
  IonMenuButton,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar
} from "@ionic/vue";
import {refresh} from 'ionicons/icons';

import {BranchComparison, MergeRequest, Project, useGitlabApi} from "@/composables/gitlabApi";
import {onMounted, Ref, ref} from "vue";
import {groupBy} from "@/composables/utils";
import {useAppCache} from "@/composables/cache";
import ErrorCard from "@/components/ErrorCard.vue";
import MrProjectGroup from "@/components/MrProjectGroup.vue";
import {userProfileStore} from "@/composables/profile";
import {Preferences} from "@capacitor/preferences";

const gitlabApi = useGitlabApi()
const cache = useAppCache();

const loading = ref(false)
const error = ref(false)

const comparisons = ref<BranchCompareEntry[]>([])
const visibleComparisons = ref<BranchCompareEntry[]>([])

onMounted(async () => {
  await load()
})

async function load() {
  try {
    error.value = false
    loading.value = true

    const projects = await gitlabApi.getAllProjects();


    const cacheValue = (await Preferences.get({key: "compareBranchCache"})).value
    const cacheData: BranchCompareEntry[] = cacheValue != null ? JSON.parse(cacheValue) : []

    const list: BranchCompareEntry[] = [];

    for (const filteredProject of projects) {
      const projectId = filteredProject.id

      const cacheEntry = cacheData.find(c => c.projectName === filteredProject.name
          && c.projectCommitCount === filteredProject.statistics.commit_count)

      if (cacheEntry != undefined) {
        list.push(cacheEntry)
        continue
      }

      const projectBranches = await gitlabApi.getBranches(projectId)

      const masterBranch = projectBranches.find(b => b.name === 'master' || b.name === 'main')?.name
      const devBranch = projectBranches.find(b => b.name === 'dev' || b.name === 'test')?.name
      const stagingBranch = projectBranches.find(b => b.name === 'staging')?.name


      if (masterBranch != null || devBranch != null || stagingBranch != null) {
        const comparison: BranchCompareEntry = {
          projectName: filteredProject.name,
          projectCommitCount: filteredProject.statistics.commit_count,
          branchesFound: true,
          testCommitsBehindMain: await getCommitComparisonNullable(projectId, masterBranch, devBranch),
          mainCommitsBehindTest: await getCommitComparisonNullable(projectId, devBranch, masterBranch),
          stagingCommitsBehindMain: await getCommitComparisonNullable(projectId, stagingBranch, masterBranch),
          mainCommitsBehindStaging: await getCommitComparisonNullable(projectId, masterBranch, stagingBranch),
        }

        list.push(comparison)
      } else {

        const comparison: BranchCompareEntry = {
          projectName: filteredProject.name,
          projectCommitCount: filteredProject.statistics.commit_count,
          branchesFound: false,
          testCommitsBehindMain: null,
          mainCommitsBehindTest: 0,
          stagingCommitsBehindMain: 0,
          mainCommitsBehindStaging: 0,
        }

        list.push(comparison)
      }
    }

    comparisons.value = list

    visibleComparisons.value = list.filter(c => c.testCommitsBehindMain != null)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .sort((a, b) => b.testCommitsBehindMain! - a.testCommitsBehindMain!)

    await Preferences.set({key: "compareBranchCache", value: JSON.stringify(comparisons.value)})

    error.value = false
  } catch (e: any) {
    error.value = true
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function getCommitComparisonNullable(projectId: number, sourceBranch: string|undefined, targetBranch: string|undefined): Promise<number|null> {
  if (sourceBranch == undefined || targetBranch == undefined) {
    return null
  } else {
    return (await gitlabApi.compareBranches(projectId, sourceBranch, targetBranch)).commits.length
  }
}

const forceRefresh = async () => {
  await cache.clearCacheEntry(cache.cacheKeyProjects)
  await load()
}

interface BranchCompareEntry {
  projectName: string,
  projectCommitCount: number,
  branchesFound: boolean,
  testCommitsBehindMain: number|null
  mainCommitsBehindTest: number|null
  stagingCommitsBehindMain: number|null
  mainCommitsBehindStaging: number|null
}


</script>

<style scoped>
th, td {
  padding: 12px;
}
</style>
