import React from 'react';

import { 
	Grid, 
	Segment,
	Divider,
	Table, 
} from 'semantic-ui-react';


import 'semantic-ui-css/semantic.min.css';

const when = require('when');
const client = require('../../utils/client');

const URIPATH = "http://localhost:8080/api/restconf/data/network-topology:network-topology/topology=";
const TOPOLOGY = "topology-netconf";
const NODE = "odl-ofconfig-netconf";
const YANG = "/yang-ext:mount/of-config:capable-switch/logical-switches";


class LogicalSwitchCapabilities extends React.Component {
	constructor(props) {
		super(props);
			this.state = {
				switches: [],
				capabilities: [],
				actionTypes:[],
				groupTypes:[],
				reservedPortTypes:[],
				instructionTypes:[],
				groupCapabilities:[]
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

	getActionTypes() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + YANG + '/switch=ofc-bridge/capabilities',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({actionTypes: response.entity["of-config:capabilities"]["action-types"]["type"]});
			}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
	}
	
	getGroupTypes() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + YANG + '/switch=ofc-bridge/capabilities',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({groupTypes: response.entity["of-config:capabilities"]["group-types"]["type"]});
			}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
	}

	getReservedPortTypes() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + YANG + '/switch=ofc-bridge/capabilities',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({reservedPortTypes: response.entity["of-config:capabilities"]["reserved-port-types"]["type"]});
			}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
	}

	getInstructionTypes() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + YANG + '/switch=ofc-bridge/capabilities',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({instructionTypes: response.entity["of-config:capabilities"]["instruction-types"]["type"]});
			}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
	}

	getGroupCapabilities() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + YANG + '/switch=ofc-bridge/capabilities',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({groupCapabilities: response.entity["of-config:capabilities"]["group-capabilities"]["capability"]});
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
		this.getActionTypes();
		this.getGroupTypes();
		this.getReservedPortTypes();
		this.getInstructionTypes();
		this.getGroupCapabilities();
	}
	
	render() {
		const capabilities = this.state.capabilities;
		const switches = this.state.switches;
		const actionTypes = this.state.actionTypes;
		const groupTypes = this.state.groupTypes;
		const reservedPortTypes = this.state.reservedPortTypes;
		const instructionTypes = this.state.instructionTypes;
		const groupCapabilities = this.state.groupCapabilities;

	return (
		<SwitchDetailsList capabilities={capabilities} switches={switches} 
						actionTypes={actionTypes} groupTypes={groupTypes}
						groupCapabilities={groupCapabilities} reservedPortTypes={reservedPortTypes}
						instructionTypes={instructionTypes}
		/>
		)
	}
}

class SwitchDetailsList extends React.Component {
	render() {
		const capabilities = this.props.capabilities;
		const switches = this.props.switches;
		const actionTypes = this.props.actionTypes;
		const groupTypes = this.props.groupTypes;
		const reservedPortTypes = this.props.reservedPortTypes;
		const instructionTypes = this.props.instructionTypes;
		const groupCapabilities = this.props.groupCapabilities;
		const res = JSON.stringify(capabilities);
	return(
		<div>
        <Segment>
            <Grid>
				<Grid.Row>
					<Grid>
						<Grid.Row>
							<Grid.Column width={2}></Grid.Column>
							<Grid.Column width={7}>
								<Grid columns='equal' width='2'>
									<Grid.Row>
										<Grid.Column textAlign='left'>Queue Statistics</Grid.Column>
										<Grid.Column>{String(capabilities["queue-statistics"])}</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>Flow Statistics</Grid.Column>
										<Grid.Column>{String(capabilities["flow-statistics"])}</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>Table Statistics</Grid.Column>
										<Grid.Column>{String(capabilities["table-statistics"])}</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>Block Looping Ports</Grid.Column>
										<Grid.Column>{String(capabilities["block-looping-ports"])}</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>Max Tables</Grid.Column>
										<Grid.Column>{capabilities["max-tables"]}</Grid.Column>
									</Grid.Row>
								</Grid>
							</Grid.Column>
							<Grid.Column width={7}>
								<Grid columns='equal'>
								<Grid.Row>
										<Grid.Column textAlign='left'>Max Ports</Grid.Column>
										<Grid.Column>{capabilities["max-ports"]}</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>Port Statistics</Grid.Column>
										<Grid.Column>{String(capabilities["port-statistics"])}</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>Reassemble IP Fragments</Grid.Column>
										<Grid.Column>{String(capabilities["reassemble-ip-fragments"])}</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>Group Statistics</Grid.Column>
										<Grid.Column>{String(capabilities["group-statistics"])}</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>Max Bufferred Packets</Grid.Column>
										<Grid.Column>{capabilities["max-buffered-packets"]}</Grid.Column>
									</Grid.Row>
								</Grid>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Grid.Row>
				<Divider />
				<Grid.Row>
					<Grid.Column width={16}>
						<Table basic='very' celled>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell textAlign='center'>Action Types</Table.HeaderCell>
									<Table.HeaderCell textAlign='center'>Group Types</Table.HeaderCell>
									<Table.HeaderCell textAlign='center'>Reserved Port Types</Table.HeaderCell>
									<Table.HeaderCell textAlign='center'>Instruction Types</Table.HeaderCell>
									<Table.HeaderCell textAlign='center'>Grouped Capabilities</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell verticalAlign='top'>
										{actionTypes.map((actionType,index) => (
											<ul>	
												<li>{actionType}</li>
											</ul>
										))}
									</Table.Cell>
									<Table.Cell verticalAlign='top'>
										{groupTypes.map((groupType,index) => (
											<ul>
												<li>{groupType}</li>
											</ul>
										))}
									</Table.Cell>
									<Table.Cell verticalAlign='top'>
										{reservedPortTypes.map((reservedPortType,index) => (
											<ul>
												<li>{reservedPortType}</li>
											</ul>
										))}
									</Table.Cell>
									<Table.Cell verticalAlign='top'>
										{instructionTypes.map((instructionType,index) => (
											<ul>
												<li>{instructionType}</li>
											</ul>
										))}
									</Table.Cell>
									<Table.Cell verticalAlign='top'>
										{groupCapabilities.map((groupCapability,index) => (
											<ul>
												<li>{groupCapability}</li>
											</ul>
										))}
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>
					</Grid.Column>
				</Grid.Row>			
			</Grid>
        </Segment>
		</div>
	  );
	}
}

export default LogicalSwitchCapabilities;