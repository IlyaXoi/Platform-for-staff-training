import React from "react";
import {UserAwareProps} from "../../auth/AuthUtils";
import {useParams} from "react-router-dom";
import {notFound} from "./MainView";
import {EditorType} from "../../storage/content/page/Model";
import {EditQuizView} from "../quiz/EditQuizView";
import {EditPageView} from "../editor/view/EditPageView";

export const CreateResourceView: React.FC<UserAwareProps> = ({user}) => {

    const {type} = useParams()

    switch (type) {
        case "quiz":
        case "test":
            return <EditQuizView type={type} user={user}/>
        case "page":
        case "task":
        case "video":
            return <EditPageView type={type as EditorType} user={user}/>
        default:
            return notFound()
    }
}