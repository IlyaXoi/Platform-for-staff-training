import {TNode} from "@udecode/plate";

export interface Question {
    text: string
    options: Option[]
}

export interface Option {
    text: string
    right: boolean
}

export interface Content {
    id?: string,
    company?: string,
    name?: string,
    type: "none" | "quiz" | "task" | "article" | "video"
    editing?: boolean,
    path?: string,
    status: "loading" | "selected" | "not-selected" | "failed" | "creating"
}

export interface Page extends Content {
    content?: TNode[],
}

export interface Quiz extends Content {
    content?: Question[]
}

export interface ValidationErrors {
    [type: string]: {
        error: string
    }
}