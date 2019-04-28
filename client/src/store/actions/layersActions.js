import axios from 'axios';

//Setting current and previous value for timeline
export const setTimelineValues = (floodIndex) => {
    return {
        type: 'SET_TIMELINE_VALUES',
        newValueTimeline: floodIndex
    }
}

//Setting new color to state of chosen layer.
export const changeLayerColor = (layerName, color) => {
    return {
        type: 'SET_LAYER_COLOR',
        layer_name: layerName,
        color
    }
}

//Setting new alpha to state of chosen layer.
export const changeLayerAlpha = (layerName, color) => {
    return {
        type: 'SET_LAYER_ALPHA',
        layer_name: layerName,
        color
    }
}

//Setting visibility on layer by it's checkbox
export const checkLayerCheckbox = (value, checked) => {
    return {
        type: 'CHECK_LAYER_CHECKBOX',
        target_value: value,
        target_checked: checked
    }
}

//Changing visibility state of flood marks point-layer
export const checkFloodMarksCheckbox = () => {
    return {
        type: 'CHECK_FLOODMARKS_CHECKBOX'
    }
}

//Making timeline visible if it will be chosen from select list.
export const changeTimelineVisibility = (value) => {
    if(value==='Linia czasu') {
        return {
            type: 'TIMELINE_VISIBILE'
        }
    } else {
        return {
            type: 'TIMELINE_INVISIBILE'
        }
    }
}

//Sending request for getting data from Geopackage data base (from php server)
export const getLayersFromBase = () => {
    return async (dispatch, getState) => {
        await axios.get(`http://localhost/water-server/GetLayers.php`)
        .then((response) => {
            const layers = response.data
            dispatch({ 
                type: 'GET_LAYERS_SUCCESS',
                layers });
            })
        .catch(err => {
            dispatch({ 
                type: 'GET_LAYERS_ERROR' }, 
                err);
            });
    }
};

export const setLayersBaseProps = () => {
    return {type: 'SET_BASE_PROPS'}
}
