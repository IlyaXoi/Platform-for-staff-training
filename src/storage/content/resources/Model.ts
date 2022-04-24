export type ResourceStatus = "loading" | "fulfilled" | "failed"
export type ResourceType = "quiz" | "page" | "video" | "task" | "test"

export interface ResourceData {
    [type: string]: {
        [type: string]: Resource[]
    }
}

export interface Resource {
    id: string,
    company: string,
    type: ResourceType,
    path: string,
    name: string
}