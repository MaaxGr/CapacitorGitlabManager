import {Preferences} from "@capacitor/preferences";

export function useSettings() {

    const keySettingSwitchSecondaryGitlab = "settingSwitchSecondaryGitlab";
    const keySettingPrimaryGitlabBaseUrl = "settingPrimaryGitlabBaseUrl";
    const keySettingPrimaryGitlabToken = "settingPrimaryGitlabToken";
    const keySettingSecondaryGitlabBaseUrl = "settingSecondaryGitlabBaseUrl";
    const keySettingSecondaryGitlabToken = "settingSecondaryGitlabToken";

    async function getGitlabBaseUrl() {
        if ((await getSetting(keySettingSwitchSecondaryGitlab)) == "true") {
            return await getSetting(keySettingSecondaryGitlabBaseUrl) ?? "";
        } else {
            return await getSetting(keySettingPrimaryGitlabBaseUrl) ?? "";
        }
    }

    async function getGitlabToken() {
        if ((await getSetting(keySettingSwitchSecondaryGitlab)) == "true") {
            return await getSetting(keySettingSecondaryGitlabToken) ?? "";
        } else {
            return await getSetting(keySettingPrimaryGitlabToken) ?? "";
        }
    }

    async function getSetting(key: string) {
        return (await Preferences.get({key: key})).value;
    }


    return {
        keySettingPrimaryGitlabBaseUrl,
        keySettingPrimaryGitlabToken,
        keySettingSecondaryGitlabBaseUrl,
        keySettingSecondaryGitlabToken,
        keySettingSwitchSecondaryGitlab,
        getGitlabBaseUrl,
        getGitlabToken
    }

}