import axios from 'axios';

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

//Sending request for getting polygon layers from Geopackage data base (from php server)
// FIXME: to w ogule działa??????
// FIXME: tutaj musze się skonsultowa bo nie wiem czy to jest poprawnie napisano bo wydaje mi się że jest to trochę bez sensu ale dam ci znać
export const getPolygonLayersFromBase = () => {
    return async (dispatch) => {
        await axios.get(`http://localhost/water-server/GetPolygonLayers.php`)
        .then((response) => {
            const layers = response.data
            dispatch({ 
                type: 'GET_POLYGON_LAYERS_SUCCESS',
                layers });
            })
        .catch(err => {
            dispatch({ 
                type: 'GET_POLYGON_LAYERS_ERROR' }, 
                err);
            });
    }
};

export const setLayersBaseProps = () => {
    return {type: 'SET_BASE_PROPS'}
}
