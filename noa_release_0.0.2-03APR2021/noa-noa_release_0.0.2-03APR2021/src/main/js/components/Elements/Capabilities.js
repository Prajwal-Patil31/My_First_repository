import React, { Fragment } from 'react';

import { Grid, Label } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

const URI = "http://localhost:8080/api/restconf/data/network-topology:network-topology/topology="
const TOPOLOGY = "topology-netconf"
const NODE = "odl-ofconfig-netconf"

const client = require('../../utils/client');

class Capabilities extends React.Component {

    constructor() {
        super();
        this.state = {
            capabilities: [],
            capabilities_parsed: []
        }
    }

    processCapabilities() {
        const capabilities = this.state.capabilities;
        const capabilities_parsed = this.state.capabilities_parsed;
        const splits = ["urn:","ietf:params:","xml:ns:"];
        for(var i=0; i<capabilities.length;i++) {
           capabilities_parsed[i] = capabilities[i].capability;
           for( var j=0; j<splits.length ; j++ ) {
                capabilities_parsed[i] = capabilities_parsed[i].replace(splits[j], '');
                capabilities_parsed[i] = capabilities_parsed[i].replace(/\(.*\)/, '');
                capabilities_parsed[i] = capabilities_parsed[i].replace(/\?.*$/, '');
           }
        }
    }

    getCapabilities() {
        client({
            method: 'GET',
			path: URI + TOPOLOGY + '/node=' + NODE + '/available-capabilities',
            headers: { 
                contenttype: 'application/json',
                accept: 'application/json' 
              }
            }).done(response => { 
            this.setState({capabilities: response.entity["netconf-node-topology:available-capabilities"]["available-capability"]});
            this.processCapabilities();
		}, 
		response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');
			}
		});
    }

    componentDidMount() {
        this.getCapabilities();
    }
    
    render() {
        const capabilities_parsed = this.state.capabilities_parsed;
        return(
            <Fragment>
                <Grid>
                    <Grid.Row columns='3'>
                {capabilities_parsed.map((capability,index) => (
                        <Grid.Column width={5}>
                            <Label  as='a' 
                                    style={{backgroundColor: "#DFDCDC", width: '80%', marginBottom: '10px',
                                            height: '70%', 
                                    }}>
                                <p style={{fontSize: '12px'}}>{capability}</p>
                            </Label>
                        </Grid.Column>
                    ))}
                    </Grid.Row>
                </Grid>
                
            </Fragment>
        )
    }
}

export default Capabilities;