import polyLayersReducer from './polyLayersReducer'
import floodMarksReducer from './floodMarksReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    // FIXME: rediusery przypisz do zmiennej bez słowa reducers bo to jest puźniej mylące 
    //          reducer jest funkcja a nie danymi
    polyLayersReducer,
    floodMarksReducer
});

export default rootReducer