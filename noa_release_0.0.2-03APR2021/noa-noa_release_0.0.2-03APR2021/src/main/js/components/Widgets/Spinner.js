/**@module Spinner */

import React from 'react';
import {Segment, Loader, Dimmer} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

class Spinner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active : props.active
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ active: nextProps.active });  
    }

    render() {
        return(
            <Dimmer.Dimmable dimmed={this.state.active}>
            <Dimmer active={this.state.active} inverted>
                <Loader>Loading</Loader>
            </Dimmer>
            </Dimmer.Dimmable>
      );
    }
}

export default Spinner;