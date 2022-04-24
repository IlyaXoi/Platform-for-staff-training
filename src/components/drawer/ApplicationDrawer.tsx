import React, {useEffect} from "react";
import DrawerHeader from "./DrawerHeader";
import Drawer from "./Drawer";
import {Box, IconButton, LinearProgress, Toolbar, Typography, useTheme} from "@mui/material";
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {useAppDispatch, useAppSelector} from "../../storage/hooks";
import {isAdmin, UserAwareProps} from "../../auth/AuthUtils";
import {deleteResource, getResources} from "../../storage/content/resources/ResourcesThunk";
import {ResourceType} from "../../storage/content/resources/Model";
import {setIsDrawerOpen} from "../../storage/ui/UserInterfaceSlice";
import {AddCircleOutline, RemoveCircleOutlined} from "@mui/icons-material";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useConfirm} from "material-ui-confirm";

interface PersistentApplicationDrawerLeftProps extends UserAwareProps {
}

const PersistentApplicationDrawerLeftView: React.FC<PersistentApplicationDrawerLeftProps> = ({user}) => {

    const userId = user.username
    const location = useLocation()
    
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const theme = useTheme()
    const confirm = useConfirm()

    const drawerOpen = useAppSelector(state => state.ui.isDrawerOpen)

    const handleDrawerOpen = () => {
        dispatch(setIsDrawerOpen(true))
    }
    const handleDrawerClose = () => {
        dispatch(setIsDrawerOpen(false))
    }

    useEffect(() => {
        dispatch(getResources({user}))
    }, [dispatch, userId])

    const data = useAppSelector(state => state.resources.data)

    const onTreeItemClicked = (id: string, type: ResourceType) => {
        navigate(`/${type}/${id}`)
    }

    const onCreate = (event: React.SyntheticEvent, type: ResourceType) => {
        event.stopPropagation()
    }

    const onDelete = (event: React.SyntheticEvent, resourceId: string, name: string) => {
        event.stopPropagation()
        confirm({
            cancellationButtonProps: {
                autoFocus: true,
                variant: "outlined"
            },
            confirmationButtonProps: {
                variant: "outlined",
                color: "error"
            },
            description: `Are you sure you want to delete resource '${name}'`,
            confirmationText: "Delete"
        })
            .then(() => {
                const currentPath = location.pathname
                if (currentPath) {
                    const idStartIndex = currentPath.lastIndexOf("/")
                    const currentResourceId = currentPath.substring(idStartIndex + 1)
                    console.log(currentResourceId)
                    if (resourceId === currentResourceId) {
                        navigate("/")
                    }
                }
                dispatch(deleteResource({id: resourceId, user}))
                dispatch(getResources({user}))
            })
            .catch(() => {
            })
    }

    const labelWithAddIcon = (type: ResourceType) => {
        return (
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Typography>{typeToLabel(type)}</Typography>
                {
                    isAdmin(user) ?
                        <IconButton
                            href={`/${type}/create`}
                            target={"_blank"}
                            onClick={(event: React.SyntheticEvent) => onCreate(event, type)}
                            size={"small"}
                            sx={{fontSize: theme.typography.fontSize}}
                        >
                            <AddCircleOutline fontSize={"inherit"}/>
                        </IconButton> : ""
                }
            </Box>
        )
    }

    const labelWithDeleteIcon = (id: string, name: string) => {
        return (
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Typography>{name}</Typography>
                {
                    isAdmin(user) ? (
                        <>
                            <IconButton
                                onClick={(event: React.SyntheticEvent) => onDelete(event, id, name)}
                                size={"small"}
                                sx={{fontSize: theme.typography.fontSize}}
                            >
                                <RemoveCircleOutlined fontSize={"inherit"}/>
                            </IconButton>
                        </>
                    ) : ""
                }
            </Box>
        )
    }

    return (
        <Drawer variant="permanent" open={drawerOpen}>
            <Toolbar/>
            <DrawerHeader opened={drawerOpen} openHandler={handleDrawerOpen}
                          closeHandler={handleDrawerClose}/>
            <TreeView
                defaultExpanded={["1"]}
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
                sx={{height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto', display: drawerOpen ? '' : 'none'}}
            >
                <TreeItem nodeId="1" label="Resources">
                    {
                        data ?
                            Object.keys(data).map(company => {
                                return (
                                    <TreeItem key={company} nodeId={company} label={company}>
                                        {
                                            Object.keys(data[company]).map(type => {
                                                return (
                                                    <TreeItem key={type} nodeId={type}
                                                              label={labelWithAddIcon(type as ResourceType)}>
                                                        {
                                                            data[company][type].map(resource => {
                                                                return (
                                                                    <TreeItem
                                                                        key={resource.id}
                                                                        nodeId={resource.id}
                                                                        label={labelWithDeleteIcon(resource.id, resource.name)}
                                                                        onClick={() => onTreeItemClicked(resource.id, type as ResourceType)}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </TreeItem>
                                                )
                                            })
                                        }
                                    </TreeItem>
                                )
                            })
                            : <LinearProgress/>
                    }
                </TreeItem>
            </TreeView>
        </Drawer>
    )
}

const typeToLabel = (type: ResourceType) => {
    switch (type) {
        case "page":
            return "Pages"
        case "task":
            return "Tasks"
        case "video":
            return "Videos"
        case "quiz":
            return "Quizzes"
        case "test":
            return "Tests"
    }
}

export default PersistentApplicationDrawerLeftView