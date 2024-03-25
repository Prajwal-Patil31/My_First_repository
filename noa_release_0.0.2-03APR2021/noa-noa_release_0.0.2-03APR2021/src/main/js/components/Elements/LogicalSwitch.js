import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const URIPATH = "http://localhost:8080/api/restconf/data/network-topology:network-topology/topology="
const TOPOLOGY = "topology-netconf"
const NODE = "odl-ofconfig-netconf"

const client = require('../../utils/client');

class LogicalSwitch extends React.Component {

    constructor() {
        super();
        this.state= {
            switches: []
        }
    }

    getLogicalSwitches() {
		client({
            method: 'GET',
			path: URIPATH + TOPOLOGY + '/node=' + NODE + '/yang-ext:mount/of-config:capable-switch/logical-switches',
            headers: { 
                contenttype: 'application/json',
                accept: 'application/json' 
              }
            }).done(response => { 
			this.setState({switches: response.entity["of-config:logical-switches"]["switch"]});
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
        this.getLogicalSwitches();
    }

    render() {
        const switches = this.state.switches;
        return(
            <Fragment>
                {switches.map((logicalSwitch,index) => (
                    <li><Link to="/network/elements/logical-switch/ofc-bridge">{logicalSwitch.id}</Link></li>
                ))}
            </Fragment>
        )
    }
}

export default LogicalSwitch;