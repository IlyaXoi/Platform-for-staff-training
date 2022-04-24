import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {helperText} from "../editor/view/EditorViewUtils";
import React, {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../storage/hooks";
import {
    addOption,
    addQuestion,
    create,
    deleteOption,
    deleteQuestion,
    deleteValidationError,
    setMaxAttempts,
    setName,
    setOptionCorrect,
    setOptionText,
    setQuestionText,
    setType
} from "../../storage/content/quiz/EditQuizSlice";
import {ButtonOutlined} from "../common/ButtonOutlined";
import {AddCircleOutline, Delete, DeleteOutlined, ExpandMore} from "@mui/icons-material";
import {useConfirm} from "material-ui-confirm";
import {useNavigate} from "react-router-dom";
import {getQuizById, saveQuiz} from "../../storage/content/quiz/QuizThunk";
import {UserAwareProps} from "../../auth/AuthUtils";

interface CreateQuizViewProps extends UserAwareProps {
    id?: string,
    type: string
}

export const EditQuizView: React.FC<CreateQuizViewProps> = ({id, type, user}) => {

    const [expanded, setExpanded] = React.useState<number | false>(false)
    const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false)
    }

    const confirm = useConfirm()
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            dispatch(getQuizById({id, user}))
        } else {
            dispatch(create())
        }
    }, [dispatch, id])

    const status = useAppSelector(state => state.quizCreation.status)
    const data = useAppSelector(state => state.quizCreation.data)
    const editableData = useAppSelector(state => state.quizCreation.editableDataCopy)
    const validationErrors = useAppSelector(state => state.quizCreation.validation)

    const onTypeSelect = (event: SelectChangeEvent) => {
        dispatch(setType(event.target.value as string))
    }
    const onNameChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const value = event.target.value
        if (value) {
            dispatch(setName(value));
            if (validationErrors && validationErrors["page-name"]) {
                dispatch(deleteValidationError("page-name"))
            }
        }
    }
    const onAddQuestion = () => {
        dispatch(addQuestion())
    }
    const onDeleteQuestion = (event: React.SyntheticEvent, qid: number) => {
        event.stopPropagation()
        confirm({
            description: "Are you sure you want to delete this question?",
            confirmationText: "Delete"
        }).then(() => dispatch(deleteQuestion(qid)))
    }
    const onQuestionTextChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, qid: number) => {
        const text = event.target.value
        dispatch(setQuestionText({qid, text}))
    }
    const onAddOption = (qid: number) => {
        dispatch(addOption({qid}))
    }
    const onDeleteOption = (qid: number, oid: number) => {
        confirm({
            description: "Are you sure you want to delete this answer option?",
            confirmationText: "Delete"
        }).then(() => dispatch(deleteOption({qid, oid})))
    }
    const onOptionTextChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, qid: number, oid: number) => {
        const text = event.target.value
        dispatch(setOptionText({qid, oid, text}))
    }
    const onOptionCorrectChange = (qid: number, oid: number) => {
        dispatch(setOptionCorrect({qid, oid}))
    }
    const onMaxAttemptsChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const maxAttempts = Number(event.target.value)
        dispatch(setMaxAttempts(maxAttempts))
    }
    const onSave = () => {
        if (data && editableData) {
            if (editableData.type === "quiz") {
                dispatch(setMaxAttempts(undefined))
            }
            dispatch(saveQuiz({data: editableData, user}))
        }
    }
    const onCancel = () => {
        navigate(-1)
    }

    useEffect(() => {
        if (status === "fulfilled" && data) {
            navigate(`/${data.type}/${data.id}`)
        }
    })

    return (
        <>
            {
                data && editableData && status === "data-loaded" ?
                    <Box>
                        <Box sx={{display: "flex", flexDirection: "row", mx: 2}}>
                            <TextField
                                sx={{width: 360, mx: 1}}
                                required
                                variant="standard"
                                id="name"
                                label="Name"
                                placeholder="Enter name here..."
                                helperText={helperText("name", validationErrors)}
                                error={validationErrors && !!validationErrors["name"]}
                                defaultValue={data.name || ""}
                                onChange={onNameChange}
                            />
                            <FormControl variant="standard" required>
                                <InputLabel id="type">Type</InputLabel>
                                <Select
                                    sx={{width: 74, mx: 1}}
                                    id="type"
                                    label="Type"
                                    placeholder={"Select type"}
                                    value={editableData.type}
                                    onChange={onTypeSelect}
                                >
                                    <MenuItem value={"quiz"}>Quiz</MenuItem>
                                    <MenuItem value={"test"}>Test</MenuItem>
                                </Select>
                            </FormControl>
                            {
                                editableData.type === "test" ? (
                                    <TextField
                                        sx={{minWidth: 120, mx: 1}}
                                        required
                                        variant="standard"
                                        type="number"
                                        id="max-attempts"
                                        label="Max attempts for test"
                                        placeholder=""
                                        helperText={helperText("maxAttempts", validationErrors)}
                                        error={validationErrors && !!validationErrors["maxAttempts"]}
                                        defaultValue={0}
                                        onChange={onMaxAttemptsChange}
                                    />
                                ) : ""
                            }
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "row"}}>
                            <ButtonOutlined text="Save" onClick={onSave}/>
                            <ButtonOutlined text="Add question" onClick={onAddQuestion}/>
                            <ButtonOutlined text="Discard" onClick={onCancel}/>
                        </Box>
                        <Divider sx={{marginBottom: 2}}/>
                        <Box>
                            {
                                Object.keys(editableData.questions).map((qid, index) => {
                                    const q = editableData.questions[qid]
                                    return (
                                        <Accordion key={qid}
                                                   expanded={expanded === (Number(qid))}
                                                   onChange={handleAccordionChange(Number(qid))}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMore/>}
                                                aria-controls={`${qid}-content`}
                                                id={`${qid}-header`}
                                            >
                                                <Box sx={{
                                                    width: "100%",
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    fontSize: theme.typography.h6.fontSize
                                                }}>
                                                    <Typography sx={{fontSize: "inherit"}}>
                                                        #{index + 1}. {q.text}
                                                    </Typography>
                                                    <IconButton onClick={(event) => onDeleteQuestion(event, q.id)}
                                                                size="small"
                                                                sx={{marginLeft: 2, fontSize: "inherit"}}
                                                                color={"error"}>
                                                        <Delete fontSize="inherit"/>
                                                    </IconButton>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Box>
                                                    <TextField onChange={(event) => onQuestionTextChange(event, q.id)}
                                                               label="Question"
                                                               sx={{width: 720, mx: 1, marginBottom: 4}}
                                                               variant="standard"
                                                               placeholder={"Enter question option..."}
                                                               defaultValue={q.text || ""}/>
                                                    <Box sx={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        mx: 1,
                                                        marginBottom: 1
                                                    }}>
                                                        <Typography fontSize={theme.typography.h6.fontSize}>Answer
                                                            options:</Typography>
                                                        <IconButton onClick={() => onAddOption(q.id)} color={"success"}
                                                                    sx={{fontSize: theme.typography.h6.fontSize}}>
                                                            <AddCircleOutline fontSize="inherit"/>
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                {
                                                    Object.keys(q.options).map((oid, index) => {
                                                        const o = q.options[oid]
                                                        if (!o) {
                                                            return null
                                                        }
                                                        return (
                                                            <Box key={oid}
                                                                 sx={{display: "flex", flexDirection: "row", my: 1}}>
                                                                <TextField
                                                                    onChange={(event) => onOptionTextChange(event, q.id, o.id)}
                                                                    label={`Option #${index + 1}`}
                                                                    sx={{width: 720, mx: 1}}
                                                                    variant="standard"
                                                                    placeholder={"Enter answer option..."}
                                                                    defaultValue={(o.text) || ""}
                                                                />
                                                                <FormControlLabel sx={{mx: 1}}
                                                                                  control={<Checkbox
                                                                                      onChange={() => onOptionCorrectChange(q.id, o.id)}
                                                                                      checked={o.right}
                                                                                  />}
                                                                                  label={"Correct"}/>
                                                                <IconButton onClick={() => onDeleteOption(q.id, o.id)}
                                                                            sx={{marginLeft: 2}}
                                                                            color={"error"}>
                                                                    <DeleteOutlined/>
                                                                </IconButton>
                                                            </Box>
                                                        )
                                                    })
                                                }
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                })
                            }
                        </Box>
                    </Box>
                    : <LinearProgress/>
            }
        </>
    )
}