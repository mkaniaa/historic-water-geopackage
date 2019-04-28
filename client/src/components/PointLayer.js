import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setTimelineValues } from '../store/actions/layersActions';
import icon from '../img/flood-mark.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { Marker, Popup} from 'react-leaflet';
import HorizontalTimeline from 'react-horizontal-timeline';

var floodMarkIcon = L.icon({
    iconUrl: icon,
    iconAnchor: [12.5, 30],
    popupAnchor: [0, -41],
    shadowUrl: iconShadow,
    shadowAnchor: [12.5, 41]
});

class PointLayer extends Component 
{
    handleIndexClick = (index) => {
        this.props.setTimelineValues(index)
    }

    render() {
        const { floodMarks, floodDate, floodsDates, timelineVisible, valueTimeline } = this.props;

        const timeline =             
            <div className='timeline'>
                <HorizontalTimeline
                    index={ valueTimeline }
                    indexClick={(index) => { this.handleIndexClick(index) }}
                    values={ floodsDates }
                />
            </div>
        
        const marksOnMap = timelineVisible ? (
            <div>
                {
                    floodMarks.map((feature, index) => {
                        if(floodDate === feature.properties.flood_date) {
                            return(
                                <Marker 
                                    key = {feature.geometry.coordinates.join('_') + '_' + index}
                                    position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                                    icon={floodMarkIcon}>
                                    <Popup>{feature.properties.flood_date}<br />{feature.geometry.coordinates[1]}
                                        <br />{feature.geometry.coordinates[0]}</Popup>
                                </Marker>
                            )
                        } else return ""
                    })
                }
                { timeline }
            </div>
        ):(
            floodMarks.map((feature, index) => (
                <Marker 
                    key = {feature.geometry.coordinates.join('_') + '_' + index}
                    position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                    icon={floodMarkIcon}>
                    <Popup>{feature.properties.flood_date}<br />{feature.geometry.coordinates[1]}
                        <br />{feature.geometry.coordinates[0]}</Popup>
                </Marker>
            ))
        )

        return (
            <div>
                { marksOnMap }
            </div>
        ) 
    }   
}

//Connecting with redux state
const mapStateToProps = (state) => {
    return {
        floodMarks: state.flood_marks,
        floodDate: state.flood_date,
        floodsDates: state.floods_dates,
        timelineVisible: state.timelineVisible,
        checkFloodMarks: state.flood_marks_checked,
        valueTimeline: state.valueTimeline
    }
}

//Connecting with redux actions(functions)
const mapDispatchToProps = (dispatch) => {
    return {
        setTimelineValues: (floodIndex) => dispatch(setTimelineValues(floodIndex))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PointLayer);
