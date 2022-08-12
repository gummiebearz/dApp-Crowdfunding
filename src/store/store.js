import { configureStore, combineReducers } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import accountReducer from './slices/accountSlice'

const reducers = combineReducers({
    account: accountReducer,
})

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), thunk]
})

export default store