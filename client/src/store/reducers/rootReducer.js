import polyLayersReducer from './polyLayersReducer'
import floodMarksReducer from './floodMarksReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    polyLayersReducer,
    floodMarksReducer
});

export default rootReducer