import React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {ButtonOutlined} from "./ButtonOutlined";

interface ModelMessageProps {
    open: boolean,
    title: string,
    text: string | JSX.Element,
    onClose: () => void
    closeButtonText?: string,
    additionalActions?: {
        enabled?: boolean,
        text: string,
        action: () => void
    }[]
}

export const TextDialog: React.FC<ModelMessageProps> = ({
                                                            open,
                                                            title,
                                                            text,
                                                            onClose,
                                                            closeButtonText,
                                                            additionalActions
                                                        }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="dialog-title">{title}</DialogTitle>
            <DialogContent>
                {text}
            </DialogContent>
            <DialogActions>
                {
                    additionalActions ? additionalActions.map((action, index) => {
                            return <ButtonOutlined key={index} disabled={!action.enabled} text={action.text}
                                                   onClick={action.action}/>
                        })
                        : ""
                }
                <ButtonOutlined text={closeButtonText || "Close"} onClick={onClose}/>
            </DialogActions>
        </Dialog>
    )
}