import React, { Fragment, useEffect, useState } from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';
import  BreadCrumb from '../Widgets/BreadCrumb';
import { Notification } from 'rsuite';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import {
	Grid, Segment, Modal, Button,
	Header, Table, Form, Input,
	Checkbox, Label, Divider, Container,
	Accordion,
	Icon} from 'semantic-ui-react';

import { menuStyle, noBorder, noPadding, noBoxShadow, 
		 tbButton, stdTable, segmentStyle, drawerStyle } from '../../constants';
		 
import 'semantic-ui-css/semantic.min.css';
import { Drawer, CheckPicker } from 'rsuite';
import json from 'rest/mime/type/application/json';

const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const stompClient = require('../../utils/websocket-listener');
const root = '/api'

class Role extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			roles: [],
			isLoggedIn: false,
			selected: [],
			features_all: [],
			features_dd: [],
			role_features: [],
		};
		this.setSelected = this.setSelected.bind(this);
		this.getSelected = this.getSelected.bind(this);
		this.getRoles = this.getRoles.bind(this);
		this.closeState = this.closeState.bind(this);
		const update = false;
	}
	
	selectUpdateDone () {
		this.update = true;
	}
        
	setSelected(items) {
		let sel = Object.keys(items);
		let id;
		if (Array.isArray(sel) && sel.length) {
			let rid = this.state.roles[sel[0]].roleId;
			id = parseInt(rid);
		}
		if(sel.length<2) {
			this.setState({
				selected: update(this.state.selected, {[0]: { $set: id }})
			}, this.selectUpdateDone );
		}
		else{
			alert("Operations with multi-select is not implemented");
			return null;
		}
	}
	
	getSelected () {
		if (this.update != true) {
			console.log('State update is pending');	
			return null;
		} else {
			return this.state.selected[0];
		}
	}
	
	fetchRoleFeatures() {
		const len = this.state.roles.length;
		for (let roleno = 0; roleno < len; roleno++) {
			this.fetchFeature( roleno );
		}
	}

	fetchFeature( index ) {
		let id = this.state.roles[index].roleId;

		client({method: 'GET', path: '/api/security-roles/' + id + '/features'})
		.done(response => {
			this.setState({
				role_features: update(this.state.role_features, {[index]: 
										{ $set: response.entity._embedded.features }})
			}, () => { });
		});
		response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		}
	}

	closeState(){
		this.setState({features_dd: []});
	}

	parseFeatures() {
		let features_dd = this.state.features_dd;
		let features_j;

		if (!this.state.features_all)
			return;

		this.state.features_all.forEach(function (item, index) {
			let feature = { 'value': item.featureId, 'label': item.featureName, 
							'role': item.featureId };
			features_j = features_dd.push(feature);
		});

		this.setState({features_dd: features_dd});
	}

	fetchAllFeatures() {
		client({method: 'GET', path: '/api/features'})
		.done(response => { 
			this.setState({features_all: response.entity._embedded.features}, 
							this.parseFeatures );
			}, 
		response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');
			}
			this.setState({isLoggedin: false});
		});
	}

	getRoles() {
	client({method: 'GET', path: '/api/security-roles'}).done(response => { 
		this.setState({roles: response.entity._embedded["security-roles"]}, () => {
			this.fetchRoleFeatures(); 
			this.fetchAllFeatures(); 
		});
		this.setState({isLoggedin: true});
		}, 
		response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');
			}
			this.setState({isLoggedin: false});
		});
	}
	componentDidMount() {
		this.getRoles();
    }

	render() {
		const isLoggedIn = this.state.isLoggedIn;
		const roles = this.state.roles;
		const role_features = this.state.role_features;
        const features_dd = this.state.features_dd;
		
		return(
		<Container>
		  <Grid style={noBoxShadow} centered verticalAlign='middle'>
			<Grid.Row style={noBoxShadow}>
			  <Grid.Column style={noBoxShadow} verticalAlign='middle'>
				<Segment style={noBoxShadow}>
					<Grid columns={3} verticalAlign='middle'>
					<Grid.Column width={4} verticalAlign='middle' textAlign='left'>
					{<BreadCrumb/>}
					<Header size='medium'>Role Administration</Header>
					</Grid.Column>
					<Grid.Column width={5} verticalAlign='middle' textAlign='left'>
					</Grid.Column>
					<Grid.Column width={7} textAlign='right' verticalAlign='middle'>
					<Fragment>
						<RolesToolbar getSelected={this.getSelected}
									  getRoles={this.getRoles}
                                     features_dd={features_dd} 
									 closeState={this.closeState}/>
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
						<RolesList roles={roles} features={role_features} 
							setSelected={this.setSelected} />				
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

const RoleTable = withSelections((props) => {
	const {     
		areAllIndeterminate,
		areAllSelected,
		areAnySelected,
		selectedCount,
		handleClearAll,
		handleSelect,
		handleSelectAll,
		isItemSelected,
		selections,
	} = props;

	const setSelected = props.setSelected;
	const roles = props.roles;
	const features = props.features;

	const [activeIndex,setActiveIndex]  = useState(0);

	function handleSelectLocal (roleId) {
		handleSelect(roleId);
	}

	const handleClick = (e, titleProps) => {
		const index  = titleProps.index
		const newIndex = activeIndex === index ? -1 : index
		setActiveIndex(newIndex);
	}

	useEffect(() => {
		setSelected(selections);
		}, [props.selections]);

	if (!roles && !roles.length)
		return null;

	return(
		<div>
		<Segment basic textAlign="left" style={segmentStyle}>
			{!areAnySelected}
			<div style={{ visibility: areAnySelected ? 'visible' : 'hidden' }}>
				<span style={{marginRight: '8px'}}>{selectedCount} Selected</span>
				<Button basic onClick={handleClearAll}>Clear</Button>
			</div>
			<div><span>{roles.length} Roles</span></div>
      	</Segment>
		<div className = 'table-hscroll'>
        <Table striped style={stdTable}>
			<Table.Header>
			<Table.Row>
				<Table.HeaderCell width={1}>
				</Table.HeaderCell>
				<Table.HeaderCell width={1}>Role ID</Table.HeaderCell>
				<Table.HeaderCell width={3}>Role Name</Table.HeaderCell>
                <Table.HeaderCell>Service ID</Table.HeaderCell>
                <Table.HeaderCell width={2}>Sub-System ID</Table.HeaderCell>
                <Table.HeaderCell width={2}>Last Update ID</Table.HeaderCell>
                <Table.HeaderCell width={5}>Features</Table.HeaderCell>
			</Table.Row>
			</Table.Header>
			<Table.Body>
			{roles.map((role, index) => (
			<Table.Row key = {roles.indexOf(role)}>
				<Table.Cell>
				<Checkbox checked={isItemSelected(roles.indexOf(role))} 
						  onChange={handleSelectLocal.bind(this, roles.indexOf(role))} />
				</Table.Cell>
				<Table.Cell>{role.roleId}</Table.Cell>
				<Table.Cell>{role.roleName}</Table.Cell>           
                <Table.Cell>{role.serviceID}</Table.Cell>
                <Table.Cell>{role.subSystemId}</Table.Cell>
                <Table.Cell>{role.lastUpdateId}</Table.Cell>
				<Accordion>
					<Accordion.Title 
						active={activeIndex === index}
						index={index}
						onClick={handleClick}
					>
						<Icon name='dropdown'/>
						 Features...
					</Accordion.Title>
					<Accordion.Content active={activeIndex === index}>
					{index in features ? 
						features[index].map(feature => ( <Feature fr={feature}/>)) : ''}
					</Accordion.Content>
				</Accordion>
			</Table.Row>
			))}
			</Table.Body>
        </Table>
		</div>
		</div>
    );
});

class Feature extends React.Component {
	render() {
		return(
			<div>{this.props.fr.featureName + '\n'}</div>
		)
	}
}

class RolesList extends React.Component{
	render(){
		return(
			<RoleTable setSelected={this.props.setSelected} 
					   roles={this.props.roles} 
					   features={this.props.features}/>
		)
	}
}

class RolesToolbar extends React.Component{
	render(){
		return(
			<Fragment>
			    <CreateRole features_dd={this.props.features_dd} getRoles={this.props.getRoles} />
				<ModifyRole getSelected={this.props.getSelected} closeState={this.props.closeState}
							features_dd={this.props.features_dd} getRoles={this.props.getRoles} />
				<DeleteRole getSelected={this.props.getSelected} getRoles={this.props.getRoles}/>
			</Fragment>
		)
	}
}

class CreateRole extends React.Component{

	
	constructor(props){
		super(props);
		this.state = {
			role: {
				roleName:"",
                serviceID: "",
                subSystemId: "",
                lastUpdateId: "",
                luSeq: "",
			},
			status:"",
			show:false,
			role_new: {},
			features_dd:  [],
			features_sel: [],
			features_all: []
		};
		this.baseState = this.state.role;
		this.baseFeatures = this.state.features_asg;
		this.baseFeaturesdd = this.state.features_dd;
		this.handleNotification = this.handleNotification.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.getRolesCb = this.props.getRoles.bind(this);
	}
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	close() {
		this.setState({
		  show: false
		});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

    handleFeatureChange = (value) => {
		this.setState({	features_sel: value });
	};

    handleChange = (event, data) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		let role = {...this.state.role};
		role[name] = value;
		this.setState({role});
	}

	updateStatus(value){
		this.setState({status:value});
	}

	getBaseUri( link ) {
		var pathArray = link.split('/');
		var protocol = pathArray[0];
		var host  = pathArray[2];
		var url = protocol + '//' + host;
		return url;
	}
	
	handleReset() {
		this.setState({role: this.baseState});
		this.setState({features_asg: this.baseFeatures});
		this.setState({features_dd: this.baseFeaturesdd});
	}

	setRoleFeatures() {
		const role_lnk = this.state.role_new._links.self.href;
		const base_uri = this.getBaseUri(role_lnk);
		const role_id = this.state.role_new.roleId;
		const features = [];
		
		this.state.features_sel.forEach(function (item, index) {
			let feature = {_links:{self:{href:''}}};
			feature._links.self.href = base_uri + '/api/features/' + item;
			features.push(feature);
		});

		client({
			method: 'PUT', 
			path: '/api/security-roles/' + role_id + '/features',
			entity: features,
			headers: { 'Content-Type': 'text/uri-list' },
			redirect: 'follow',
		}).done(response => {
			this.setState({status:"Assign Role Successful"});
			this.handleNotification('success','role,subsystem id,features, service id has been assigned successfully');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Assign Role Failed"});
			this.handleNotification('error','assigning role has failed');
        });
	}

	handleAdd() {
		this.handleReset();
		let body = this.state.role;

		client({
				method: "POST", 
				path:'/api/security-roles', 
				entity: body,
				headers: { "Content-Type": "application/json" }
			}).done(response => {
				this.setState({role_new: response.entity}, () => { this.setRoleFeatures();});
				this.setState({status:"Role Created Successfully"});
				this.handleNotification('success','role has been created successfully including features');
				
				this.getRolesCb();
			}, response => {
				if (response.status.code === 401) {
					console.log('UNAUTHORIZED');
				}
				if (response.status.code === 403) {
					console.log('FORBIDDEN');	
				}
				this.setState({status:"Failed to Create Role"});
				this.handleNotification('error','Failed to Create Role');
		});
		this.close();
        return;
    }
	
	parseFeatures() {
		let features_dd = this.state.features_dd;
		let features_j;

		if (!this.state.features_all)
			return;

		this.state.features_all.forEach(function (item, index) {
			let feature = { 'value': item.featureId, 'label': item.featureName, 
							'role': item.featureId };
			features_j = features_dd.push(feature);
		});

		this.setState({features_dd: features_dd});
	}

	fetchAllFeatures() {
		client({method: 'GET', path: '/api/features'})
		.done(response => { 
			this.setState({features_all: response.entity._embedded.features}, 
							this.parseFeatures );
			}, 
		response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');
			}
			this.setState({isLoggedin: false});
		});
	}
	componentDidMount() {
		this.fetchAllFeatures();
	}
  render(){
        const role = this.state.role;
		const features_dd = this.state.features_dd;

	return (
		<React.Fragment>
		<Button style={tbButton} onClick={this.toggleDrawer}>Create</Button>
		<Drawer show={this.state.show} onHide={this.close}>
		<Drawer.Header> 
			<Header size='large'>Create Role</Header>
		</Drawer.Header>
		<Drawer.Body >
				<Grid columns='equal'>
			  		<Grid.Row>
			  			<Grid.Column width={2}></Grid.Column>
			  			<Grid.Column width={12}>
			  			<Form> 
				  		<Form.Field>
				  		<Grid columns='equal' width='1'>
							<Grid.Row>
								<Grid.Column>Role Name</Grid.Column>
								<Grid.Column>
									<Form.Input type='text' name='roleName' value={role.roleName} 
												onChange={this.handleChange}>
									</Form.Input>
								</Grid.Column>
							</Grid.Row>
                            <Grid.Row>
								<Grid.Column>Service ID</Grid.Column>
								<Grid.Column>
									<Form.Input type='text' name='serviceID' value={role.serviceID} 
												onChange={this.handleChange}>
									</Form.Input>
								</Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
								<Grid.Column>Sub-System ID</Grid.Column>
								<Grid.Column>
									<Form.Input type='text' name='subSystemId' value={role.subSystemId} 
												onChange={this.handleChange}>
									</Form.Input>
								</Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                            <Grid.Column>Features</Grid.Column>
                            <Grid.Column>
                                <CheckPicker
										  placeholder="Select Feature"
										  fluid
                                          data = {features_dd}
                                          onChange = {this.handleFeatureChange} />
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
						<Grid.Column>
						</Grid.Column>
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

class ModifyRole extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			role: {
				roleName:"",
                serviceID: "",
                subSystemId: "",
                lastUpdateId: "",
				luSeq: "",
			},
			role_new: {},
			show: false,
			features_dd: this.props.features_dd,
			features_sel: [],
			features_asg: [],
			status:"",
		};
		const feat_dd = this.props.features_dd;
		this.baseState = this.state.role;
		this.baseFeatures = this.state.features_asg;
		this.baseFeaturesdd = this.state.features_dd;
		this.handleNotification = this.handleNotification.bind(this);
		this.handleModify = this.handleModify.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.getRolesCb = this.props.getRoles.bind(this);
		this.fetchFeature = this.fetchFeature.bind(this);
		this.closeState = this.props.closeState.bind(this);

	}
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	handleReset() {
		this.setState({role: this.baseState});
		this.setState({features_asg: this.baseFeatures});
	}
	handleLoad() {
		const test = this.props.features_dd;
		let id = this.getSelectedCb();
		if (id == null)
			return;
		client({method: 'GET', path: '/api/security-roles/' + id}).done(response => {
			this.setState({role: response.entity});
			this.setState({isLoggedin: true});
			this.fetchFeature(id);
		},
		response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');
			}
			this.setState({isLoggedin: false});
		});
	}

	fetchFeature( id ) {
		client({method: 'GET', path: '/api/security-roles/' + id + '/features'})
		.done(response => {
			let features_j;
			let features = [];

			response.entity._embedded.features.forEach(function (item, index) {
				features_j = features.push(item.featureId);
			});
			
			this.setState({ features_asg: features });
		});
		response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		}
	}	

	getBaseUri( link ) {
		var pathArray = link.split('/');
		var protocol = pathArray[0];
		var host  = pathArray[2];
		var url = protocol + '//' + host;
		return url;
	}

	setRoleFeatures() {
		const role_lnk = this.state.role_new._links.self.href;
		const base_uri = this.getBaseUri(role_lnk);
		const role_id = this.state.role_new.roleId;
		const features = [];

		this.state.features_sel.forEach(function (item, index) {
			let feature = {_links:{self:{href:''}}};
			feature._links.self.href = base_uri + '/api/features/' + item;
			features.push(feature);
		});

		client({
			method: 'PUT', 
			path: '/api/security-roles/' + role_id + '/features',
			entity: features,
			headers: { 'Content-Type': 'text/uri-list' },
			redirect: 'follow',
		}).done(response => {
			this.setState({status:"Assign Role Successful"});
			this.handleNotification('success','updating role and features successfully');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Assign Role Failed"});
			this.handleNotification('error','updating role and features have Failed');
        });
	}

	handleModify() {
		let id = this.getSelectedCb();
		let body = this.state.role;
		delete body.id;

		client({
			method: 'PATCH', 
			path: '/api/security-roles/' + id, 
			entity: body, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.setState({role_new: response.entity}, () => { this.setRoleFeatures();});
			this.setState({status:"Role Update Successful"});
			this.handleNotification('success','Role Update Successful');
			this.handleReset();
			this.getRolesCb();
			this.closeState();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Failed to Modify"});
			this.handleNotification('error','Failed to Modify');
		});
		this.close();
		return;
	}

	handleFeatureChange = (value) => {
		this.setState({	features_sel: value });
	};

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let role = {...this.state.role};
		role[name] = value;
		this.setState({role});
	}

	updateStatus(value){
		this.setState({status:value});
	}

	close() {
		this.setState({
		  show: false
		});
		this.handleReset();
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	render(){
        const {role} = this.state;
		const features_dd = this.state.features_dd;
		const features_asg = this.state.features_asg;

	    return (
		<React.Fragment>
			
		<Button style={tbButton} onClick={this.toggleDrawer}>Modify</Button>
		<Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
		<Drawer.Header>
			<Header size='large' content='Modify Role'/>
		</Drawer.Header>	
		  <Drawer.Body >
				<Grid columns='equal'>
			  		<Grid.Row>
			  			<Grid.Column width={2}></Grid.Column>
			  			<Grid.Column width={12}>
			  			<Form> 
						<Form.Field>
				  		<Grid columns='equal' width='1'>
				  		<Grid.Row>
					  		<Grid.Column>Role Name</Grid.Column>
					  		<Grid.Column>
								<Form.Input type='text' name='roleName' value={role.roleName} 
											onChange={this.handleChange}>
								</Form.Input>
					  		</Grid.Column>
				  		</Grid.Row>
				  		<Grid.Row>
					  		<Grid.Column>Service ID</Grid.Column>
					  		<Grid.Column>
							<Form.Input type='text' name='serviceID' value={role.serviceID} 
						  				onChange={this.handleChange}>
							</Form.Input>
					  		</Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
					  		<Grid.Column>Sub-System ID</Grid.Column>
					  		<Grid.Column>
							<Form.Input type='text' name='subSystemId' value={role.subSystemId} 
						  				onChange={this.handleChange}>
							</Form.Input>
					  		</Grid.Column>
                          </Grid.Row>
						  <Grid.Row>
					  		<Grid.Column>Features</Grid.Column>
                            <Grid.Column width={16}>
								{features_asg.length == 0 ? '' :
								<CheckPicker 
										  placeholder='Features' 
										  fluid
										  data = {features_dd}
										  defaultValue = {features_asg}
										  onChange = {this.handleFeatureChange} />
								}
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
					<Grid.Column>
					</Grid.Column>
					<Grid.Column>
						<Button onClick={this.handleModify.bind(this)} icon style={tbButton}  
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

class DeleteRole extends React.Component {
    constructor(props){
		super(props);
		this.state = {
			status:"",
			showModal: false
		};
		this.handleNotification = this.handleNotification.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.getRolesCb = this.props.getRoles.bind(this);
	}
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	openModal = ()=> {
		this.setState({showModal: true})
	}

	closeModal = () => {
		this.setState({ showModal: false })
	}

	handleDelete() {
		let id = this.getSelectedCb();
		this.onDelete(id);
		this.closeModal();
		return;
	}

	onDelete(id) {
		client({method: 'DELETE', path: '/api/security-roles/' + id}).done(response => {
			this.setState({status:"Deleted Successful"});
			this.handleNotification('success','Role Deleted Successfully');
			this.getRolesCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Deleted Failed"});
			this.handleNotification('error','Deletion failed');
		});

	}

	handleChange(value){
		this.setState({status:value});
	}
	
    render() {
        return (
        <Modal  dimmer='inverted' open={this.state.showModal} onClose={this.closeModal} 
				trigger={<Button style={tbButton} onClick={this.openModal}>Delete </Button>}>
            <Modal.Header>Delete Role</Modal.Header>
                <Modal.Content>
					<Grid columns='equal'>
						<Grid.Row>
							<p>Are you sure you want to delete this Role</p>
						</Grid.Row>
						<Grid.Row></Grid.Row>
						<Grid.Row>
							<Grid.Column>
							</Grid.Column>
							<Grid.Column>
								<Button style={tbButton}
										content='Yes'
										labelPosition='left'
										icon='checkmark'
										floated='right'
										onClick={this.handleDelete.bind()}
								/>
								<Button style={tbButton} content='No'
										labelPosition='right'
										icon='x'
										floated='right'
										onClick={this.closeModal}
								/>
							</Grid.Column>
						</Grid.Row>
					</Grid>
            </Modal.Content>
        </Modal>
    );
  }
}

export default Role;