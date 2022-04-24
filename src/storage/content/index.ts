export const API_HOST = "https://usvl68lgil.execute-api.eu-west-1.amazonaws.com"
export const asError = (error: any) => {
    console.log(error)
    return {
        error: error.message
    }
}

export interface ValidationAwareState {
    validation?: ValidationErrors
}

export interface ValidationErrors {
    [type: string]: {
        error: string
    }
}
