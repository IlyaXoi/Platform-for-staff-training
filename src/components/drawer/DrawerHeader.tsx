import React from "react";
import {IconButton, styled} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


interface DrawerHeaderProps {
    opened: boolean,
    openHandler: () => void,
    closeHandler: () => void
}

const DrawerHeaderBasic = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const DrawerHeader: React.FC<DrawerHeaderProps> = (props) => {
    if (props.opened) {
        return (
            <DrawerHeaderBasic>
                <IconButton onClick={props.closeHandler}>
                    <ChevronLeftIcon/>
                </IconButton>
            </DrawerHeaderBasic>
        )
    } else {
        return (
            <DrawerHeaderBasic>
                <IconButton onClick={props.openHandler}>
                    <ChevronRightIcon/>
                </IconButton>
            </DrawerHeaderBasic>
        )
    }
}

export default DrawerHeader