import React from 'react';

import { 
	Grid, 
	Container,
} from 'semantic-ui-react';

import { 
	noBoxShadow,
} from '../../constants';

import 'semantic-ui-css/semantic.min.css';

const when = require('when');
const client = require('../../utils/client');

const URIPATH = "http://localhost:8080/api/restconf/data/network-topology:network-topology/topology=";
const TOPOLOGY = "topology-netconf";
const NODE = "odl-ofconfig-netconf";
const SWITCH = "ofc-bridge";

class LogicalSwitchPorts extends React.Component {
    constructor(props) {
		super(props);
			this.state = {
                ports : [],
			};
    }
    
    getPorts() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + '/yang-ext:mount/of-config:capable-switch/logical-switches/switch=' + 
				  SWITCH + '/resources',
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
    return (
		<Container>
			<Grid style={noBoxShadow} centered verticalAlign='middle'>
				<Grid.Row style={noBoxShadow}>
					<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Grid style={noBoxShadow} columns={1}>
							<Grid.Column style={noBoxShadow} width={16}>
							{ports.map(port => (
							<li>{port}</li>
							))}
							</Grid.Column>
						</Grid>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
		)
	}
}

export default LogicalSwitchPorts;