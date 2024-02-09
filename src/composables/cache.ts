import {Project, useGitlabApi} from "@/composables/gitlabApi";
import {Preferences} from "@capacitor/preferences";

export function useAppCache() {

    const gitlabApi = useGitlabApi();
    const cacheKeyProjects = "projects";
    const cacheKeyProjectCount = "projectCount";
    const cacheKeyRenovateMRCount = "renovateMRCount";

    async function clearCache() {
        await clearCacheEntry(cacheKeyProjects);
        await clearCacheEntry(cacheKeyProjectCount);
        await clearCacheEntry(cacheKeyRenovateMRCount);
    }

    async function clearCacheEntry(key: string) {
        await Preferences.remove({key: key});
    }

    async function getFromCache<T>(key: string, fallback: () => T|undefined): Promise<T> {
        const cached = await Preferences.get({key: key});
        if (cached.value) {
            return JSON.parse(cached.value);
        } else {
            const value = await fallback();
            if (value != undefined) {
                await Preferences.set({key: key, value: JSON.stringify(value)});
                return value;
            } else {
                throw new Error(`Could not get value for key ${key}`);
            }
        }
    }

    async function getProjectsCached(): Promise<Project[]> {
        return getFromCache(cacheKeyProjects, async () => {
            return await gitlabApi.getAllProjects();
        })
    }

    return {
        cacheKeyProjects,
        clearCacheEntry,
        clearCache,
        getProjectsCached,
        getFromCache
    }

}