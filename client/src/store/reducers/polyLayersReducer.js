import update from 'immutability-helper';

//Returning base props for vector layers (color, visibility(checkbox: false))
const getLayersProperties = (layers) => {
    const baseColor = {r: 50, g: 50, b: 255, a: 1}
    
    //checking if layers exists
    if (!layers || !layers.length) {
    return {};
    }

    //empty new state
    const layerProps = {}
    
    //filling newState
    layers.forEach((layer) => {
        layerProps.colors = {
            ...layerProps.colors,
            [layer.properties.year]: baseColor
        }
        layerProps.checkboxes = {
            ...layerProps.checkboxes,
            [layer.properties.year]: false
        }
    })

    //add flood_marks checkbox
    layerProps.checkboxes.flood_marks_check = false;

    return layerProps
}

const polyLayersReducer = (state = {}, action) => {
    switch (action.type) {
        case 'GET_POLYGON_LAYERS_SUCCESS':
            console.log('Downloading polygon layers from the database successfully completed.')
            return {
                ...state,
                layers: action.layers
            }
        case 'SET_LAYER_COLOR': 
            const newColor = update(state.colors, {
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
            const newAlpha = update(state.colors, {
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
        case 'SET_BASE_PROPS':
            return {
                ...state,
                ...getLayersProperties(state.layers)
            }
        default: 
            if(action.err) console.log(action.err);
            return {
                ...state
            } 
    }
}

export default polyLayersReducer