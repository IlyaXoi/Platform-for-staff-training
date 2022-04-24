// @ts-ignore
import {CognitoUserAmplify} from "aws-amplify";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {asError} from "../index";
import {DataApiService} from "../../../auth/DataApiService";

const apiService = new DataApiService()

export const getResources = createAsyncThunk(
    "content/resources",
    async (req: { user: CognitoUserAmplify }) => {
        try {
            return await apiService.getResources(req.user)
        } catch (err) {
            return asError(err)
        }
    }
)

export const deleteResource = createAsyncThunk(
    "content/deleteResource",
    async (req: {id: string, user: CognitoUserAmplify}) => {
        try {
            return await apiService.deleteResource(req.id, req.user)
        } catch (err) {
            return asError(err)
        }
    }
)