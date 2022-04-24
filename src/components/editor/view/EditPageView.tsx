import {helperText} from "./EditorViewUtils";
import {
    Box,
    Divider,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";
import React, {ChangeEvent, useEffect} from "react";
import {UserAwareProps} from "../../../auth/AuthUtils";
import PlateEditor from "../PlateEditor";
import {EditorType} from "../../../storage/content/page/Model";
import {ButtonOutlined} from "../../common/ButtonOutlined";
import {useAppDispatch, useAppSelector} from "../../../storage/hooks";
import {savePage} from "../../../storage/content/page/PageThunk";
import {
    create,
    deleteValidationError,
    discardChanges,
    getEditablePageById,
    setData,
    setName,
    setType
} from "../../../storage/content/page/EditPageSlice";
import {TNode} from "@udecode/plate";
import {useConfirm} from "material-ui-confirm";
import {useNavigate} from "react-router-dom";


interface EditPageViewProps extends UserAwareProps {
    id?: string
    type: string
}

export const EditPageView: React.FC<EditPageViewProps> = ({id, type, user}) => {

    const confirm = useConfirm()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (status === "fulfilled") {
            if (data) {
                navigate(`/${data.type}/${data.id}`)
            }
        }
    })

    useEffect(() => {
        if (id) {
            dispatch(getEditablePageById({id, user}))
        } else {
            dispatch(create())
        }
    }, [dispatch, id])

    const status = useAppSelector(state => state.editPage.status)
    const data = useAppSelector(state => state.editPage.data)
    const validationErrors = useAppSelector(state => state.editPage.validation)
    const editableDataCopy = useAppSelector(state => state.editPage.editableDataCopy)

    const onSave = () => {
        if (data && editableDataCopy) {
            dispatch(savePage({data: editableDataCopy, user}))
        }
    }

    const onDiscardChanges = () => {
        navigate(-1)
    }

    const onEditorDataChange = (data: TNode[]) => {
        dispatch(setData(data))
    }

    const onNameChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const value = event.target.value
        if (value) {
            dispatch(setName(value));
            if (validationErrors && validationErrors["name"]) {
                dispatch(deleteValidationError("name"))
            }
        }
    }

    const onTypeChange = (event: SelectChangeEvent) => {
        const type = event.target.value as string
        dispatch(setType(type as EditorType))
    }
    return (
        <>
            {
                data && editableDataCopy && status === "data-loaded" ?
                    <>
                        <TextField
                            sx={{width: 360, mx: 1}}
                            required
                            variant="standard"
                            id="page-name"
                            label="Page name"
                            placeholder="Enter page name here"
                            helperText={helperText("name", validationErrors)}
                            error={validationErrors && !!validationErrors["name"]}
                            defaultValue={data?.name || ""}
                            onChange={onNameChange}
                        />
                        <FormControl variant="standard" required>
                            <InputLabel id="type">Type</InputLabel>
                            <Select
                                sx={{width: 74, mx: 1}}
                                id="type"
                                label="Type"
                                placeholder={"Select type"}
                                value={editableDataCopy.type}
                                onChange={onTypeChange}
                            >
                                <MenuItem value={"page"}>Page</MenuItem>
                                <MenuItem value={"video"}>Video</MenuItem>
                                <MenuItem value={"task"}>Task</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{display: 'flex', mx: 2}}>
                            <ButtonOutlined text={"Save"} onClick={onSave}/>
                            <ButtonOutlined text={"Discard"} onClick={onDiscardChanges}/>
                        </Box>
                        <Divider/>
                        <PlateEditor
                            id={data.id}
                            readOnly={false}
                            initialData={data.data}
                            onChange={onEditorDataChange}
                        />
                    </> : <LinearProgress/>
            }
        </>
    )
}