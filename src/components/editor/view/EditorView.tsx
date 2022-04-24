//@ts-ignore
import {CognitoUserAmplify} from "aws-amplify";
import React, {useEffect} from "react";
import {TNode} from "@udecode/plate";
import {Box, Divider, LinearProgress, TextField, Typography} from "@mui/material";
import PlateEditor from "../PlateEditor";
import {useAppDispatch, useAppSelector} from "../../../storage/hooks";
import {isAdmin, UserAwareProps} from "../../../auth/AuthUtils";
import {helperText, isCreating, isPageLoading, isNotSelected, isSelected} from "./EditorViewUtils";
import {EditorType, Page, PageStatus} from "../../../storage/content/page/Model";
import {
    create,
    deleteValidationError,
    setData,
    setIsEditable,
    setName,
    setValidationError
} from "../../../storage/content/page/PageSlice";
import {getPageById, savePage} from "../../../storage/content/page/PageThunk";
import {ButtonOutlined} from "../../common/ButtonOutlined";
import {notFound} from "../../view/MainView";
import {useNavigate} from "react-router-dom";

interface EditorViewProps extends UserAwareProps {
    id: string,
    type: EditorType,
    createNew?: boolean
}

export const EditorView: React.FC<EditorViewProps> = ({id, type, user, createNew}) => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (createNew) {
            dispatch(create({id, type}))
        } else {
            dispatch(getPageById({id, user}))
        }
    }, [dispatch, id, type, createNew])

    const status = useAppSelector(state => state.page.status)
    const isEditable = useAppSelector(state => state.page.isEditable)
    const currentPage = useAppSelector(state => state.page.page)
    const editingPage = useAppSelector(state => state.page.editingPage)
    const validationErrors = useAppSelector(state => state.page.validation)
    const onEditorDataChange = (content: TNode[]) => {
        dispatch(setData(content))
    }
    const onEdit = () => {
        dispatch(setIsEditable(true))
    }
    const onSave = () => {
        if (!currentPage?.name) {
            dispatch(setValidationError({
                "page-name": {
                    error: "Page name is required"
                }
            }))
            return
        }
        dispatch(savePage({data: editingPage!!, user}))
        if (createNew) {
            navigate(`/${type}/${id}`)
        }
    }
    const onDiscardChanges = () => {
        dispatch(setIsEditable(false))
    }

    if (status === "failed") {
        return notFound()
    }

    return (
        <>
            {
                isCreating(status) || isEditable ?
                    <TextField
                        fullWidth
                        required
                        variant="standard"
                        id="page-name"
                        label="Page name"
                        placeholder="Enter page name here"
                        helperText={helperText("page-name", validationErrors)}
                        error={validationErrors && !!validationErrors["page-name"]}
                        defaultValue={currentPage?.name || ""}
                        onChange={(event) => {
                            const value = event.target.value
                            if (value) {
                                dispatch(setName(value));
                                if (validationErrors && validationErrors["page-name"]) {
                                    dispatch(deleteValidationError("page-name"))
                                }
                            }
                        }}
                    /> :
                    <Typography
                        variant={isPageLoading(status) ? "h6" : "h4"}
                        sx={{opacity: isPageLoading(status) ? 0.5 : 1}}>
                        {
                            isPageLoading(status) ? "Loading your page, please wait..." :
                                isSelected(status) ? currentPage?.name :
                                    isNotSelected(status) ? "You can select page from the list on the left!" :
                                        ""
                        }
                    </Typography>
            }
            <Box sx={{display: 'flex', mx: 2}}>
                {loadEditButton(status, isEditable, user, onEdit)}
                {loadSaveButton(status, isEditable, user, onSave)}
                {loadDiscardButton(status, isEditable, user, onDiscardChanges)}
            </Box>
            <Divider/>
            {loadEditor(status, isEditable, currentPage, onEditorDataChange)}
        </>
    )

}

const loadEditor = (status: PageStatus, isEditable: boolean, currentPage: Page | undefined, onEditorDataChange: (content: TNode[]) => void) => {
    if ((isSelected(status) || isCreating(status)) &&
        currentPage &&
        currentPage.data &&
        currentPage.data.length !== 0
    ) {
        return (
            <PlateEditor
                id={currentPage.id}
                readOnly={(!isEditable)}
                initialData={currentPage.data}
                onChange={onEditorDataChange}/>
        )
    }

    if (isPageLoading(status)) {
        return <LinearProgress/>
    }

    return ""
}

const loadSaveButton = (status: PageStatus, isEditable: boolean, user: CognitoUserAmplify, onClick: () => void) => {
    if (isAdmin(user) && (isSelected(status) || isCreating(status))) {
        return <ButtonOutlined disabled={!isEditable} text={"Save"} onClick={() => onClick()}/>
    }
    return ""
}

const loadEditButton = (status: PageStatus, isEditable: boolean, user: CognitoUserAmplify, onClick: () => void) => {
    if (isAdmin(user) && isSelected(status)) {
        return <ButtonOutlined disabled={isEditable} text={"Edit"} onClick={() => onClick()}/>
    }
    return ""
}

const loadDiscardButton = (status: PageStatus, isEditable: boolean, user: CognitoUserAmplify, onClick: () => void) => {
    if (isAdmin(user) && isEditable && isSelected(status)) {
        return <ButtonOutlined text={"Discard"} onClick={() => onClick()}/>
    }
}