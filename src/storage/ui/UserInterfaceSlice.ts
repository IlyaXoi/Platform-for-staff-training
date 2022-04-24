import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserInterfaceState {
    isDrawerOpen: boolean,
    isDeleteConfirmationDialogOpen: boolean
}

const initialState: UserInterfaceState = {
    isDrawerOpen: true,
    isDeleteConfirmationDialogOpen: false
}

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setIsDrawerOpen: (state, action: PayloadAction<boolean>) => {
            state.isDrawerOpen = action.payload
        },
        setIsDeleteConfirmationDialogOpen: (state, action: PayloadAction<boolean>) => {
            state.isDeleteConfirmationDialogOpen = action.payload
        }
    }
})

export const {setIsDrawerOpen, setIsDeleteConfirmationDialogOpen} = uiSlice.actions
export default uiSlice.reducer