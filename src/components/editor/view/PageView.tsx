import {isAdmin, UserAwareProps} from "../../../auth/AuthUtils";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../storage/hooks";
import {getPageById} from "../../../storage/content/page/PageThunk";
import {Box, Divider, LinearProgress, Typography} from "@mui/material";
import {notFound} from "../../view/MainView";
import PlateEditor from "../PlateEditor";
import {ButtonOutlined} from "../../common/ButtonOutlined";
import {useNavigate} from "react-router-dom";

interface PageViewProps extends UserAwareProps {
    id: string
    type: string
}

export const PageView: React.FC<PageViewProps> = ({id, type, user}) => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getPageById({id, user}))
    }, [dispatch, id])

    const status = useAppSelector(state => state.page.status)
    const data = useAppSelector(state => state.page.page)

    const onEdit = () => {
        if (data && status === "data-loaded") {
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
        data && status === "data-loaded" ?
            <>
                <Typography variant="h4">{data.name}</Typography>
                {
                    isAdmin(user) ?
                        <Box sx={{display: 'flex', mx: 2}}>
                            <ButtonOutlined text={"Edit"} onClick={onEdit}/>
                        </Box>
                        : ""
                }
                <Divider/>
                <PlateEditor
                    id={data.id}
                    readOnly={true}
                    initialData={data.data}
                    onChange={() => {
                    }}
                />
            </>
            : <LinearProgress/>
    )

}