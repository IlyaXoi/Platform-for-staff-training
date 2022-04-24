import {ValidationAwareState} from "../index";
import {ResourceData, ResourceStatus, ResourceType} from "./Model";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {deleteResource, getResources} from "./ResourcesThunk";

interface ResourcesState extends ValidationAwareState {
    status: ResourceStatus,
    selectedItemType?: ResourceType,
    data?: ResourceData
}

const initialState: ResourcesState = {
    status: "fulfilled"
}

const resourceSlice = createSlice({
    name: "resources",
    initialState,
    reducers: {
        setSelectedItemType: (state, action: PayloadAction<ResourceType>) => {
            state.selectedItemType = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(getResources.pending, state => {
            state.status = "loading"
        })
        builder.addCase(getResources.rejected, state => {
            state.status = "failed"
        })
        builder.addCase(getResources.fulfilled, ((state, action) => {
            const payload = action.payload
            if ("error" in payload) {
                state.status = "failed"
            } else {
                state.status = "fulfilled"
                state.data = payload as ResourceData
            }
        }))
        builder.addCase(deleteResource.pending, state => {
            state.status = "loading"
        })
        builder.addCase(deleteResource.rejected, state => {
            state.status = "failed"
        })
        builder.addCase(deleteResource.fulfilled, ((state, action) => {
            const payload = action.payload
            if ("error" in payload) {
                state.status = "failed"
            } else {
                state.status = "fulfilled"
            }
        }))
    }
})

export const {setSelectedItemType} = resourceSlice.actions

export default resourceSlice.reducer