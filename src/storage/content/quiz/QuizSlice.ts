import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Option, Quiz, QuizAnswers, QuizResult, QuizStatus} from "./Model";
import {getQuizById, saveResults} from "./QuizThunk";

interface QuizState {
    status: QuizStatus
    data?: Quiz,
    quizAnswers: QuizAnswers,
    completed: boolean,
    result?: QuizResult
}

const initialState: QuizState = {
    status: "fulfilled",
    quizAnswers: {},
    completed: false,
}

const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        handleToggle: (state, action: PayloadAction<{qid: number, option: Option}>) => {
            const answers = state.quizAnswers
            const option = action.payload.option
            const qid = action.payload.qid
            const oid = option.id
            if (answers[qid]) {
                if (answers[qid][oid]) {
                    delete answers[qid][oid]
                } else {
                    answers[qid][oid] = option
                }
            } else {
                answers[qid] = {[oid]: option}
            }
        },
        setResult: (state, action: PayloadAction<QuizResult>) => {
            state.result = action.payload
            state.completed = true
        },
        tryAgain: state => {
            state.quizAnswers = {}
            state.completed = false
        }
    },
    extraReducers: builder => {
        builder.addCase(getQuizById.pending, state => {
            state.status = "data-loading"
        })
        builder.addCase(getQuizById.rejected, state => {
            state.status = "data-loading-failed"
        })
        builder.addCase(getQuizById.fulfilled, (state, action) => {
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
                state.data = payload as Quiz
            }
        })
        builder.addCase(saveResults.pending, state => {
            state.status = "loading"
        })
        builder.addCase(saveResults.rejected, state => {
            state.status = "failed"
        })
        builder.addCase(saveResults.fulfilled, (state, action) => {
            const payload = action.payload
            if (payload && "error" in payload) {
                state.status = "failed"
            } else {
                state.status = "fulfilled"
                state.data = action.payload as Quiz
            }
        })
    }
})

export const {handleToggle, setResult, tryAgain} = quizSlice.actions

export default quizSlice.reducer