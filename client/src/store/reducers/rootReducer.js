import polyLayersReducer from './polyLayersReducer'
import floodMarksReducer from './floodMarksReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    polyLayers: polyLayersReducer,
    floodMarks: floodMarksReducer
});

export default rootReducer