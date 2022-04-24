// @ts-ignore
import {CognitoUserAmplify} from "aws-amplify";

export const getUserCompanies = (user: CognitoUserAmplify): string[] => {
    const userGroups = getUserGroups(user)
    return userGroups.filter(group => group !== "User" && group !== "Admin")
}

export const getUserGroups = (user: CognitoUserAmplify): string[] => {
    const tokenPayload = user.getSignInUserSession()?.getIdToken()?.payload
    if (tokenPayload) {
        return tokenPayload["cognito:groups"] as string[]
    }
    return []
}

export const isAdmin = (user: CognitoUserAmplify): boolean => {
    const userGroups = getUserGroups(user)
    return userGroups.includes("Admin")
}

export interface UserAwareProps {
    user: CognitoUserAmplify
}