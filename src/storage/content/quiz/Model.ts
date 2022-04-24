export type QuizStatus = "loading" | "failed" | "fulfilled" | "data-loading" | "data-loaded" | "data-loading-failed" | "resource-not-found"

export interface Quiz {
    id: string,
    name: string,
    type: string, //always "quiz" or "test"
    questions: Question[],
    completedTimes: number,
    maxCompletedTimes?: number,
    grade?: number,
    quizResults: QuizResult[]
}

export interface QuizModel {
    id: string,
    name: string,
    type: string,
    company: string,
    questions: Question[],
    maxCompletedTimes?: number
}

export interface Question {
    id: number,
    text: string,
    options: Option[]
}

export interface Option {
    id: number,
    text: string,
    right: boolean
}

export interface QuizResult {
    attempt: number,
    [qid: number]: {
        correct: boolean
        correctAnswers: Array<number>
        incorrectAnswers: Array<number>
        missedAnswers: Array<number>
    }
}

export interface QuizAnswers {
    [qid: number]: {
        [oid: number]: Option
    }
}