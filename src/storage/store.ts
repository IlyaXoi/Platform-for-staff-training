import {configureStore} from '@reduxjs/toolkit'
import pageReducer from './content/page/PageSlice'
import resourcesReducer from './content/resources/ResourcesSlice'
import quizReducer from './content/quiz/QuizSlice'
import uiReducer from './ui/UserInterfaceSlice'
import quizCreationReducer from './content/quiz/EditQuizSlice'
import editPageReducer from './content/page/EditPageSlice'

export const store = configureStore({
    reducer: {
        page: pageReducer,
        quiz: quizReducer,
        resources: resourcesReducer,
        ui: uiReducer,
        quizCreation: quizCreationReducer,
        editPage: editPageReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch