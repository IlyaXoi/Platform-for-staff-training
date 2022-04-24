import {TNode} from "@udecode/plate";
import {ValidationErrors} from "../../../storage/content";
import {Page, PageStatus} from "../../../storage/content/page/Model";

export const helperText = (type: string, errors?: ValidationErrors) => {
    if (errors && errors[type]) {
        return errors[type].error
    }
    return ""
}

export const isCurrentPageValid = (page: { id?: string, company?: string, name?: string, path?: string, content?: TNode[] }) => {
    return page.id && page.content && page.name && page.path && page.content
}

export const isPageLoading = (status: PageStatus) => {
    return status === "data-loading"
}

export const isSelected = (status: PageStatus) => {
    return status === "selected"
}

export const isNotSelected = (status: PageStatus) => {
    return status === "not-selected"
}

export const isCreating = (status: PageStatus) => {
    return status === "creating"
}