import React, {Component} from 'react'
import { Collapse, Button, Card, CardTitle, CardText } from 'reactstrap';
import LayersControls from './LayersControls';
import { connect } from 'react-redux';

class ToolPanel extends Component {

    state = {
        collapse: false
    }

   //Changing state of collapse if toolpanel is expanded or not.
   toggleCollapseLayersList = () => {
        this.setState({ 
            collapse: !this.state.collapse });
    }

    render() {
        const { checkboxes } = this.props;

        //Rendering controls only when layers from database are downloaded and ready.
        if (checkboxes == null) {
            return (
                <Card body className='layers-card'>
                    <CardTitle>HISTORIC WATER</CardTitle>
                    <CardText>Historyczna hydrografia Krakowa</CardText>
                    <Button 
                        color="primary" 
                        onClick={this.toggleCollapseLayersList} 
                        style={{ marginBottom: '1rem' }}
                        disabled={true}>
                        {this.state.collapse ? 'Ukryj listę warstw' : 'Pokaż listę warstw'}
                    </Button>
                </Card> 
            )} else {
                return (
                    <Card body className='layers-card'>
                        <CardTitle>HISTORIC WATER</CardTitle>
                        <CardText>Historyczna hydrografia Krakowa</CardText>
                        <Button 
                            color="primary" 
                            onClick={this.toggleCollapseLayersList} 
                            style={{ marginBottom: '1rem' }}>
                            {this.state.collapse ? 'Ukryj listę warstw' : 'Pokaż listę warstw'}
                        </Button>
                        <Collapse isOpen={this.state.collapse}>
                            <LayersControls />
                        </Collapse>
                    </Card> 
                );
            }
            
        }
}

const mapStateToProps = (state) => {
    return {
        checkboxes: state.checkboxes
    }
}

export default connect(mapStateToProps)(ToolPanel);