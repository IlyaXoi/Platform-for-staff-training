import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {EditorType, Page, PageStatus} from "./Model";
import {ValidationAwareState, ValidationErrors} from "../index";
import {TNode} from "@udecode/plate";
import {getPageById} from "./PageThunk";

interface PageState extends ValidationAwareState {
    status: PageStatus,
    isEditable: boolean,
    page?: Page,
    editingPage?: Page
}

const initialState: PageState = {
    status: "not-selected",
    isEditable: false
}

export const pageSlice = createSlice(
    {
        name: "page",
        initialState,
        reducers: {
            setIsEditable: (state, action: PayloadAction<boolean>) => {
                state.isEditable = action.payload
                if (!action.payload) {
                    state.editingPage = undefined
                } else {
                    state.editingPage = state.page
                }
            },
            setData: (state, action: PayloadAction<TNode[]>) => {
                if (state.editingPage && state.page) {
                    state.editingPage.data = action.payload
                }
            },
            setName: (state, action: PayloadAction<string>) => {
                if (state.editingPage) {
                    state.editingPage.name = action.payload
                }
            },
            create: (state, action: PayloadAction<{ id: string, type: EditorType }>) => {
                state.page = {
                    id: action.payload.id,
                    company: "BSU",
                    type: action.payload.type,
                    name: "Untitled",
                    path: "",
                    data: [{type: "h1", children: [{text: "Untitled"}]}]
                }
                state.editingPage = state.page
                state.isEditable = true
                state.status = "creating"
            },
            setValidationError: (state, action: PayloadAction<ValidationErrors>) => {
                state.validation = {
                    ...state.validation,
                    ...action.payload
                }
            },
            deleteValidationError: (state, action: PayloadAction<string>) => {
                if (state.validation) {
                    delete state.validation[action.payload]
                }
            }
        },
        extraReducers: builder => {
            builder.addCase(getPageById.pending, state => {
                state.status = "data-loading"
            })
            builder.addCase(getPageById.rejected, state => {
                state.status = "data-loading-failed"
            })
            builder.addCase(getPageById.fulfilled, (state, action) => {
                const payload = action.payload
                if ("error" in payload) {
                    // @ts-ignore
                    if (payload.status && payload.status === 404) {
                        state.status = "resource-not-found"
                    } else {
                        state.status = "data-loading-failed"
                    }
                } else {
                    state.status = "data-loaded"
                    state.page = payload as Page
                }
            })
        }
    }
)

export const {setIsEditable, create, setData, setName, setValidationError, deleteValidationError} = pageSlice.actions

export default pageSlice.reducer