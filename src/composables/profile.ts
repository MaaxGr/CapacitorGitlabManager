import {useGitlabApi} from "@/composables/gitlabApi";
import {reactive} from "vue";

export const useProfile = () => {

    const gitlabApi = useGitlabApi();

    async function reloadProfile() {
        try {
            const user = await gitlabApi.getUser();
            userProfileStore.username = user.username;
            userProfileStore.userId = user.id;
            userProfileStore.profileLoaded = true;
        } catch (e) {
            userProfileStore.username = "";
            userProfileStore.userId = 0;
            userProfileStore.profileLoaded = false;
            console.error(e);
        }
    }

    return {
        reloadProfile
    }
}

export const userProfileStore = reactive({
    profileLoaded: false,
    username: "",
    userId: 0
})