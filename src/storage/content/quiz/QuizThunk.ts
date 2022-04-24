// @ts-ignore
import {CognitoUserAmplify} from "aws-amplify";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {asError} from "../index";
import {Quiz, QuizModel, QuizResult} from "./Model";
import {getQuizResultStats} from "../../../components/quiz/QuizViewUtils";
import {DataApiService} from "../../../auth/DataApiService";

const apiService = new DataApiService()

export const getQuizById = createAsyncThunk(
    "quiz/getById",
    async (req: { id: string, user: CognitoUserAmplify }) => {
        try {
            return await apiService.getQuiz(req.id, req.user)
        } catch (error: any) {
            return asError(error)
        }
    }
)

export const saveResults = createAsyncThunk(
    "quiz/saveResults",
    async (req: { result: QuizResult, data: Quiz, user: CognitoUserAmplify }) => {
        try {
            const dataDraft = {...req.data}
            dataDraft.completedTimes += 1
            dataDraft.quizResults = [...req.data.quizResults, req.result]
            const resultStats = getQuizResultStats(req.result)
            dataDraft.grade = (resultStats.correctCount / resultStats.totalCount) * 100

            await apiService.saveQuizResult(dataDraft, req.user)

            return dataDraft as Quiz
        } catch (error: any) {
            return asError(error)
        }
    }
)

export const saveQuiz = createAsyncThunk(
    "quiz/save",
    async (req: { data: QuizModel, user: CognitoUserAmplify }) => {
        try {
            return await apiService.saveQuiz(req.data, req.user)
        } catch (error: any) {
            return asError(error)
        }
    }
)