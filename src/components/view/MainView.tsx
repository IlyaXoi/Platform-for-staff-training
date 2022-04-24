import {Route, Routes} from "react-router-dom";
import React from "react";
import {UserAwareProps} from "../../auth/AuthUtils";
import {ResourceView} from "./ResourceView";
import {Box, Typography} from "@mui/material";
import {CreateResourceView} from "./CreateResourceView";
import {EditResourceView} from "./EditResourceView";
import {AdminRoute} from "./AdminRoute";

export const MainView: React.FC<UserAwareProps> = ({user}) => {

    return (
        <Routes>
            <Route path="/" element={<p>Index page is not yet implemented(</p>}/>
            <Route path="/:type/create" element={
                <AdminRoute user={user}>
                    <CreateResourceView user={user}/>
                </AdminRoute>
            }/>
            <Route path="/:type/:id/edit" element={
                <AdminRoute user={user}>
                    <EditResourceView user={user}/>
                </AdminRoute>
            }/>
            <Route path="/:type/:id" element={<ResourceView user={user}/>}/>
            <Route path="*" element={notFound()}/>
        </Routes>
    )

}


export const notFound = () => {
    return (
        <Box>
            <Typography variant="h2">Whoops, we didn't find anything :(</Typography>
        </Box>
    )
}