import update from 'immutability-helper';
import SortedSet from 'collections/sorted-set';

const initState = {
    layers: null,
    colors: null,
    checkboxes: null,
    dropdownOpen: false,
    flood_marks_checked: false,
    timelineVisible: false,
    flood_marks: null,
    valueTimeline: 0,
    previousValueTimeline: 0,
    floods_dates: [],
    flood_date: '1593-07-03'
}

//returning sorted set of floods dates
function getArrayOfFloodDates (unsortedSet) {
    var datesSet = new SortedSet();
    const datesArray = [];
    unsortedSet.forEach(function(nextDate) {
        datesSet.add(nextDate.properties.flood_date);
    });
    datesSet.forEach(function(date) {
        datesArray.push(date);
    })
    return datesArray;
}

//Returning base props for vector layers (color, visibility(checkbox: false))
function getLayersProperties(layers) {
    const baseColor = {r: 50, g: 50, b: 255, a: 1}
    
    //empty newState
    var layerProps = {
        stateProps: {
            colors: null,
            checkboxes: null
        }
    }
    
    //filling newState
    layers.forEach((layer) => {
        layerProps.stateProps.colors = {
            ...layerProps.stateProps.colors,
            [layer.properties.year]: baseColor
        }
        layerProps.stateProps.checkboxes = {
            ...layerProps.stateProps.checkboxes,
            [layer.properties.year]: false
        }
    })
    return layerProps.stateProps
}

const rootReducer = (state = initState, action) => {
    switch (action.type) {
        case 'SET_TIMELINE_VALUES': 
            return {
                ...state,
                valueTimeline: action.newValueTimeline, 
                previousValueTimeline: state.valueTimeline,
                flood_date: state.floods_dates[action.newValueTimeline]
            }
        case 'SET_LAYER_COLOR': 
            var newColor = update(state.colors, {
                [action.layer_name]: {
                        r: {$set: action.color.rgb.r},
                        g: {$set: action.color.rgb.g},
                        b: {$set: action.color.rgb.b},
                    }
            })
            return {
                ...state,
                colors: newColor
            }
        case 'SET_LAYER_ALPHA':
            var newAlpha = update(state.colors, {
                [action.layer_name]: {
                    a: {$set: action.color.rgb.a}
                }
            })
            return {
                ...state,
                colors: newAlpha
            }
        case 'CHECK_LAYER_CHECKBOX':
            return {
                ...state,
                checkboxes: {
                    ...state.checkboxes,
                    [action.target_value]: action.target_checked
                }
            }
        case 'CHECK_FLOODMARKS_CHECKBOX':
            return {
                ...state,
                flood_marks_checked: !state.flood_marks_checked
            }
        case 'TIMELINE_VISIBILE':
            return {
                ...state,
                timelineVisible: true
            }
        case 'TIMELINE_INVISIBILE':
            return {
                ...state,
                timelineVisible: false
            }
        case 'GET_POLYGON_LAYERS_SUCCESS':
            console.log('Downloading polygon layers from the database successfully completed.')
            return {
                ...state,
                layers: action.layers
            }
        case 'GET_POLYGON_LAYERS_ERROR':
            console.log('Downloading polygon layers from the database completed with an error: \n' + action.err)
            return {
                ...state
            }
        case 'GET_FLOOD_MARKS_SUCCESS':
            console.log('Downloading flood marks from the database successfully completed.')
            return {
                ...state,
                flood_marks: action.flood_marks
            }
        case 'GET_FLOOD_MARKS_ERROR':
            console.log('Downloading flood marks from the database completed with an error: \n' + action.err)
            return {
                ...state
            }
        case 'SET_BASE_PROPS':
            if(state.layers){
                var newState = getLayersProperties(state.layers)
                return {
                    ...state,
                    colors: newState.colors,
                    checkboxes: newState.checkboxes,
                    floods_dates: getArrayOfFloodDates(state.flood_marks)
                }
            } else {
                return {
                    ...state
                }
            }
        default: 
            return {
                ...state
            } 
    }
}

export default rootReducer