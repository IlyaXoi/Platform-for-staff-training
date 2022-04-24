import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {QuizModel} from "./Model";
import {v4 as uuid} from "uuid";
import {asError, ValidationAwareState, ValidationErrors} from "../index";
import {saveQuiz} from "./QuizThunk";
// @ts-ignore
import {CognitoUserAmplify} from "aws-amplify";
import {DataApiService} from "../../../auth/DataApiService";

const apiService = new DataApiService()

interface CreateQuizState extends ValidationAwareState {
    status: "loading" | "failed" | "idle" | "fulfilled" | "data-loading" | "data-loading-failed" | "data-loaded"
    data?: QuizModel,
    editableDataCopy?: QuizModel
}

const randomInt = () => {
    return Math.floor(Math.random() * 9999999)
}
const initialQid = randomInt()
const initialOid1 = randomInt()
const initialOid2 = randomInt()

const initialState: CreateQuizState = {
    status: "idle",
}

export const editQuizSlice = createSlice({
    name: "createQuiz",
    initialState,
    reducers: {
        create: state => {
            state.data = {
                id: uuid(),
                name: "Untitled",
                type: "quiz",
                company: "BSU",
                questions: [
                    {
                        id: initialQid,
                        text: "Question ... ?",
                        options: [
                            {
                                id: initialOid1,
                                text: "Answer ...",
                                right: true
                            },
                            {
                                id: initialOid2,
                                text: "Answer ...",
                                right: false
                            }
                        ]
                    }
                ]
            }
            state.editableDataCopy = state.data
            state.status = "data-loaded"
        },
        setName: (state, action: PayloadAction<string>) => {
            if (state.editableDataCopy) {
                state.editableDataCopy.name = action.payload
            }
        },
        setType: (state, action: PayloadAction<string>) => {
            if (state.editableDataCopy) {
                state.editableDataCopy.type = action.payload
            }
        },
        setMaxAttempts: (state, action: PayloadAction<number | undefined>) => {
            if (state.editableDataCopy) {
                state.editableDataCopy.maxCompletedTimes = action.payload
            }
        },
        addQuestion: (state) => {
            if (state.editableDataCopy) {
                const qid = randomInt()
                const questions = state.editableDataCopy.questions
                questions.push(
                    {
                        id: qid,
                        text: "",
                        options: []
                    }
                )
            }
        },
        setQuestionText: (state, action: PayloadAction<{ qid: number, text: string }>) => {
            if (state.editableDataCopy) {
                const qid = action.payload.qid
                const text = action.payload.text
                const q = state.editableDataCopy.questions.find(it => it.id === qid)
                if (q) {
                    q.text = text
                }
            }
        },
        setOptionText: (state, action: PayloadAction<{ qid: number, oid: number, text: string }>) => {
            if (state.editableDataCopy) {
                const qid = action.payload.qid
                const oid = action.payload.oid
                const text = action.payload.text
                const q = state.editableDataCopy.questions.find(it => it.id === qid)
                if (q) {
                    const option = q.options.find(it => it.id === oid)
                    if (option) {
                        option.text = text
                    }
                }
            }
        },
        setOptionCorrect: (state, action: PayloadAction<{ qid: number, oid: number }>) => {
            if (state.editableDataCopy) {
                const qid = action.payload.qid
                const oid = action.payload.oid
                const q = state.editableDataCopy.questions.find(it => it.id === qid)
                if (q) {
                    const option = q.options.find(it => it.id === oid)
                    if (option && option.right) {
                        option.right = false
                    } else if (option && !option.right) {
                        option.right = true
                    }
                }
            }
        },
        deleteQuestion: (state, action: PayloadAction<number>) => {
            if (state.editableDataCopy) {
                const qid = action.payload
                state.editableDataCopy.questions = state.editableDataCopy.questions.filter(it => it.id !== qid)
            }
        },
        addOption: (state, action: PayloadAction<{ qid: number }>) => {
            if (state.editableDataCopy) {
                const qid = action.payload.qid
                const oid = randomInt()
                const q = state.editableDataCopy.questions.find(it => it.id === qid)
                if (q) {
                    q.options.push(
                        {
                            id: oid,
                            text: "New option",
                            right: false
                        }
                    )
                }
            }
        },
        deleteOption: (state, action: PayloadAction<{ qid: number, oid: number }>) => {
            if (state.editableDataCopy) {
                const qid = action.payload.qid
                const oid = action.payload.oid
                const q = state.editableDataCopy.questions.find(it => it.id === qid)
                if (q) {
                    q.options = q.options.filter(it => it.id !== oid)
                }
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
        },
    },
    extraReducers: builder => {
        builder.addCase(saveQuiz.pending, state => {
            state.status = "loading"
        })
        builder.addCase(saveQuiz.rejected, state => {
            state.status = "failed"
        })
        builder.addCase(saveQuiz.fulfilled, (state, action) => {
            const payload = action.payload
            if (payload && "error" in payload) {
                console.log(payload.error)
                state.status = "failed"
            } else {
                state.status = "fulfilled"
                state.data = state.editableDataCopy
            }
        })
        builder.addCase(getEditableQuizById.pending, state => {
            state.status = "data-loading"
        })
        builder.addCase(getEditableQuizById.rejected, state => {
            state.status = "data-loading-failed"
        })
        builder.addCase(getEditableQuizById.fulfilled, (state, action) => {
            const payload = action.payload
            if (payload && "error" in payload) {
                console.log(payload.error)
                state.status = "data-loading-failed"
            } else {
                state.status = "data-loaded"
                state.data = action.payload as QuizModel
                state.editableDataCopy = state.data
            }
        })
    }
})

export const getEditableQuizById = createAsyncThunk(
    "quiz/getById",
    async (req: { id: string, user: CognitoUserAmplify }) => {
        try {
            return await apiService.getEditableQuiz(req.id, req.user)
        } catch (error: any) {
            return asError(error)
        }
    }
)

export const {
    create,
    setName,
    setType,
    addQuestion,
    addOption,
    deleteOption,
    deleteQuestion,
    setOptionCorrect,
    setOptionText,
    setQuestionText,
    setValidationError,
    deleteValidationError,
    setMaxAttempts
} = editQuizSlice.actions

export default editQuizSlice.reducer