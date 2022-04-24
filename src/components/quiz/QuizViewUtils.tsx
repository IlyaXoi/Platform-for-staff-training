import {Quiz, QuizAnswers, QuizResult} from "../../storage/content/quiz/Model";
import {Box, Divider, Typography} from "@mui/material";

export const isOptionCorrect = (result: QuizResult, qid: number, oid: number) =>
    result[qid].correctAnswers.includes(oid)

export const isOptionIncorrect = (result: QuizResult, qid: number, oid: number) =>
    result[qid].incorrectAnswers.includes(oid)

export const isOptionMissed = (result: QuizResult, qid: number, oid: number) =>
    result[qid].missedAnswers.includes(oid)

export const isQuestionCorrect = (result: QuizResult, qid: number) =>
    result[qid].incorrectAnswers.length === 0 && result[qid].missedAnswers.length === 0

export const isQuestionIncorrect = (result: QuizResult, qid: number) =>
    result[qid].incorrectAnswers.length !== 0 && result[qid].missedAnswers.length !== 0

export const buildResult = (data: Quiz, answers: QuizAnswers) => {
    const result: QuizResult = {
        attempt: data.completedTimes + 1
    }
    const questions = data.questions
    for (const q of questions) {
        result[q.id] = {
            correct: false,
            correctAnswers: [],
            incorrectAnswers: [],
            missedAnswers: []
        }
        const correctAnswers = q.options.filter(option => option.right).map(option => option.id)
        const userAnswers = Object.values(answers[q.id] || {})

        for (const userAnswer of userAnswers) {
            if (userAnswer.right) {
                result[q.id].correctAnswers.push(userAnswer.id)
            } else {
                result[q.id].incorrectAnswers.push(userAnswer.id)
            }
        }
        if (userAnswers.length === 0) {
            result[q.id].missedAnswers = correctAnswers
        } else {
            result[q.id].missedAnswers = correctAnswers
                .filter(it => !userAnswers.find(ua => ua.id === it))
        }
        if (result[q.id].missedAnswers.length === 0 && result[q.id].incorrectAnswers.length === 0) {
            result[q.id].correct = true
        }
    }
    return result
}

export const buildResultText = (result: QuizResult) => {
    const resultStats = getQuizResultStats(result)
    return (
        <Box>
            <Typography>Attempt: {result.attempt}</Typography>
            <Divider sx={{my: 2}}/>
            <Typography>You've answered correctly {resultStats.correctCount} out
                of {resultStats.totalCount} questions</Typography>
        </Box>
    )
}

export const getQuizResultStats = (result: QuizResult) => {
    return {
        correctCount: Object.keys(result).filter(key => key !== "attempt")
            .filter(qid => result[qid].correct)
            .length,
        totalCount: Object.keys(result).filter(key => key !== "attempt")
            .length
    }
}