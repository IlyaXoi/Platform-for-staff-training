import React from "react";
import {useParams} from "react-router-dom";
import {UserAwareProps} from "../../auth/AuthUtils";
import {QuizView} from "../quiz/QuizView";
import {EditorType} from "../../storage/content/page/Model";
import {notFound} from "./MainView";
import {PageView} from "../editor/view/PageView";

export const ResourceView: React.FC<UserAwareProps> = ({user}) => {
    const {type, id} = useParams()

    if (!type || !id) {
        return notFound()
    }

    switch (type) {
        case "quiz":
        case "test":
            return <QuizView id={id} type={type} user={user}/>
        case "page":
        case "task":
        case "video":
            return <PageView id={id} type={type as EditorType} user={user}/>
        default:
            return notFound()
    }
}