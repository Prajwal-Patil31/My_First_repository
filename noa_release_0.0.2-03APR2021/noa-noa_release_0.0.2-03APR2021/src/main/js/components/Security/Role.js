/**@module Role*/
import React, { Fragment, useEffect, useState } from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';

import  BreadCrumb from '../Widgets/BreadCrumb';

import { Notification, Drawer, CheckPicker } from 'rsuite';

import * as yup from 'yup';

import {
	Grid, 
	Segment,
	Modal,
	Button,
	Header, 
	Table, 
	Form,
	Checkbox, 
	Divider,
	Container,
	Accordion,
	Icon
} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import { noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants';

import { Formik } from 'formik';

const client = require('../../utils/client');

/**
 * Component for Role Management. implements functionality to
 * fetch roles and perform operations on them.
 * 
 * @class
 * @augments React.Component
*/
class Role extends React.Component {

	 /**
     * Role constructor. Initializes state to hold Role, Feature Records
     * and user selections.
     * 
     * @constructor
     * @param {*} props 
    */
	constructor(props) {
		super(props);
		this.state = {
			roles : [],
			selected : [],
			features_all : [],
			features_dd : [],
			role_features : [],
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

    /**
     * Updates the component state with the list of Role Items selected by the User.
     * A callback passed to and invoked by {@link RoleTable}.
     * 
     * @param {Object} items Keyed object where the key is a specified id of the item in the list.
    */
	setSelected(items) {
		let sel = Object.keys(items);
		let id;
		if (Array.isArray(sel) && sel.length) {
			let rid = this.state.roles[sel[0]].roleId;
			id = parseInt(rid);
		}
		if (sel.length<2) {
			this.setState({
				selected: update(this.state.selected, {[0]: { $set: id }})
			}, this.selectUpdateDone );
		}
		else {
			alert("Operations with multi-select is not implemented");
			return null;
		}
	}

	/**
     * Gets the list of User selected Role Items to operate upon.
     * A callback passed to the children of {@link RolesToolbar}.
     * 
     * @returns {Array} Array of IDs of selected items.
    */
	getSelected () {
		if (this.update != true) {
			console.log('State update is pending');	
			return null;
		} else {
			return this.state.selected[0];
		}
	}
	
	/**
	 * Iterates to get the Features of Each Role.
	 * 
	*/
	fetchRoleFeatures() {
		const len = this.state.roles.length;
		for (let roleno = 0; roleno < len; roleno++) {
			this.fetchFeature( roleno );
		}
	}

	/**
	 * Makes a REST request to fetch the Features specific to a Role. 
	 * @param {Number} index index of the role.
	 * 
	*/
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

	/**
	 * Clears the state with List of Features.
	 * A callback passed to and invoked by {@link RolesToolbar}
	 * 
	*/
	closeState() {
		this.setState({features_dd: []});
	}

	/**
	 * Parses the list of Features to be rendered in Check Picker.
	 * 
	*/
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

	/**
	 * Makes a REST request and gets the List of All Features
	 * and updates component's State.
	 * 
	*/
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
		});
	}

	/**
	 * Makes a REST request and gets the all the Roles with Pagination
	 * and updates the component's State.
	 * Also invokes fetching all Features and Fetching Features specific to a Role.
	 * 
	*/
	getRoles() {
	client({method: 'GET', path: '/api/security-roles'}).done(response => { 
		this.setState({roles: response.entity._embedded["security-roles"]}, () => {
			this.fetchRoleFeatures(); 
			this.fetchAllFeatures(); 
		});
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
		this.getRoles();
    }

	/**
     * Renders Roles component view invoking child components {@link RolesToolbar} 
     * and {@link RolesList} with Roles fetched on component mount.
	 * 
    */
	render() {
		const roles = this.state.roles;
		const role_features = this.state.role_features;
		const features_dd = this.state.features_dd;		
		
		return (
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
									<RolesList  roles={roles} features={role_features} 
												setSelected={this.setSelected} 
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

/**
 * Component for rendering the Role Management toolbar. Child of {@link Role}.
 * 
 * @class
 * @augments React.Component
*/
class RolesToolbar extends React.Component {
	render() {
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

/**
 * Component for rendering list of Roles. Child of {@link Role}.
 * 
 * @class
 * @augments React.Component
*/
class RolesList extends React.Component {
	render() {
		return(
			<RoleTable setSelected={this.props.setSelected} 
					   roles={this.props.roles} 
					   features={this.props.features}/>
		)
	}
}

/**
 * Renders a tabular view of Roles with data passed from {@link Role} component. 
 * Implements selection mechanism through withSelections() hook.
 * 
 * @prop {ReactNode} props Callbacks exposed by withSelections() hook.
 * @prop {Function} setSelected Callback to update parent's state with a list of selected Roles.
 * @prop {Array} features List of all Features to be rendered.
 * @prop {Array} roles List of all Roles to be rendered.
 * @returns {jsx} Rendered tabular view of Roles.
*/
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

	/**
     * @callback setSelected Update state with the list of Roles selected by the User.
    */
	const setSelected = props.setSelected;

	/** 
     * List of Roles to be rendered.
     * @type {Array}
    */
	const roles = props.roles;
	 
	/** 
     * List of Features to be rendered.
     * @type {Array}
    */
	const features = props.features;

	const [activeIndex,setActiveIndex]  = useState(0);

	function handleSelectLocal (roleId) {
		handleSelect(roleId);
	}

	/**
	 * Updates the Active Index in Accordion.
	 * @param {*} e  
	 * @param {*} titleProps 
	*/
	const handleClick = (e, titleProps) => {
		const index  = titleProps.index
		const newIndex = activeIndex === index ? -1 : index
		setActiveIndex(newIndex);
	}

	/**
     * Handles the side effect of changed selections and updates the parent State 
     * with modified set of selected Roles.
    */
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

/**
 * Renders Feature Name for a Role.
 * Child of {@link RoleTable}.
 * 
 * @class
 * @augments React.Component
*/
class Feature extends React.Component {
	render() {
		return(
			<div>{this.props.fr.featureName + '\n'}</div>
		)
	}
}

let roleSchema = yup.object().shape({
	roleName: yup.string()
					.min(4, "Too Short.")
					.max(20,"Too Long")
					.required("Role Name is a Required Field."),
	serviceID: yup.string()
					.required("Servivce ID is a Required Field")
					.max(6,"Service ID should not exceed more than 6 digits"),
	subSystemId:yup.string()
					.required("SubSystem ID id Required")
					.max(4,"Shoul not exceed more than 4 digits")
})

/**
 * Component for rendering the Button & Drawer views for Creating New Role.
 * Child of {@link RolesToolbar}.
 * 
 * @class
 * @augments React.Component
*/
class CreateRole extends React.Component {
	
	/**
     * Initializes state to Create new Role.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
    */
	constructor(props){
		super(props);
		this.state = {
			role: {
				roleName :"",
                serviceID : "",
                subSystemId : "",
                lastUpdateId : "",
				luSeq : "",
			},
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

	/**
     * Displays the status of user performed operation.
     * 
     * @param {Notification.title} funcName {@link Notification} API to be invoked.
     * @param {Notification.description} description The message to be rendered.
    */
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	close() {
		this.setState({show: false});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	/**
	 * Gets the List of Selected Features and updates
	 * component's State.
	 * 
	 * @param {number} value Index of Selected Feature.
	*/
    handleFeatureChange = (value) => {
		this.setState({	features_sel: value });
	};

	/**
	 * Updates the changed values from input in component's State.
	 * @param {*} event 
	 * @param {*} data 
	*/
    handleChange = (event, data) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		let role = {...this.state.role};
		role[name] = value;
		this.setState({role});
	}

	getBaseUri( link ) {
		var pathArray = link.split('/');
		var protocol = pathArray[0];
		var host  = pathArray[2];
		var url = protocol + '//' + host;
		return url;
	}
	
	/**
	 * Clears the component's State.
	*/
	handleReset() {
		this.setState({role: this.baseState});
		this.setState({features_asg: this.baseFeatures});
	}
	
	/**
     * Performs a REST request to Assign the Features to a Role.
    */
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
			this.handleNotification('success','role,subsystem id,features, service id has been assigned successfully');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','assigning role has failed');
        });
	}

 	/**
     * Performs a REST request to Create a New Role.
	 * Also fetches the updated list of Roles.
	 * 
    */
	handleAdd() {
		let body = this.state.role;
		client({
				method: "POST", 
				path:'/api/security-roles', 
				entity: body,
				headers: { "Content-Type": "application/json" }
			}).done(response => {
				this.setState({role_new: response.entity}, () => { this.setRoleFeatures();});
				this.handleNotification('success','role has been created successfully including features');				
				this.getRolesCb();
				this.handleReset();
			}, response => {
				if (response.status.code === 401) {
					console.log('UNAUTHORIZED');
				}
				if (response.status.code === 403) {
					console.log('FORBIDDEN');	
				}
				this.handleNotification('error','Failed to Create Role');
		});
		this.close();
        return;
	}

	handleAddrole(values) {
		this.setState({role:values});
		this.handleAdd();
	}

	/**
	 * Parses the list of Features to be rendered in Check Picker.
	 * 
	*/
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

	/**
	 * Makes a REST request to fetch the List of All Features
	 * and updates component's State.
	 * 
	*/
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
		});
	}

	componentDidMount() {
		this.fetchAllFeatures();
	}
	
	/**
     * Renders a Button view to initiate Create Role operation and 
     * the Drawer view to Enter Details of the Role.
	 * 
    */
  	render() {
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
			<Formik
				initialValues={role}
				validationSchema={roleSchema}
				onSubmit={(values) => {
					this.handleAddrole(values);
				}}
			>
			{({
				values,
				errors,
				touched,
				isSubmitting,
				handleChange,
				handleSubmit,
			}) => (
				<Grid columns='equal'>
					<Grid.Row>
						<Grid.Column width={2}></Grid.Column>
						<Grid.Column width={12}>
						<Form onSubmit={handleSubmit}> 
						<Form.Field>
						<Grid columns='equal' width='1'>
							<Grid.Row>
								<Grid.Column>Role Name</Grid.Column>
								<Grid.Column>
									<Form.Input type='text' name='roleName' value={values.roleName} 
												onChange={handleChange}>
									</Form.Input>
									<p style={{fontSize: '12pxl', color: "red"}}>
										{errors.roleName 
										&& touched.roleName 
										&& errors.roleName}
									</p>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Service ID</Grid.Column>
								<Grid.Column>
									<Form.Input type='text' name='serviceID' value={values.serviceID} 
												onChange={handleChange}>
									</Form.Input>
									<p style={{fontSize: '12pxl', color: "red"}}>
										{errors.serviceID 
										&& touched.serviceID 
										&& errors.serviceID}
									</p>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Sub-System ID</Grid.Column>
								<Grid.Column>
									<Form.Input type='text' name='subSystemId' value={values.subSystemId} 
												onChange={handleChange}>
									</Form.Input>
									<p style={{fontSize: '12pxl', color: "red"}}>
										{errors.subSystemId 
										&& touched.subSystemId 
										&& errors.subSystemId}
									</p>
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
						<Grid.Row></Grid.Row>
						<Grid.Row></Grid.Row>
						<Grid.Row>
						<Grid.Column>
						</Grid.Column>
							<Button type='submit' icon style={tbButton}  
									content='Submit'>
							</Button>
							<Button onClick={this.close} icon style={tbButton}  
									floated='right' content='Cancel'
									type='button'>
							</Button>
						<Grid.Column></Grid.Column>
					</Grid.Row>
						</Form>
						</Grid.Column>
						<Grid.Column width={2}></Grid.Column>
					</Grid.Row>
				</Grid>
			)}
			</Formik>
			</Drawer.Body>
			</Drawer>
		</React.Fragment>  
		);
  	}
}

/**
 * Component for rendering the Button & Drawer views for Modifying existing Role.
 * Child of {@link RolesToolbar}.
 * 
 * @class
 * @augments React.Component
*/
class ModifyRole extends React.Component {

	/**
     * Initializes state to hold Record for the selected Role.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
    */
	constructor(props){
		super(props);
		this.state = {
			role: {
				roleId : "",
				roleName : "",
                serviceID : "",
                subSystemId : "",
                lastUpdateId : "",
				luSeq : "",
			},
			role_new : {},
			show: false,
			features_dd : this.props.features_dd,
			features_sel : [],
			features_asg : [],
		};

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

	/**
     * Displays the status of user performed operation.
     * 
     * @param {Notification.title} funcName {@link Notification} API to be invoked.
     * @param {Notification.description} description The message to be rendered.
    */
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	/**
	 * Clears the component's State.
	*/
	handleReset() {
		this.setState({role: this.baseState});
		this.setState({features_asg: this.baseFeatures});
	}

	/**
     * Performs a REST request to fetch the details of the User selcted Role
     * for display in the Drawer.
     * 
     * @returns {void} On invalid selection.
    */
	handleLoad() {
		const test = this.props.features_dd;
		let id = this.getSelectedCb();
		if (id == null)
			return;
		client({method: 'GET', path: '/api/security-roles/' + id}).done(response => {
			this.setState({role: response.entity});
			this.fetchFeature(id);
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

	/**
	 * Makes a REST request to fetch the Features specific to a Role. 
	 * @param {number} id ID of the role.
	 * 
	 */
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

	/**
     * Performs a REST request to Assign the Features to a Role.
     */
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
			this.handleNotification('success','updating role and features successfully');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','updating role and features have Failed');
        });
	}

  	/**
     * Performs a REST request to Modify the User selcted Role.
	 * Also fetches the updated list of Roles.
	 * 
     */
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
			this.handleNotification('error','Failed to Modify');
		});
		this.close();
		return;
	}

	handleModifyrole(values) {
		this.setState({role:values});
		this.handleModify();
	}

	/**
	 * Gets the List of Selected Features and updates
	 * component's State.
	 * 
	 * @param {number} value Index of Selected Feature.
	*/
	handleFeatureChange = (value) => {
		this.setState({	features_sel: value });
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let role = {...this.state.role};
		role[name] = value;
		this.setState({role});
	}

	close() {
		this.setState({show: false});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	/**
     * Renders a Button view to initiate Modify operation on selected Role and 
     * the Drawer view to display the user selected Role Details.
    */
	render() {
        const role = this.state.role;
		const features_dd = this.state.features_dd;
		const features_asg = this.state.features_asg;
	    return (
		<React.Fragment>	
		<Button style={tbButton} onClick={this.toggleDrawer}>Modify</Button>
		<Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
		<Drawer.Header>
			<Header size='large' content='Modify Role'/>
		</Drawer.Header>	
		  <Drawer.Body>
		{role.roleId ? 
		<Formik
			initialValues={role}
			validationSchema={roleSchema}
			onSubmit={(values) => {
				this.handleModifyrole(values);
			}}
		>  
		{({
			values,
			errors,
			touched,
			isSubmitting,
			handleChange,
			handleSubmit,
		}) => (
			<Grid columns='equal'>
				<Grid.Row>
					<Grid.Column width={2}></Grid.Column>
					<Grid.Column width={12}>
					<Form onSubmit={handleSubmit}> 
					<Form.Field>
					<Grid columns='equal' width='1'>
					<Grid.Row>
						<Grid.Column>Role Name</Grid.Column>
						<Grid.Column>
							<Form.Input type='text' name='roleName' value={values.roleName} 
										onChange={handleChange}>
							</Form.Input>
						<p style={{fontSize: '12pxl', color: "red"}}>
							{errors.roleName 
							&& touched.roleName 
							&& errors.roleName}
						</p>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column>Service ID</Grid.Column>
						<Grid.Column>
						<Form.Input type='text' name='serviceID' value={values.serviceID} 
									onChange={handleChange}>
						</Form.Input>
						<p style={{fontSize: '12pxl', color: "red"}}>
							{errors.serviceID 
							&& touched.serviceID 
							&& errors.serviceID}
						</p>
						</Grid.Column>
						</Grid.Row>
						<Grid.Row>
						<Grid.Column>Sub-System ID</Grid.Column>
						<Grid.Column>
						<Form.Input type='text' name='subSystemId' value={values.subSystemId} 
									onChange={handleChange}>
						</Form.Input>
						<p style={{fontSize: '12pxl', color: "red"}}>
							{errors.subSystemId 
							&& touched.subSystemId 
							&& errors.subSystemId}
						</p>
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
					<Grid.Row></Grid.Row>
					<Grid.Row></Grid.Row>
					<Grid.Row>
						<Grid.Column>
						</Grid.Column>
						<Grid.Column>
							<Button type='submit' icon style={tbButton}  
									content='Submit'>
							</Button>
							<Button onClick={this.close} icon style={tbButton}  
									floated='right' content='Cancel'>
							</Button>
						</Grid.Column>
						<Grid.Column></Grid.Column>
					</Grid.Row>
				</Form>
				</Grid.Column>
				<Grid.Column width={2}></Grid.Column>
			</Grid.Row>
			
		</Grid>
		)}
		</Formik> : <p>Selection not Made</p>}
		</Drawer.Body>
		</Drawer>
		</React.Fragment>  
	    );
	}
}

/**
* Component for rendering the Button & Modal views for Deleting a Role.
 * Child of {@link RolesToolbar}.
 * 
 * @class
 * @augments React.Component
*/
class DeleteRole extends React.Component {

	/**
     * Initializes state to hold Record for the selected Role.
     * Also initializes handlers for Modal control.
     * 
     * @constructor
     * @param {*} props 
    */
    constructor(props) {
		super(props);
		this.state = {
			showModal : false
		};
		this.handleNotification = this.handleNotification.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.getRolesCb = this.props.getRoles.bind(this);
	}

	/**
     * Displays the status of user performed operation.
     * 
     * @param {Notification.title} funcName {@link Notification} API to be invoked.
     * @param {Notification.description} description The message to be rendered.
    */
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

	/**
     * Invokes a REST request to Delete the User selcted Role.
     * Also fetches the updated list of Roles.
     * 
     * @param {Number} id ID of the Role
    */
	onDelete(id) {
		client({method: 'DELETE', path: '/api/security-roles/' + id}).done(response => {
			this.handleNotification('success','Role Deleted Successfully');
			this.getRolesCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','Deletion failed');
		});

	}

	/**
     * Renders a Button view to initiate Delete operation on selected Role and 
     * the Modal view to seek User confirmation.
    */
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