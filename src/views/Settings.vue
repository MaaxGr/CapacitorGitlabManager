<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">
        <ion-progress-bar v-if="loading" type="indeterminate"></ion-progress-bar>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Common</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-toggle v-model="switchSecondaryGitlab">Use Secondary Gitlab</ion-toggle>
                <br/><br/>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Gitlab Primary</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-input label="Base URL:" v-model="primaryGitlabBaseUrl"></ion-input>
              </ion-item>

              <ion-item>
                <ion-input label="Token:" type="password" v-model="primaryGitlabToken"></ion-input>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Gitlab Secondary</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-input label="Base URL:" v-model="secondaryGitlabBaseUrl"></ion-input>
              </ion-item>

              <ion-item>
                <ion-input label="Token:" type="password" v-model="secondaryGitlabToken"></ion-input>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-button style="margin-left: 10px" @click="save()">Save</ion-button>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToggle,
  IonToolbar,
  IonInput,
  IonItem,
  IonButton,
  IonList
} from "@ionic/vue";

import {onMounted, ref} from "vue";
import {Preferences} from "@capacitor/preferences";
import {useAppCache} from "@/composables/cache";
import {useProfile} from "@/composables/profile";

const cache = useAppCache();
const profile = useProfile();

const loading = ref(false)

const switchSecondaryGitlab = ref(false)
const primaryGitlabBaseUrl = ref('')
const primaryGitlabToken = ref('')
const secondaryGitlabBaseUrl = ref('')
const secondaryGitlabToken = ref('')


onMounted(async () => {
  try {
    loading.value = true
    const settingSwitchSecondaryGitlab = await Preferences.get({key: 'settingSwitchSecondaryGitlab'});
    switchSecondaryGitlab.value = settingSwitchSecondaryGitlab.value === 'true';

    const settingPrimaryGitlabBaseUrl = await Preferences.get({key: 'settingPrimaryGitlabBaseUrl'});
    primaryGitlabBaseUrl.value = settingPrimaryGitlabBaseUrl.value ?? "";

    const settingPrimaryGitlabToken = await Preferences.get({key: 'settingPrimaryGitlabToken'});
    primaryGitlabToken.value = settingPrimaryGitlabToken.value ?? "";

    const settingSecondaryGitlabBaseUrl = await Preferences.get({key: 'settingSecondaryGitlabBaseUrl'});
    secondaryGitlabBaseUrl.value = settingSecondaryGitlabBaseUrl.value ?? "";

    const settingSecondaryGitlabToken = await Preferences.get({key: 'settingSecondaryGitlabToken'});
    secondaryGitlabToken.value = settingSecondaryGitlabToken.value ?? "";
  } finally {
    loading.value = false
  }
});

async function save() {
  await cache.clearCache();

  await Preferences.set({key: 'settingSwitchSecondaryGitlab', value: switchSecondaryGitlab.value.toString()});
  await Preferences.set({key: 'settingPrimaryGitlabBaseUrl', value: primaryGitlabBaseUrl.value});
  await Preferences.set({key: 'settingPrimaryGitlabToken', value: primaryGitlabToken.value});
  await Preferences.set({key: 'settingSecondaryGitlabBaseUrl', value: secondaryGitlabBaseUrl.value});
  await Preferences.set({key: 'settingSecondaryGitlabToken', value: secondaryGitlabToken.value});

  await profile.reloadProfile()
}


</script>