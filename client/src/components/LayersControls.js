import React, { Component } from 'react';
import Checkbox from './Checkbox'
import {HuePicker, AlphaPicker} from 'react-color'
import { Input } from 'reactstrap';
import { connect } from 'react-redux';
import { changeTimelineVisibility } from '../store/actions/floodMarksActions'
import { checkLayerCheckbox, changeLayerColor, changeLayerAlpha } from '../store/actions/polyLayersActions'

class LayersControls extends Component {

    handleLayerCheckboxChange = (event) => {
        this.props.checkLayerCheckbox(event.target.value, event.target.checked);
    }

    handleSelectInputChange = (event) => {
        this.props.changeTimelineVisibility(event.target.value);
    }

    handleChangeHuePicker = (layerName) => {
        return (color) => {
            this.props.changeLayerColor(layerName, color);
        }
    }

    handleChangeAlphaPicker = (layerName) => {
        return (color) => {
            this.props.changeLayerAlpha(layerName, color);
        }
    }

    render() {

        const { layers, checkboxes, colors } = this.props;

        return(
            <div className="layers-controls">

                {//Controls for flood marks point-layer
                    <div className='layers-controls'>
                        <Checkbox
                            value={ 'flood_marks_check' }
                            label={ 'Znaki wielkiej wody' }
                            handleChange={ this.handleLayerCheckboxChange }
                            checked={ checkboxes.flood_marks_check }
                            key={ 'flood_marks_checkbox' }
                        />
                        <Input 
                            type="select" 
                            name="selectFloodMarks" 
                            id="selectFloodMarks" 
                            onChange={ this.handleSelectInputChange }
                            disabled={ !checkboxes.flood_marks_check } >
                                <option>Pokaż wszystkie</option>
                                <option>Linia czasu</option>
                        </Input>
                    </div>
                }
                
                {//Controls for all polygon-layers
                    layers.map((layer) => (
                        <div key= {layer.properties.year + '_div'}>
                            <Checkbox
                                value={ layer.properties.year }
                                label={ layer.properties.year }
                                handleChange={ this.handleLayerCheckboxChange }
                                checked={ checkboxes[layer.properties.year] }
                                key={ layer.properties.year + '_checkbox' }
                            />
                            <HuePicker
                                className='layer-changer'
                                key={ layer.year + '_hue' }
                                color={ colors[layer.properties.year]}
                                onChange={ this.handleChangeHuePicker(layer.properties.year) }
                            />
                            <AlphaPicker
                                className='layer-changer'
                                key={ layer.year + '_alpha' }
                                color={ colors[layer.properties.year] }
                                onChange={ this.handleChangeAlphaPicker(layer.properties.year) }
                            />
                            <br key={ layer.properties.year + '_space' }/>
                        </div>
                    ))
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        layers: state.polyLayersReducer.layers,
        colors: state.polyLayersReducer.colors,
        checkboxes: state.polyLayersReducer.checkboxes
    }
}

//Connecting with redux actions(functions)
const mapDispatchToProps = (dispatch) => {
    return {
        changeLayerColor: (layerName, color) => dispatch(changeLayerColor(layerName, color)),
        changeLayerAlpha: (layerName, color) => dispatch(changeLayerAlpha(layerName, color)),
        checkLayerCheckbox: (value, checked) => dispatch(checkLayerCheckbox(value, checked)),
        changeTimelineVisibility: (value) => dispatch(changeTimelineVisibility(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayersControls);
