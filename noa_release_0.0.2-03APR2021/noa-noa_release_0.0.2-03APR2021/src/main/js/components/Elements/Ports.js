import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const URIPATH = "http://localhost:8080/api/restconf/data/network-topology:network-topology/topology="
const TOPOLOGY = "topology-netconf"
const NODE = "odl-ofconfig-netconf"

const client = require('../../utils/client');

class Ports extends React.Component {

    constructor() {
        super();
        this.state= {
            ports: []
        }
    }

    getPorts() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + '/yang-ext:mount/of-config:capable-switch/resources?content=nonconfig',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({ports: response.entity["of-config:resources"]["port"]});
			}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
    }
    
    componentDidMount() {
        this.getPorts();
    }

    render() {
        const ports = this.state.ports;
        return(
            <Fragment>
                {ports.map((port,index) => (
                    <li><Link to="/network/elements/capableswitch/port/ofc-bridge">{port.name}</Link></li>
                ))}
            </Fragment>
        )
    }
}

export default Ports;