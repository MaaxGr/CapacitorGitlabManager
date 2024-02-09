<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>Gitlab Manager</ion-list-header>
            <ion-note>{{ userProfileStore.username }}</ion-note>

            <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none"
                        detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
                <ion-icon aria-hidden="true" slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/vue';
import {onMounted, ref} from 'vue';
import {cogOutline, cogSharp, gitBranchOutline, gitBranchSharp, homeOutline, homeSharp} from 'ionicons/icons';
import {useRoute} from "vue-router";
import {useProfile, userProfileStore} from "@/composables/profile";
import {addListeners, registerNotifications} from "@/composables/notifications";
import {Capacitor} from "@capacitor/core";

const route = useRoute()
const profile = useProfile();
const selectedIndex = ref(0);

onMounted(async () => {
  await profile.reloadProfile()

  if (Capacitor.getPlatform() === 'android') {
    await addListeners()
    await registerNotifications()
  }
});

const appPages = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: 'Assigned MRs',
    url: '/assigned-mrs',
    iosIcon: gitBranchOutline,
    mdIcon: gitBranchSharp,
  },
  {
    title: 'Review MRs',
    url: '/review-mrs',
    iosIcon: gitBranchOutline,
    mdIcon: gitBranchSharp,
  },
  {
    title: 'Renovate MRs',
    url: '/renovate-mrs',
    iosIcon: gitBranchOutline,
    mdIcon: gitBranchSharp,
  },
  {
    title: 'Compare Branches',
    url: '/compare-branches',
    iosIcon: cogOutline,
    mdIcon: cogSharp,
  },
  {
    title: 'Settings',
    url: '/settings',
    iosIcon: cogOutline,
    mdIcon: cogSharp,
  }
];

selectedIndex.value = appPages.findIndex(p => p.url === route.path)

</script>

<style scoped>

ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
