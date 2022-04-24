// @ts-ignore
import {CognitoUserAmplify} from "aws-amplify";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {asError} from "../index";
import {Page} from "./Model";
import {DataApiService} from "../../../auth/DataApiService";

const apiService = new DataApiService()

export const getPageById = createAsyncThunk(
    "page/getById",
    async (req: { id: string, user: CognitoUserAmplify }) => {
        try {
            return await apiService.getPage(req.id, req.user)
        } catch (error: any) {
            return asError(error)
        }
    }
)

export const savePage = createAsyncThunk(
    "page/save",
    async (req: { data: Page, user: CognitoUserAmplify }) => {
        try {
            return await apiService.savePage(req.data, req.user)
        } catch (error: any) {
            return asError(error)
        }
    }
)