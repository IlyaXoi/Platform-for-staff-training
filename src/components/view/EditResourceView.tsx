import React from "react";
import {UserAwareProps} from "../../auth/AuthUtils";
import {useParams} from "react-router-dom";
import {ResourceType} from "../../storage/content/resources/Model";
import {EditQuizView} from "../quiz/EditQuizView";
import {notFound} from "./MainView";
import {EditPageView} from "../editor/view/EditPageView";


export const EditResourceView: React.FC<UserAwareProps> = ({user}) => {

    const {id, type} = useParams()

    if (!id || !type) {
        return notFound()
    }

    switch (type as ResourceType) {
        case "test":
        case "quiz":
            return <EditQuizView id={id} type={type} user={user}/>
        case "video":
        case "task":
        case "page":
            return <EditPageView id={id} type={type} user={user}/>
        default:
            return notFound()
    }
}