import {TNode} from "@udecode/plate";

export type PageStatus = "loading" | "selected" | "not-selected" | "failed" | "creating" | "data-loading" | "data-loading-failed" | "data-loaded" | "resource-not-found"
export type EditorType = "video" | "page" | "task"

export interface Page {
    id: string,
    company: string,
    type: EditorType,
    name: string,
    path: string,
    data: TNode[]
}