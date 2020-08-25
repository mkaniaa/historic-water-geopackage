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
                        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
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
