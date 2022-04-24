import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {asError, ValidationAwareState, ValidationErrors} from "../index";
import {EditorType, Page} from "./Model";
import {TNode} from "@udecode/plate";
import {v4 as uuid} from "uuid";
import {savePage} from "./PageThunk";
// @ts-ignore
import {CognitoUserAmplify} from "aws-amplify";
import {DataApiService} from "../../../auth/DataApiService";

const apiService = new DataApiService()

interface EditPageState extends ValidationAwareState {
    id?: string
    status: "loading" | "failed" | "idle" | "fulfilled" | "data-loading" | "data-loaded" | "data-loading-failed"
    data?: Page,
    editableDataCopy?: Page
}

const initialState: EditPageState = {
    status: "idle",
}

const editPageSlice = createSlice({
    name: "editPage",
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            if (state.editableDataCopy) {
                state.editableDataCopy.name = action.payload
            }
        },
        setData: (state, action: PayloadAction<TNode[]>) => {
            if (state.editableDataCopy && state.data) {
                state.editableDataCopy.data = action.payload
            }
        },
        setType: (state, action: PayloadAction<EditorType>) => {
            if (state.editableDataCopy) {
                state.editableDataCopy.type = action.payload
            }
        },
        create: state => {
            state.data = {
                id: uuid(),
                name: "Untitled",
                path: "",
                company: "BSU",
                type: "page",
                data: [{type: "h1", children: [{text: "Untitled"}]}]
            }
            state.status = "data-loaded"
            state.editableDataCopy = state.data
        },
        discardChanges: state => {
            if (state.editableDataCopy && state.data) {
                state.editableDataCopy.id = state.data.id
                state.editableDataCopy.name = state.data.name
                state.editableDataCopy.type = state.data.type
                state.editableDataCopy.data = state.data.data
            }
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
        builder.addCase(getEditablePageById.pending, state => {
            state.status = "data-loading"
        })
        builder.addCase(getEditablePageById.rejected, state => {
            state.status = "data-loading-failed"
        })
        builder.addCase(getEditablePageById.fulfilled, (state, action) => {
            const payload = action.payload
            if ("error" in payload) {
                state.status = "data-loading-failed"
            } else {
                state.status = "data-loaded"
                state.data = payload as Page
                state.editableDataCopy = {
                    id: state.data.id,
                    name: state.data.name,
                    path: state.data.path,
                    company: state.data.company,
                    type: state.data.type,
                    data: state.data.data
                }
            }
        })
        builder.addCase(savePage.pending, (state => {
            state.status = "loading"
        }))
        builder.addCase(savePage.rejected, (state => {
            state.status = "failed"
        }))
        builder.addCase(savePage.fulfilled, ((state, action) => {
            const payload = action.payload
            if ("error" in payload) {
                state.status = "failed"
            } else {
                state.status = "fulfilled"
                if (state.data && state.editableDataCopy) {
                    state.data.name = state.editableDataCopy.name
                    state.data.type = state.editableDataCopy.type
                    state.data.data = state.editableDataCopy.data
                }
            }
        }))
    }
})

export const getEditablePageById = createAsyncThunk(
    "page/getById",
    async (req: { id: string, user: CognitoUserAmplify }) => {
        try {
            return await apiService.getPage(req.id, req.user)
        } catch (error: any) {
            return asError(error)
        }
    }
)

export const {
    setName,
    setData,
    setType,
    setValidationError,
    deleteValidationError,
    discardChanges,
    create
} = editPageSlice.actions

export default editPageSlice.reducer