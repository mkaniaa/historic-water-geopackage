import update from 'immutability-helper';

// FIXME: czy napewno jesteś pewien że ci są potrzebne zmienne null. Zamiast Null stosuj undefined
//        dokładnie tosamo załatwi ci sprawę `initialState = {}`
//        jak dlamnie w ogule jest nie potrzebne zmienna initialState
const initState = {
    layers: null,
    colors: null,
    checkboxes: null
}

//Returning base props for vector layers (color, visibility(checkbox: false))
// FIXME arrow function
function getLayersProperties(layers) {
    const baseColor = {r: 50, g: 50, b: 255, a: 1}
    
    // FIXME: zamiast var używaj constów lub letów
    // FIXME: zedne zagnieżdzenie zmiennych nigdzie się nie odwołujesz bezpośrenio do `layerProps` tylko poprzez `stateProps` a na końcu zwracasz i tak `stateProps.
    // tu masz kod który robi dokładnie to samo
    // if (!layers || !layers.length) {
    //    return {};
    // }
    // const stateProps = { };
    
    // layers.forEach((layer) => {
    //     stateProps.colors = {
    //         [layer.properties.year]: baseColor
    //     }
    //     stateProps.checkboxes = {
    //         [layer.properties.year]: false
    //     }
    // })
    
    // stateProps.checkboxes.flood_marks_check = false;
    
    // return stateProps
    
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

    //add flood_marks checkbox
    layerProps.stateProps.checkboxes = {
        ...layerProps.stateProps.checkboxes,
        flood_marks_check: false
    }

    return layerProps.stateProps
}

// FIXME:  
const polyLayersReducer = (state = initState, action) => {
    switch (action.type) {
        case 'GET_POLYGON_LAYERS_SUCCESS':
            console.log('Downloading polygon layers from the database successfully completed.')
            return {
                ...state,
                layers: action.layers
            }
        // FIXME: case zbędny zrobiony tylko dla consol log to samo załatwia default
        case 'GET_POLYGON_LAYERS_ERROR':
            console.log('Downloading polygon layers from the database completed with an error: \n' + action.err)
            return {
                ...state
            }
        case 'SET_LAYER_COLOR': 
            // FIXME: zamiast var używaj constów lub letów w zależność od potrzeb
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
        case 'SET_BASE_PROPS': 
        // FIXME: zgonie z moją zaproponowaną implementacją funkcji `getLayersProperties` kóra zawsze zwraca obiekt 
        //          na ten case wystarczy tylko tyle kodu
                // return {
                    // ...state,
                    // ...getLayersProperties(state.layers)
                // }

            if(state.layers){
                var newState = getLayersProperties(state.layers)
                return {
                    ...state,
                    colors: newState.colors,
                    checkboxes: newState.checkboxes
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

export default polyLayersReducer