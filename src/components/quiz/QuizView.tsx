import React, {MouseEventHandler, useEffect} from "react";
import {
    Box,
    Checkbox,
    Divider,
    LinearProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    SxProps,
    Tab,
    Tabs,
    Theme,
    Typography,
    useTheme,
} from "@mui/material";
import {TabContext, TabPanel} from "@mui/lab";
import {ButtonOutlined} from "../common/ButtonOutlined";
import {useAppDispatch, useAppSelector} from "../../storage/hooks";
import {Option} from "../../storage/content/quiz/Model";
import {handleToggle as handleAnswerToggle, setResult, tryAgain} from '../../storage/content/quiz/QuizSlice'
import {Done, Error, Warning} from "@mui/icons-material";
import {
    buildResult,
    buildResultText,
    isOptionCorrect,
    isOptionIncorrect,
    isOptionMissed,
    isQuestionCorrect
} from "./QuizViewUtils";
import {TextDialog} from "../common/TextDialog";
import {isAdmin, UserAwareProps} from "../../auth/AuthUtils";
import {getQuizById, saveResults} from "../../storage/content/quiz/QuizThunk";
import {notFound} from "../view/MainView";
import {useNavigate} from "react-router-dom";

export interface QuizViewProps extends UserAwareProps {
    id: string,
    type: string
}

export const QuizView: React.FC<QuizViewProps> = ({id, type, user}) => {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getQuizById({id, user}))
    }, [dispatch, id, user.username])

    const [value, setValue] = React.useState(0);
    const [resultDialogOpen, setResultDialogOpen] = React.useState(false)

    const data = useAppSelector(state => state.quiz.data)
    const answers = useAppSelector(state => state.quiz.quizAnswers)
    const finished = useAppSelector(state => state.quiz.completed)
    const result = useAppSelector(state => state.quiz.result)
    const status = useAppSelector(state => state.quiz.status)

    const shouldShowResult = () => {
        if (data) {
            return data.type === "quiz"
        }
        return false
    }

    const handleToggle = (qid: number, option: Option) => {
        if (finished) return
        dispatch(handleAnswerToggle({qid, option}))
    }

    const isChecked = (qid: number, oid: number) => {
        if (!answers[qid]) return false
        return !!answers[qid][oid]
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleNext = (value: number) => {
        if (data && value < data.questions.length - 1) {
            setValue(value + 1)
        }
    }

    const handlePrevious = (value: number) => {
        if (value > 0) {
            setValue(value - 1)
        }
    }

    const handleFinish = () => {
        if (data) {
            const result = buildResult(data, answers)
            dispatch(setResult(result))
            console.log("Data after setResult called", data)
            dispatch(saveResults({result, data, user}))
            setResultDialogOpen(true)
        }
    }

    const resultIcon = (qid: number, oid: number) => {
        if (result && finished && shouldShowResult()) {
            if (isOptionIncorrect(result, qid, oid)) return <Error color={"error"}/>
            if (isOptionCorrect(result, qid, oid)) return <Done color={"success"}/>
            if (isOptionMissed(result, qid, oid)) return <Warning color={"warning"}/>
        }
        return ""
    }

    const checkboxColor = (qid: number, oid: number) => {
        if (result && finished && shouldShowResult()) {
            if (isOptionCorrect(result, qid, oid)) return "success"
            if (isOptionIncorrect(result, qid, oid)) return "error"
            if (isOptionMissed(result, qid, oid)) return "warning"
        }
        return "primary"
    }

    const listItemStyle = (qid: number, oid: number): SxProps<Theme> => {
        if (result && finished && shouldShowResult()) {
            if (isOptionCorrect(result, qid, oid)) {
                return {
                    borderBottom: 2,
                    borderBottomColor: theme.palette.success.main
                } as SxProps<Theme>
            }
            if (isOptionIncorrect(result, qid, oid)) {
                return {
                    borderBottom: 2,
                    borderBottomColor: theme.palette.error.main
                } as SxProps<Theme>
            }
            if (isOptionMissed(result, qid, oid)) {
                return {
                    borderBottom: 2,
                    borderBottomColor: theme.palette.warning.main
                } as SxProps<Theme>
            }
        }
        return {}
    }

    const tabStyle = (qid: number): SxProps<Theme> => {
        if (result && finished && shouldShowResult()) {
            if (isQuestionCorrect(result, qid)) {
                return {
                    borderBottom: 2,
                    borderBottomColor: theme.palette.success.main
                }
            } else {
                return {
                    borderBottom: 2,
                    borderBottomColor: theme.palette.error.main
                }
            }
        }
        return {}
    }

    const onDialogClose = () => {
        setResultDialogOpen(false)
    }

    const onTryAgain = () => {
        onDialogClose()
        dispatch(tryAgain())
        setValue(0)
    }

    const onEdit = () => {
        if (data) {
            navigate(`/${data.type}/${data.id}/edit`)
        }
    }

    if (!data && status === "data-loading-failed") {
        return notFound()
    }

    if (status === "resource-not-found") {
        return notFound()
    }

    return (
        data && status !== 'data-loading' ?
            <Box sx={{maxWidth: {xs: 320, sm: 480}, bgcolor: 'background.paper'}}>
                <Typography variant="h4">{data.name}</Typography>
                {
                    isAdmin(user) ?
                        <ButtonOutlined text={"Edit"} onClick={onEdit}/>
                        : ""
                }
                {
                    data.type === "test" ?

                        <>
                            <Divider sx={{my: 2}}/>
                            <Box sx={{display: "flex", flexDirection: "row"}}>
                                <Typography
                                    sx={{mx: 2}}>Grade: {data.grade !== undefined ? `${data.grade}%` : "Not completed yet"}</Typography>
                                {data.maxCompletedTimes ? <Typography sx={{mx: 2}}>Attempts
                                    remain: {data.maxCompletedTimes - data.completedTimes}</Typography> : ""}
                            </Box>
                            <Divider sx={{my: 2}}/>
                        </>
                        : ""
                }
                {
                    finished && result ?
                        <TextDialog
                            open={resultDialogOpen}
                            title={(data.type === "test" ? "Test" : "Quiz") + " results"}
                            text={buildResultText(result)}
                            onClose={onDialogClose}
                            additionalActions={[
                                {
                                    enabled: !data.maxCompletedTimes || data.completedTimes < data.maxCompletedTimes,
                                    text: "Try again",
                                    action: onTryAgain
                                }
                            ]}
                        />
                        : ""
                }
                <TabContext value={`${value}`}>
                    <Tabs
                        value={`${value}`}
                        onChange={(event, newValue: string) => handleChange(event, Number(newValue))}
                        variant={"scrollable"}
                        scrollButtons="auto"
                    >
                        {data.questions.map((q, index) => {
                            return (
                                <Tab sx={tabStyle(q.id)} key={q.id} value={`${index}`} label={`Q${index + 1}`}/>
                            )
                        })}
                    </Tabs>
                    {data.questions.map((question, index) => {
                        return (
                            <TabPanel key={index} value={`${index}`}>
                                <Box sx={{display: "flex", alignItems: "center", width: "100%"}}>
                                    <Box sx={{width: "100%"}}>
                                        <Box>
                                            <Typography sx={{my: 2}} variant={"h5"}>{question.text}</Typography>
                                        </Box>
                                        <Box>
                                            <List sx={{
                                                width: '100%',
                                                maxWidth: 360,
                                                minWidth: 360,
                                                bgcolor: 'background.paper'
                                            }}>
                                                {question.options.map((option) => {
                                                    const labelId = `checkbox-list-label-${option.id}`;
                                                    return (
                                                        <ListItem
                                                            key={option.id}
                                                            disablePadding
                                                            sx={listItemStyle(question.id, option.id)}
                                                        >
                                                            <ListItemButton role={undefined}
                                                                            onClick={() => handleToggle(question.id, option)}
                                                                            dense>
                                                                <ListItemIcon>
                                                                    <Checkbox
                                                                        edge="start"
                                                                        color={checkboxColor(question.id, option.id)}
                                                                        checked={isChecked(question.id, option.id)}
                                                                        tabIndex={-1}
                                                                        disableRipple
                                                                        inputProps={{'aria-labelledby': labelId}}
                                                                    />
                                                                </ListItemIcon>
                                                                <ListItemText id={labelId} primary={`${option.text}`}/>

                                                            </ListItemButton>
                                                            {finished ? resultIcon(question.id, option.id) : ""}
                                                        </ListItem>
                                                    );
                                                })}
                                            </List>
                                        </Box>
                                    </Box>
                                </Box>
                            </TabPanel>
                        )
                    })}
                </TabContext>
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <ButtonOutlined text="Previous" disabled={value === 0}
                                    onClick={() => handlePrevious(value)}/>
                    <ButtonOutlined text="Next" disabled={value === data.questions.length - 1}
                                    onClick={() => handleNext(value)}/>
                    {loadFinishButton(value, data.questions.length, handleFinish, data.completedTimes, data.maxCompletedTimes, finished)}
                    {(finished && (!data.maxCompletedTimes || data.completedTimes < data.maxCompletedTimes)) ?
                        <ButtonOutlined text={"Try again"} onClick={onTryAgain}/> : ""}
                </Box>
            </Box>
            : (
                <Box>
                    <Typography variant="h6" sx={{opacity: 0.5}}>Loading your questions, please wait...</Typography>
                    <LinearProgress/>
                </Box>
            )
    );
}

const loadFinishButton = (current: number, total: number, handleClick: MouseEventHandler<HTMLButtonElement>, currentAttempt: number, maxAttempts: number | undefined, finished: boolean) => {
    console.log(finished, current, total, maxAttempts, currentAttempt)
    console.log(maxAttempts)
    if (current === total - 1 && !finished && (!maxAttempts || (currentAttempt < maxAttempts))) {
        return <ButtonOutlined text="Finish" onClick={handleClick}/>
    }
    return ""
}


