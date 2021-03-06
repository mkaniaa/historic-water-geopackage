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
export const getPolygonLayersFromBase = async (dispatch) => {
    await axios.get(`https://mkania.sub.com.pl/app/getArrayOfPolygonLayers.php`)
    .then((response) => {
        const layers = response.data
        dispatch({ 
            type: 'GET_POLYGON_LAYERS_SUCCESS',
            layers });
        })
    .catch(err => {
        dispatch({
            type: 'GET_POLYGON_LAYERS_ERROR',
            error: err });
        });
};

export const setLayersBaseProps = () => {
    return {type: 'SET_BASE_PROPS'}
}
