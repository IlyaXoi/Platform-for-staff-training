import React, {ReactElement} from "react";
import {isAdmin, UserAwareProps} from "../../auth/AuthUtils";
import {notFound} from "./MainView";

interface AdminRouteProps extends UserAwareProps {
    children: ReactElement<any, any> | null
}

export const AdminRoute: React.FC<AdminRouteProps> = ({user, children}) => {

    if (isAdmin(user)) {
        return children
    }

    return notFound()
}