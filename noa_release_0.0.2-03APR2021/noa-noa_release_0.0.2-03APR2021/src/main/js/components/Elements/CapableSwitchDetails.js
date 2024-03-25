import React, { Fragment } from 'react';


import { 
	Grid, 
	Container,
	Header,
	Segment,
	Divider,
	Button,
	Label	
} from 'semantic-ui-react';


import BreadCrumb from'../Widgets/BreadCrumb';
import { noBoxShadow } from '../../constants';
import 'semantic-ui-css/semantic.min.css';

import Capabilities from './Capabilities';
import LogicalSwitch from './LogicalSwitch';
import Ports from './Ports';
import FlowTables from './FlowTables';

const client = require('../../utils/client');

const URIPATH = "http://localhost:8080/api/restconf/data/network-topology:network-topology/topology=";
const TOPOLOGY = "topology-netconf";
const NODE = "odl-ofconfig-netconf";
const YANG = "/yang-ext:mount/of-config:capable-switch/logical-switches";


class CapableSwitchDetails extends React.Component {
	constructor(props) {
		super(props);
			this.state = {
				switches: [],
				capabilities: [],
				ports: [],
			};
	}

	getSwitches() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + YANG ,
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({switches: response.entity["of-config:logical-switches"]["switch"]});
			}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
	}
	
	getCapabilities() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + YANG + '/switch=ofc-bridge/capabilities',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({capabilities: response.entity["of-config:capabilities"]});
			}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
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
		this.getCapabilities();
		this.getSwitches();
		this.getPorts();
	}
	
	render() {
		const capabilities = this.state.capabilities;
		const switches = this.state.switches;
		const ports = this.state.ports;
	
		return (
			<Container>
				<Grid style={noBoxShadow} centered verticalAlign='middle'>
					<Grid.Row style={noBoxShadow}>
						<Grid.Column style={noBoxShadow} verticalAlign='middle'>
							<Segment style={noBoxShadow}>
								<Grid columns={3} verticalAlign='middle'>
									<Grid.Column width={7} verticalAlign='middle' textAlign='left'>
										<BreadCrumb/>
										<Header size='medium'>Capable Switch</Header>
									</Grid.Column>
									<Grid.Column width={2} verticalAlign='middle' textAlign='left'></Grid.Column>
									<Grid.Column width={7} textAlign='right' verticalAlign='middle'></Grid.Column>
								</Grid>
							</Segment>
						</Grid.Column>
					</Grid.Row>
					<Divider />
					<Grid.Row style={noBoxShadow}>
						<Grid.Column style={noBoxShadow} verticalAlign='middle'>
							<Segment style={noBoxShadow}>
								<Grid style={noBoxShadow}>
									<Fragment>
									<Grid.Row>
										<Grid.Column>
											<Segment padded>
											<Label attached='top'><Header>Capabilities</Header></Label>
											<Capabilities capabilities={capabilities}/>
											</Segment>
										</Grid.Column>
									</Grid.Row>
									</Fragment>
									<Grid.Row columns={3}>
										<Grid.Column width={6}>
											<Header>Logical Switches</Header>
											<LogicalSwitch switches={switches}/>
										</Grid.Column>
										<Grid.Column width={5}>
											<Header>Ports</Header>
											<Ports  ports={ports}/>
										</Grid.Column>
										<Grid.Column width={5}>
											<Header>Flow Tables</Header>
											<FlowTables />
										</Grid.Column>
									</Grid.Row>
								</Grid>
							</Segment>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
		)
	}
}

export default CapableSwitchDetails;