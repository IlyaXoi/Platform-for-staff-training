import React, {MouseEventHandler} from "react";
import {Button, SxProps, Theme} from "@mui/material";

interface ButtonOutlinedProps {
    text: string,
    disabled?: boolean,
    autoFocus?: boolean,
    sx?: SxProps<Theme>,
    onClick: MouseEventHandler<HTMLButtonElement>
}

export const ButtonOutlined: React.FC<ButtonOutlinedProps> = ({text, disabled, autoFocus, onClick, sx}) => {
    return (
        <Button
            autoFocus={autoFocus}
            variant="outlined"
            sx={sx || {my: 2, mx: 1, color: 'blue', display: 'block'}}
            disabled={disabled}
            onClick={onClick}
        >
            {text}
        </Button>
    )
}