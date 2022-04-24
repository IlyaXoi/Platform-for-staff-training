import React from 'react';

// @ts-ignore
import {Amplify, CognitoUserAmplify} from 'aws-amplify'
import {withAuthenticator} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

import ApplicationBar from "./components/navigation/ApplicationBar";
import PersistentApplicationDrawerLeftView from "./components/drawer/ApplicationDrawer";
import {Box, CssBaseline, Toolbar} from "@mui/material";
import {useAppSelector} from "./storage/hooks";
import {MainView} from "./components/view/MainView";

Amplify.configure(awsExports);

function App({user, signOut}: {
                 signOut: (data?: Record<string | number | symbol, any>) => void,
                 user: CognitoUserAmplify
             }
) {
    const drawerOpen = useAppSelector(state => state.ui.isDrawerOpen)

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <ApplicationBar
                drawerOpen={drawerOpen}
                settings={[{name: "Logout", onClick: signOut}]}
            />
            <PersistentApplicationDrawerLeftView user={user}/>
            <Box component="main" sx={{flexGrow: 1, p: 4}}>
                <Toolbar/>
                <div>
                    <Box sx={{width: "100%"}}>
                        <MainView user={user}/>
                    </Box>
                </div>
            </Box>
        </Box>
    );
}

export default withAuthenticator(App);
