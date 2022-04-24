// @ts-ignore
import {CognitoUserAmplify} from "aws-amplify";
import {API_HOST} from "../storage/content";
import {Page} from "../storage/content/page/Model";
import {Quiz, QuizModel} from "../storage/content/quiz/Model";
import {ResourceData} from "../storage/content/resources/Model";

export class DataApiService {
    getPage = async (id: string, user: CognitoUserAmplify) => {
        return await this.authorizedCall(`${API_HOST}/data/${id}`, user, {
            credentials: "include"
        }) as Page
    }
    savePage = async (body: Page, user: CognitoUserAmplify) => {
        return await this.authorizedCall(`${API_HOST}/data`, user, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    }
    getQuiz = async (id: string, user: CognitoUserAmplify) => {
        return await this.authorizedCall(`${API_HOST}/data/${id}`, user, {
            credentials: "include"
        }) as Quiz
    }
    getEditableQuiz = async (id: string, user: CognitoUserAmplify) => {
        return await this.authorizedCall(`${API_HOST}/data/${id}`, user, {
            credentials: "include"
        }) as QuizModel
    }
    saveQuiz = async (body: QuizModel, user: CognitoUserAmplify) => {
        return await this.authorizedCall(`${API_HOST}/data`, user, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    }
    saveQuizResult = async (body: Quiz, user: CognitoUserAmplify) => {
        return await this.authorizedCall(`${API_HOST}/data/results`, user, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    }
    getResources = async (user: CognitoUserAmplify) => {
        return await this.authorizedCall(`${API_HOST}/data`, user, {
            credentials: "include"
        }) as ResourceData
    }
    deleteResource = async (id: string, user: CognitoUserAmplify) => {
        return await this.authorizedCall(`${API_HOST}/data/${id}`, user, {
            credentials: "include",
            method: "DELETE"
        })
    }

    private authorizedCall = async (url: string, user: CognitoUserAmplify, params?: RequestInit) => {
        const jwt = this.getToken(user)
        const response = await fetch(url, {
            ...params,
            headers: {
                ...(params?.headers || {}),
                "Authorization": jwt
            }
        })
        return await response.json()
    }

    private getToken = (user: CognitoUserAmplify) => {
        const session = user.getSignInUserSession()
        if (!session) throw new Error("Unauthorized")
        return session.getIdToken().getJwtToken() as string
    }
}