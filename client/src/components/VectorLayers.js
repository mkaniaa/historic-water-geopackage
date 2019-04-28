import React, { Component } from 'react'
import PolygonLayer from './PolygonLayer'
import PointLayer from './PointLayer'
import { connect } from 'react-redux'
import { Card, CardText } from 'reactstrap';
import { getLayersFromBase, setLayersBaseProps } from '../store/actions/layersActions'

class VectorLayers extends Component {

    //Sending request for getting data from Geopackage data base (from php server)
    async componentDidMount() {
       await this.props.getLayersFromBase();
    }

    //setting base props for layers and flood_dates if they're null
    componentDidUpdate() {  
        if(this.props.layers && this.props.checkboxes === null) {
            this.props.setLayersBaseProps();
        }
    }
    
    //converting object RGBA to string code RGBA ({r: 5, g: 5, b: 5, a: 1} => rgba(5,5,5,1))
    readRGBA = (objectRGBA) => {
        var arrayRGBA = Object.values(objectRGBA);
        return 'rgba(' + arrayRGBA.join(', ') + ')';
    }

    render() {

        const { layers, colors, checkboxes, checkFloodMarks } = this.props;

        //Rendering only when layers from database are downloaded and ready.
        if (checkboxes == null) {
            return (
                <Card className = "loading-layers">
                    <CardText>
                        Loading layers from database...
                    </CardText>                
                </Card>
            )
        } else {
            return (
                <div>
                {
                    //adding polygon-layers to map
                    layers.map((layer) => (
                        checkboxes[layer.properties.year] && (
                            <PolygonLayer
                                key={ layer.properties.year }
                                layer={ layer }
                                color={ this.readRGBA(colors[layer.properties.year]) }
                            />
                            )
                    ))
                }
                { //show point-layer flood dates only if it's checked
                    checkFloodMarks && ( <PointLayer /> )
                }
                </div>
            )
        }
    }
}

//Connecting with redux state
const mapStateToProps = (state) => {
    return {
        layers: state.layers,
        colors: state.colors,
        checkboxes: state.checkboxes,
        checkFloodMarks: state.flood_marks_checked
    }
}

//Connecting with redux actions(functions)
const mapDispatchToProps = (dispatch) => {
    return {
        getLayersFromBase: () => dispatch(getLayersFromBase()),
        setLayersBaseProps: () => dispatch(setLayersBaseProps())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(VectorLayers)