import React, { Fragment } from 'react';

import BreadCrumb from '../Widgets/Breadcrumb';

import { 
	Grid, 
	Container,
	Header,
	Segment,
	Divider,
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

class Ports extends React.Component {
    constructor(props) {
		super(props);
			this.state = {
                ports : [],
				configurations : [],
				estates : [],
				currentFeatures :[],
				advertisePeers :[],
				supportedFeatures :[]
			};
    }
    
    getConfigurations() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + '/yang-ext:mount/of-config:capable-switch/resources/port=ofc-bridge/configuration',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({configurations: response.entity["of-config:configuration"]});
			}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
	}
	
	getStates() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + '/yang-ext:mount/of-config:capable-switch/resources/port=ofc-bridge/state',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({estates: response.entity["of-config:state"]});
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
	
	getCurrentFeatures() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + '/yang-ext:mount/of-config:capable-switch/resources/port=ofc-bridge/features',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({currentFeatures: response.entity["of-config:features"]["current"]});
			}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
	}

	getAdvertisedPeers() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + '/yang-ext:mount/of-config:capable-switch/resources/port=ofc-bridge/features',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({advertisePeers: response.entity["of-config:features"]["advertised-peer"]});
			}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
	}

	getSupportedFeatures() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + '/yang-ext:mount/of-config:capable-switch/resources/port=ofc-bridge/features',
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({supportedFeatures: response.entity["of-config:features"]["supported"]});
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
		this.getConfigurations();
		this.getStates();
		this.getSupportedFeatures();
		this.getAdvertisedPeers();
		this.getCurrentFeatures();
    }

    render() {
		const estates = this.state.estates;
        const ports = this.state.ports;
		const configurations = this.state.configurations;
		const currentFeatures = this.state.currentFeatures;
		const advertisePeers = this.state.advertisePeers;
		const supportedFeatures = this.state.supportedFeatures;
    return (
		<Container>
			<Grid style={noBoxShadow} centered verticalAlign='middle'>
				<Grid.Row style={noBoxShadow}>
					<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Segment style={noBoxShadow}>
							<Grid columns={3} verticalAlign='middle'>
								<Grid.Column width={7} verticalAlign='middle' textAlign='left'>
									<BreadCrumb/>
									<Header size='medium'>Port Details</Header>
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
							<Grid style={noBoxShadow} columns={1}>
								<Grid.Column style={noBoxShadow} width={16}>
									<PortDetailsList 
											ports={ports} 
											configurations={configurations} 
											estates={estates}
											currentFeatures={currentFeatures} 
											advertisePeers={advertisePeers}
											supportedFeatures={supportedFeatures}
									/>
								</Grid.Column>
							</Grid>
						</Segment>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
		)
	}
}

class PortDetailsList extends React.Component {
	render() {
        const ports = this.props.ports;
		const configurations = this.props.configurations;
		const estates = this.props.estates;
		const currentFeatures = this.props.currentFeatures;
		const advertisePeers = this.props.advertisePeers;
		const supportedFeatures = this.props.supportedFeatures;
	return(
        <div>
        <Segment>
            <Grid>
				<Grid.Row>
					<Grid columns='5'>
						<Grid.Row>
							{ports.map(port => (
								<Fragment>
									<Grid.Column width={3}>
										<Header>Name : {port.name} </Header>
									</Grid.Column>
									<Grid.Column width={3}>
										<Header>Number : {port.number}</Header>
									</Grid.Column>
									<Grid.Column width={3}>
										<Header>Current-Rate : {port["current-rate"]}</Header>
									</Grid.Column>
									<Grid.Column width={3}>
										<Header>Max-rate : {port["max-rate"]}</Header>
									</Grid.Column>
									<Grid.Column width={4}>
										<Header>Requested-Number : {port["requested-number"]}</Header>
									</Grid.Column>
								</Fragment>
							))}
						</Grid.Row>
					</Grid>
				</Grid.Row>
				<Divider />
				<Grid.Row>
					<Grid>
						<Grid.Row>
							<Grid.Column width={2}></Grid.Column>
							<Grid.Column width={7}>
								<Grid columns='equal' width='4'>
									<Grid.Row>
										<Grid.Column textAlign='left'>No-Receive</Grid.Column>
										<Grid.Column>{String(configurations["no-receive"])}	</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>No-Forward</Grid.Column>
										<Grid.Column>{String(configurations["no-forward"])}	</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>No-Packet-In</Grid.Column>
										<Grid.Column>{String(configurations["no-packet-in"])}</Grid.Column>
									</Grid.Row>
								</Grid>
							</Grid.Column>
							<Grid.Column width={7}>
								<Grid columns='equal'>
									<Grid.Row>
										<Grid.Column textAlign='left'>Admin-State</Grid.Column>
										<Grid.Column>{configurations["admin-state"]}</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>Live </Grid.Column>
										<Grid.Column>{String(estates["live"])}</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column textAlign='left'>Oper-State</Grid.Column>
										<Grid.Column>{estates["oper-state"]}</Grid.Column>
									</Grid.Row>
								</Grid>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Grid.Row>
				<Divider/>
				<Grid.Row columns={3}>
					<Grid.Column>
						<Header>Current Features</Header>
						<Grid>
							<Grid.Row>
								<Grid.Column width={6} textAlign='left'>
									Auto Negotiate :
								</Grid.Column>
								<Grid.Column width={6}>
									{String(currentFeatures["auto-negotiate"])}
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column width={6} textAlign='left'>
									Pause :
								</Grid.Column>
								<Grid.Column width={6}>
									{String(currentFeatures["pause"])}
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column width={6} textAlign='left'>
									Medium :
								</Grid.Column>
								<Grid.Column width={6}>
									{currentFeatures["medium"]}
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column width={6} textAlign='left'>
									Rate :
								</Grid.Column>
								<Grid.Column width={6}>
								{currentFeatures["rate"]}
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Grid.Column>
					<Grid.Column>
						<Header>Advertising Peers</Header>
						<Grid>
							<Grid.Row>
								<Grid.Column width={6} textAlign='left'>
									Auto Negotiate :
								</Grid.Column>
								<Grid.Column width={6}>
									{String(advertisePeers["auto-negotiate"])}
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column width={6} textAlign='left'>
									Pause :
								</Grid.Column>
								<Grid.Column width={6}>
									{String(advertisePeers["pause"])}
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Grid.Column>
					<Grid.Column>
						<Header>Supported Features</Header>
						<Grid>
							<Grid.Row>
								<Grid.Column width={6} textAlign='left'>
									Auto Negotiate :
								</Grid.Column>
								<Grid.Column width={6}>
									{String(supportedFeatures["auto-negotiate"])}
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column width={6} textAlign='left'>
									Pause :
								</Grid.Column>
								<Grid.Column width={6}>
									{String(supportedFeatures["pause"])}
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Grid.Column>
				</Grid.Row>			
            </Grid>
        </Segment>
        </div>
	  );
	}
}

export default Ports;