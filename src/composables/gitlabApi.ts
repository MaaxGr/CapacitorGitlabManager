import {CapacitorHttp} from "@capacitor/core";
import {useSettings} from "@/composables/settings";

export function useGitlabApi() {

    const settings = useSettings();

    async function getGitlabVersion() {
        const response = await CapacitorHttp.get({
            url: `${await settings.getGitlabBaseUrl()}/version`,
            headers: {"PRIVATE-TOKEN": await settings.getGitlabToken()}
        });
        return response.data;
    }

    async function getAllProjects(): Promise<Project[]> {
        let projects: any[] = [];
        let page = 1;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const pageProjects = await getProjects(page);

            if (pageProjects.length === 0) {
                break;
            }

            projects = projects.concat(pageProjects);
            page++;
        }

        return projects;
    }

    async function getProjectCount() {
        return (await getAllProjects()).length;
    }

    async function getRenovateMRCount() {
        const response = await CapacitorHttp.get({
            url: `${await settings.getGitlabBaseUrl()}/merge_requests`,
            headers: {"PRIVATE-TOKEN": await settings.getGitlabToken()},
            params: {
                "per_page": "100",
                "state": "opened",
                "scope": "all",
                "author_username": "Renovate"
            },
            connectTimeout: 3000,
            readTimeout: 3000
        });
        return response.data.length;
    }

    async function getProjects(page: number): Promise<Project[]> {
        const response = await CapacitorHttp.get({
            url: `${await settings.getGitlabBaseUrl()}/projects`,
            headers: {"PRIVATE-TOKEN": await settings.getGitlabToken()},
            params: {
                "per_page": "100",
                "page": `${page}`,
                "statistics": "true"
            },
            connectTimeout: 3000,
            readTimeout: 3000
        });
        if (response.status !== 200) {
            throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        return response.data;
    }

    async function getAssignedMRs(): Promise<MergeRequest[]> {
        const response = await CapacitorHttp.get({
            url: `${await settings.getGitlabBaseUrl()}/merge_requests`,
            headers: {"PRIVATE-TOKEN": await settings.getGitlabToken()},
            params: {
                "per_page": "100",
                "scope": "assigned_to_me",
                "state": "opened"
            },
            connectTimeout: 3000,
            readTimeout: 3000
        });
        return response.data;
    }

    async function getUser(): Promise<User> {
        const response = await CapacitorHttp.get({
            url: `${await settings.getGitlabBaseUrl()}/user`,
            headers: {"PRIVATE-TOKEN": await settings.getGitlabToken()},
            connectTimeout: 3000,
            readTimeout: 3000
        });
        if (response.status !== 200) {
            throw new Error(`Failed to fetch user: ${response.status}`);
        }
        return response.data;
    }

    async function getReviewMRs(reviewerId: number): Promise<MergeRequest[]> {
        const response = await CapacitorHttp.get({
            url: `${await settings.getGitlabBaseUrl()}/merge_requests`,
            headers: {"PRIVATE-TOKEN": await settings.getGitlabToken()},
            params: {
                "per_page": "100",
                "scope": "all",
                "reviewer_id": `${reviewerId}`,
                "state": "opened"
            },
            connectTimeout: 3000,
            readTimeout: 3000
        });
        return response.data;
    }

    async function getRenovatewMRs(): Promise<MergeRequest[]> {
        const response = await CapacitorHttp.get({
            url: `${await settings.getGitlabBaseUrl()}/merge_requests`,
            headers: {"PRIVATE-TOKEN": await settings.getGitlabToken()},
            params: {
                "per_page": "100",
                "state": "opened",
                "scope": "all",
                "author_username": "Renovate"
            },
            connectTimeout: 3000,
            readTimeout: 3000
        });
        return response.data;
    }

    async function getBranches(projectId: number): Promise<Branch[]> {
        const response = await CapacitorHttp.get({
            url: `${await settings.getGitlabBaseUrl()}/projects/${projectId}/repository/branches`,
            headers: {"PRIVATE-TOKEN": await settings.getGitlabToken()},
            connectTimeout: 3000,
            readTimeout: 3000
        });
        return response.data;
    }

    async function compareBranches(projectId: number, base: string, head: string): Promise<BranchComparison> {
        const response = await CapacitorHttp.get({
            url: `${await settings.getGitlabBaseUrl()}/projects/${projectId}/repository/compare`,
            headers: {"PRIVATE-TOKEN": await settings.getGitlabToken()},
            params: {
                from: base,
                to: head
            },
            connectTimeout: 3000,
            readTimeout: 3000
        });
        return response.data;
    }

    return {
        getGitlabVersion,
        getAllProjects,
        getProjectCount,
        getRenovateMRCount,
        getAssignedMRs,
        getRenovatewMRs,
        getReviewMRs,
        getUser,
        getBranches,
        compareBranches
    }
}

export interface BranchComparison {
    commits: any[]
}

export interface MergeRequest {
    id: number,
    project_id: number,
    title: string,
    source_branch: string,
    target_branch: string,
    author: Author,
}

export interface Project {
    id: number,
    name: string,
    name_with_namespace: string,
    last_activity_at: string,
    statistics: ProjectStatistics,
}

export interface ProjectStatistics {
    commit_count: number,
}


export interface Author {
    avatar_url: string,
}

export interface User {
    id: number,
    username: string,
    avatar_url: string,
}

export interface Branch {
    name: string
}