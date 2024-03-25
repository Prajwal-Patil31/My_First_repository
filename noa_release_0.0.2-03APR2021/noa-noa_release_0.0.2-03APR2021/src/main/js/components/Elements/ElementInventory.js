import React, { Fragment,useState } from 'react';
import withSelections from 'react-item-select';

import BreadCrumb from '../Widgets/BreadCrumb';

import { Notification, Drawer } from 'rsuite';

import {
	Grid, 
	Segment, 
	Button,
	Header, 
	Table, 
	Form,
	Checkbox, 
	Divider, 
	Container,
} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import { noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants';

import { Link } from 'react-router-dom';

const client = require('../../utils/client');

const TOPOLOGY = "topology-netconf";
const URIPATH = "http://localhost:8080/api/restconf/data/network-topology:network-topology/topology=";

class ElementInventory extends React.Component {
    constructor(props) {
		super(props);
        this.state = {
			elements : [],
        };
        this.getElements = this.getElements.bind(this);
	}

	getElements() {
        client({
            method : 'GET',
			path : URIPATH + TOPOLOGY ,
			headers : 
			{ 
                contenttype : 'application/json',
                accept : 'application/json' 
        	}
            }).done(response => { 
			this.setState({elements: response.entity["network-topology:topology"][0]["node"]});
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
		this.getElements();
	}

	render() {
		const elements = this.state.elements;

	return(
		<Container>
			<Grid style={noBoxShadow} centered verticalAlign='middle'>
				<Grid.Row style={noBoxShadow}>
					<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Segment style={noBoxShadow}>
							<Grid columns={3} verticalAlign='middle'>
								<Grid.Column width={4} verticalAlign='middle' textAlign='left'>
									<BreadCrumb/>
									<Header size='medium'>Element Inventory</Header>
								</Grid.Column>
								<Grid.Column width={5} verticalAlign='middle' textAlign='left'></Grid.Column>
								<Grid.Column width={7} textAlign='right' verticalAlign='middle'>
									<Fragment>
										<ElementSwitchToolbar getElements={this.getElements}/>
									</Fragment>
								</Grid.Column>
							</Grid>
						</Segment>
					</Grid.Column>
				</Grid.Row>
				<Divider />
				<Grid.Row style={noBoxShadow}>
					<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Segment style={noBoxShadow}>
							<Grid style={noBoxShadow}>
								<Grid.Column style={noBoxShadow}>
									<ElementSwitchList elements={elements} 
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

class ElementSwitchList extends React.Component {
    render() {
        return (
			<ElementSwitchTable elements={this.props.elements} 
            />
        )
    }
}

const ElementSwitchTable = withSelections((props) => {
    const {
        areAnySelected,
        selectedCount,
        handleClearAll,
    } = props;

	const elements = props.elements;

	const [activeIndex,setActiveIndex]  = useState(0);

	const handleClick = (e, titleProps) => {
		const index  = titleProps.index
		const newIndex = activeIndex === index ? -1 : index
		setActiveIndex(newIndex);
	}

    return(
        <div>
        <Segment basic textAlign="left" style={segmentStyle}>
            {!areAnySelected}
            <div style={{ visibility: areAnySelected ? 'visible' : 'hidden' }}>
            <span style={{marginRight: '8px'}}>{selectedCount} selected</span>
            <Button basic onClick={handleClearAll}>Clear</Button>
            </div>
            <div>
			{typeof elements == 'undefined' ?  <b/> :
            	<span>{elements.length} elements</span>
			}
			</div>
        </Segment>
		<div className = 'table-hscroll'>
        <Table striped style={stdTable}>
            <Table.Header>
                <Table.Row>
					<Table.HeaderCell width={1}></Table.HeaderCell>
					<Table.HeaderCell width={3}>Element Id</Table.HeaderCell>
					<Table.HeaderCell width={3}>Host</Table.HeaderCell>
					<Table.HeaderCell width={3}>Connection Status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
			{typeof elements == 'undefined' ? <b/> :
				<Table.Body>
				{elements.map((element,index) => (
					<Table.Row key={elements.indexOf(element)}>
						<Table.Cell></Table.Cell>
						<Table.Cell><Link to="/network/elements/odl-ofconfig-netconf">{element["node-id"]}</Link></Table.Cell>
						<Table.Cell>{element["netconf-node-topology:host"]}</Table.Cell>
						<Table.Cell>{element["netconf-node-topology:connection-status"]}</Table.Cell>
					</Table.Row>
					))}
				</Table.Body>
			}
        </Table>
		</div>
        </div>
        );
});

class ElementSwitchToolbar extends React.Component {
    render() {
        return(
            <Fragment>
                <AttachSwitch getElements={this.props.getElements} />
            </Fragment>
        )
    }
}


class AttachSwitch extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"node" : {
				"node" : [
					{
						"node-id": "odl-ofconfig-netconf",
						"netconf-node-topology:port": 830,
						"netconf-node-topology:reconnect-on-changed-schema": false,
						"netconf-node-topology:connection-timeout-millis": 20000,
						"netconf-node-topology:tcp-only": false,
						"netconf-node-topology:max-connection-attempts": 0,
						"netconf-node-topology:username": "admin",
						"netconf-node-topology:password": "admin",
						"netconf-node-topology:sleep-factor": 1.5,
						"netconf-node-topology:host": "127.0.0.1",
						"netconf-node-topology:between-attempts-timeout-millis": 2000,
						"netconf-node-topology:keepalive-delay": 120
					}
				]
			},
			show: false,
		};
		this.baseState = this.state.switches;
		this.handleNotification = this.handleNotification.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.getElements = this.props.getElements;
	}

	close() {
		this.setState({
			show: false
		});
	}

	handleNotification(funcName, description) {
		Notification[funcName]({
			title: funcName,
			description: description
		});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	handleAdd() {
		let body = this.state.node;
		var node = body;
		console.log("node: " + JSON.stringify(node));
		client({
			method: 'PUT', 
			path: URIPATH + TOPOLOGY + '/node=' + node.node[0]['node-id'],
			entity: node,
			headers: { 
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).done(response => {
			this.handleNotification('success','Added Switch Successfully');
			this.getElements();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','Failed to Add Switch');
		});
		this.close();
		return;
	}

	handleChange = (e, d) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let node = {...this.state.node};
		
		if(d.type == 'checkbox') {
			node.node[0][d.name] = d.checked;
			console.log("d.name:" + d.name);
			console.log("d.checked:" + d.checked);
		} else {
			node.node[0][name] = value;
		}

		this.setState({node:node});
	}

	updateStatus(value) {
		this.setState({status:value});
	}

	render() {
		const node = this.state.node.node[0];
	  	return (
		<React.Fragment>
			<Button style={tbButton} onClick={this.toggleDrawer}>Attach</Button>
			<Drawer show={this.state.show} onHide={this.close}> 
				<Drawer.Header>
					<Header size='large' content='Attach Element' />
				</Drawer.Header>
				<Drawer.Body>
					<Grid columns='equal'>
						<Grid.Row>
							<Grid.Column width={2}></Grid.Column>
							<Grid.Column width={12}>
								<Form> 
									<Form.Field>
										<Grid columns='equal' width='1'>
											<Grid.Row>
												<Grid.Column>Node ID</Grid.Column>
												<Grid.Column>
													<Form.Input type='text' name="node-id" 
																value={node["node-id"]} 
																onChange={this.handleChange}>
													</Form.Input>
												</Grid.Column>
											</Grid.Row> 
											<Grid.Row>
												<Grid.Column>Port</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' name='netconf-node-topology:port' 
																value={node['netconf-node-topology:port']} 
																onChange={this.handleChange}>
													</Form.Input>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Reconnect on changed schema</Grid.Column>
												<Grid.Column>
													<Checkbox name='netconf-node-topology:reconnect-on-changed-schema'
															checked={node['netconf-node-topology:reconnect-on-changed-schema']} 
															onChange={this.handleChange}>
													</Checkbox>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Connection timeout millis</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' name='netconf-node-topology:connection-timeout-millis' 
																value={node['netconf-node-topology:connection-timeout-millis']} 
																onChange={this.handleChange}>
													</Form.Input>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Tcp only</Grid.Column>
												<Grid.Column>
													<Form.Checkbox name='netconf-node-topology:tcp-only' 
																checked={node['netconf-node-topology:tcp-only']} 
																onChange={this.handleChange}>
													</Form.Checkbox>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Max connection attempts</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' name='netconf-node-topology:max-connection-attempts' 
																value={node['netconf-node-topology:max-connection-attempts']} 
																onChange={this.handleChange}>
													</Form.Input>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Username</Grid.Column>
												<Grid.Column>
													<Form.Input type='text' name='netconf-node-topology:username' 
																value={node['netconf-node-topology:username']} 
																onChange={this.handleChange}>
													</Form.Input>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Password</Grid.Column>
												<Grid.Column>
													<Form.Input type='text' name='netconf-node-topology:password' 
																value={node['netconf-node-topology:password']} 
																onChange={this.handleChange}>
													</Form.Input>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Sleep factor</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' name='netconf-node-topology:sleep-factor' 
																value={node['netconf-node-topology:sleep-factor']} 
																onChange={this.handleChange}>
													</Form.Input>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Host</Grid.Column>
												<Grid.Column>
													<Form.Input type='text' name='netconf-node-topology:host' 
																value={node['netconf-node-topology:host']} 
																onChange={this.handleChange}>
													</Form.Input>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Between attempts timeout millis</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' 
																name='netconf-node-topology:between-attempts-timeout-millis' 
																value={node['netconf-node-topology:between-attempts-timeout-millis']} 
																onChange={this.handleChange}>
													</Form.Input>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>keepalive delay</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' 
																name='netconf-node-topology:keepalive-delay' 
																value={node['netconf-node-topology:keepalive-delay']} 
																onChange={this.handleChange}>
													</Form.Input>
												</Grid.Column> 
											</Grid.Row> 
										</Grid>
									</Form.Field>
								</Form>
							</Grid.Column>
							<Grid.Column width={2}></Grid.Column>
						</Grid.Row>
						<Grid.Row></Grid.Row>
						<Grid.Row></Grid.Row>
						<Grid.Row>
							<Grid.Column></Grid.Column>
							<Grid.Column>
								<Button onClick={this.handleAdd.bind(this)} icon style={tbButton}  
										content='Submit'>
								</Button>
								<Button onClick={this.close} icon style={tbButton}  
										floated='right' content='Cancel'>
								</Button>
							</Grid.Column>
							<Grid.Column></Grid.Column>
						</Grid.Row>
					</Grid>
				</Drawer.Body>
			</Drawer>
		</React.Fragment>  
		);
	}
}


export default ElementInventory; 