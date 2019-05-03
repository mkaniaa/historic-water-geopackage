import React, { Component } from 'react';
import './App.css';
import VectorLayers from './components/VectorLayers'
import Footer from './components/Footer'
import ToolPanel from './components/ToolPanel';
import { Map, TileLayer} from 'react-leaflet';

class App extends Component {

    state = {
        location: {
            lat: 50.06,
            lng: 19.94,
        },
        zoom: 13.5
    }

    render() {
        const position = [this.state.location.lat, this.state.location.lng];
        return (               
            <div className='map'>
                <Map className='map' center={ position } zoom={ this.state.zoom }>
                    <TileLayer className='main-map'
                        url='https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'
                        attribution='Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> 
                            &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        opacity='1'
                    />
                    <VectorLayers /> 
                </Map>
                <ToolPanel/>
                <Footer />  
            </div>
        );
    }
}

export default App;
