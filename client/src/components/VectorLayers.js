import React, { Component } from 'react'
import PolygonLayer from './PolygonLayer'
import PointLayer from './PointLayer'
import { connect } from 'react-redux'
import { Card, CardText } from 'reactstrap';
import { getFloodMarksFromBase, setFloodDates } from '../store/actions/floodMarksActions'
import { getPolygonLayersFromBase, setLayersBaseProps } from '../store/actions/polyLayersActions'

class VectorLayers extends Component {

    //Sending request for getting data from Geopackage data base (from php server)
    componentDidMount() {
        this.props.getPolygonLayersFromBase();
        this.props.getFloodMarksFromBase();
    }

    //setting base props for layers and flood_dates if they're null
    componentDidUpdate() {  
        if(this.props.layers && !this.props.checkboxes) {
            this.props.setLayersBaseProps();
            this.props.setFloodDates();
        }
    }
    
    //converting object RGBA to string code RGBA ({r: 5, g: 5, b: 5, a: 1} => rgba(5,5,5,1))
    readRGBA = (objectRGBA) => {
        const arrayRGBA = Object.values(objectRGBA);
        return 'rgba(' + arrayRGBA.join(', ') + ')';
    }

    render() {

        const { layers, colors, checkboxes, error } = this.props;

        //Rendering only when layers from database are downloaded and ready.
        if (error) {
            return (
                <Card className = "loading-layers">
                    <CardText>
                        Loading layers from database failed. Vector layers cannot be displayed.
                    </CardText>   
                </Card>
            )
        }
        else if (!checkboxes) {
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
                    checkboxes.flood_marks_check && ( <PointLayer /> )
                }
                </div>
            )
        }
    }
}

//Connecting with redux state
const mapStateToProps = (state) => ({
    ...state.polyLayers
})

//Connecting with redux actions(functions)
const mapDispatchToProps = (dispatch) => {
    return {
        getPolygonLayersFromBase: () => dispatch(getPolygonLayersFromBase),
        getFloodMarksFromBase: () => dispatch(getFloodMarksFromBase),
        setLayersBaseProps: () => dispatch(setLayersBaseProps()),
        setFloodDates: () => dispatch(setFloodDates())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(VectorLayers)