/**@module UserSecurity*/
import React, {Fragment, useEffect, useState} from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';

import BreadCrumb from'../Widgets/BreadCrumb';

import { Notification, Drawer } from 'rsuite';

import { 
	Grid, 
	Segment, 
	Container, 
	Modal, 
	Button, 
	Header, 
	Checkbox, 
	Dropdown, 
	Divider,
	Form, 
	Tab,
    Table,
	Label, 
} from 'semantic-ui-react';
	
import 'semantic-ui-css/semantic.min.css';

import { noBorder, noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants';

import { Formik } from 'formik';
import * as yup from 'yup';

const client = require('../../utils/client');


/**
 * Component for Security; Implements functionality for 
 * fetching Users and performing operations on them.
 * 
 * @class
 * @augments React.Component
 */
class UserSecurity extends React.Component {

	 /**
     * UserSecurity constructor. Initializes state to hold User Records
     * and user selections.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
		super(props);

		this.state = {
            users : [],
            selected : [], 
			user_role : [],
			user_policy : [],
			role_selected : 0,
			policy_selected : 0,
			roles_all : [],
			policies_all : [],
			roles_dd : [],
			policies_dd : [],
		};

        this.setSelected = this.setSelected.bind(this);
		this.getSelected = this.getSelected.bind(this);
		this.getUsers = this.getUsers.bind(this);
        const updated =  false;
	}

	/**
	 * Parses the list of Roles to be rendered in Check Picker.
	 */
	parseRoles() {
		let roles_dd = this.state.roles_dd;
		let roles_j;

		if (!this.state.roles_all)
			return;

		this.state.roles_all.forEach(function (item, index) {
			let role = { 'key': item.roleId, 'text': item.roleName, 'value': item.roleId };
			roles_j = roles_dd.push(role);
		});

		this.setState({roles_dd: roles_dd });
	}

	/**
	 * Parses the list of Policies to be rendered in Check Picker.
	 */
	parsePolicies() {
		let policies_dd = this.state.policies_dd;
		let policies_j;

		if (!this.state.policies_all)
			return;

		this.state.policies_all.forEach(function (item, index) {
			let policy = { 'key': item.roleId, 'text': item.policyName, 'value': item.policyId };
			policies_j = policies_dd.push(policy);
		});

		this.setState({policies_dd: policies_dd });
	}

	/**
	 *  Performs a REST query to get the list of Roles to assign a User.
	 */
	fetchAllRoles() {
		client({method: 'GET', path: '/api/security-roles/'}).done(response => {
			this.setState({	roles_all : response.entity._embedded["security-roles"] }, 
				this.parseRoles );
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');
			}
		});
	}

	/**
	 * Performs a REST query to get the list of Policies to assign a User.
	 */
	fetchAllPolicies() {
		client({method: 'GET', path: '/api/security-policies-password/'}).done(response => {
			this.setState({	policies_all: response.entity._embedded["security-policies-password"] }, 
				this.parsePolicies );
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');
			}
		});
	}

    selectUpdateDone () {
		this.updated = true;
	}
    
	 /**
     * Updates the component state with the list of Users selected by the User.
     * A callback passed to and invoked by {@link UserTable}.
     * 
     * @param {Object} items Keyed object where the key is a specified id of the item in the list.
     */
	setSelected (items) {		
		let sel = Object.keys(items);
		let id;
		if (Array.isArray(sel) && sel.length) {
			let rid = this.state.users[sel[0]].accountId;
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
     * Gets the list of selected User to operate upon.
     * A callback passed to the children of {@link UserToolbar}.
     * 
     * @returns {Array} Array of IDs of selected items.
     */
	getSelected () {
		if (this.updated != true) {
			console.log('State update is pending');	
			return null;
		} else {
			return this.state.selected[0];
		}
	}

	/**
	 * Iterates to get the Roles of Each User.
	 * 
	*/
	fetchUserRoles() {
		const len = this.state.users.length;
		for(let userno = 0; userno < len; userno++) {
			this.fetchUserRole(userno);
		}
	}

	/**
	 * Iterates to get the Pilicies of Each User.
	 * 
	*/
	fetchUserPolicies() {
		const len = this.state.users.length;
		for(let userno = 0; userno < len; userno++) {
			this.fetchUserPolicy(userno);
		}
	}
	/**
	 * Performs a REST query to get the User Role assigned to the User.
	 * @param {*} index 
	 */
	fetchUserRole(index) {
		let id = this.state.users[index].accountId;

		client({method: 'GET', path: '/api/security-users/' + id + '/role'}).done(response => {
			var roles = this.state.user_role.slice();
			roles.splice(index, 0, response.entity);

			this.setState({ user_role: roles }, () => { } );
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');
			}
		});
	}

	/**
	 * Performs a REST query to get the User Password Policy assigned to the User.
	 * @param {*} index 
	 */
	fetchUserPolicy( index ) {
		let id = this.state.users[index].accountId;

		client({method: 'GET', path: '/api/security-users/' + id + '/policy'}).done(response => {
			var policies = this.state.user_policy.slice();
			policies.splice(index, 0, response.entity);

			this.setState({	user_policy: policies }, () => { } );
			
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');
			}
		});
	}

	 /**
     * Makes a REST request to fetch User Records with Pagination 
     * and updates the component's State.
     */
	getUsers() {
		client({method: 'GET', path: '/api/security-users'}).done(response => {
			this.setState({users: response.entity._embedded["security-users"]}, () => { 
					this.fetchUserRoles(); this.fetchUserPolicies(); 
					this.fetchAllRoles(); this.fetchAllPolicies(); 
			});
		}, response => {
			if (response.status.code === 302) {
				console.log('REDIRECT');
			}
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');
			}
		});
	}
	
	componentDidMount() {
		this.getUsers();
    }

	/**
     * Renders User component view invoking child components {@link UserToolbar} 
     * and {@link UserList} with User Records fetched on component mount.
     */
    render() {
        const users = this.state.users;
		const user_role = this.state.user_role;
		const user_policy = this.state.user_policy;

        return (
		<Container>
			<Grid style={noBoxShadow} centered verticalAlign='middle'>
				<Grid.Row style={noBoxShadow}>
					<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Segment style={noBoxShadow}>
							<Grid columns={3} verticalAlign='middle'>
								<Grid.Column width={4} verticalAlign='middle' textAlign='left'>
									{<BreadCrumb/>}
									<Header size='medium'>User Administration</Header>
								</Grid.Column>
								<Grid.Column width={5} verticalAlign='middle' textAlign='left'>
								</Grid.Column>
								<Grid.Column width={7} textAlign='right' verticalAlign='middle'>
									<UserToolbar getSelected={this.getSelected} 	
												roles_dd={this.state.roles_dd} 
												policies_dd={this.state.policies_dd}
												getUsers={this.getUsers}/>
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
									<UserList users={users}
											setSelected={this.setSelected}
											roles={user_role}
											policies={user_policy}
											getUsers={this.getUsers}
									/>
								</Grid.Column>
							</Grid>
						</Segment>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
        );
	}
}

/**
 * Renders a Role name for the User.
 * Child of {@link UserTable}.
 * 
 * @class
 * @augments React.Component
 */
class Roles extends React.Component {
	render() {
		return (
			<div>{this.props.ur ? this.props.ur.roleName + '\n' : ''}</div>
		)
	}
}

/**
 * Renders a Password Policy name for the User
 * Child of {@link UserTable}
 * 
 * @class
 * @augments React.Component
 */
class Policies extends React.Component {
	render() {
		return (
			<div>{this.props.up ? this.props.up.policyName + '\n' : ''}</div>
		)
	}
}

/**
 * Component for rendering list of Users. Child of {@link UserSecurity}.
 * 
 * @class
 * @augments React.Component
 */
class UserList extends React.Component {
	render() {
	  return <UserTable setSelected={this.props.setSelected}
		  				users={this.props.users}
						roles={this.props.roles}
						policies={this.props.policies}
						getUsers={this.props.getUsers}
			/>;
	}
}

/**
 * Renders a tabular view of User Records with data passed from {@link UserSecurity} component. 
 * Implements selection mechanism though withSelections() hook.
 * 
 * @prop {ReactNode} props Callbacks exposed by withSelections() hook.
 * @prop {Function} setSelected Callback to update parent's state with a list of selected User Items.
 * @prop {Array} users List of Users Records to be rendered.
 *  @prop {Array} roles List of Users roles Records to be rendered.
 *  @prop {Array} policies List of Users policies Records to be rendered.
 * @return {JSX} Rendered tabular view of User Records.
 */
const UserTable = withSelections((props) =>{
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
     * @callback setSelected Update state with the list of User Items selected by the User.
     */
	const setSelected = props.setSelected;

	const getUsersCb = props.getUsers;
	/** 
     * List of User Records to be rendered.
     * @type {Array}
     */
	const users = props.users;
	
	const [status, setStatus] = useState({userStatus : {acStatus: false, userId : null}});

	const roles = props.roles;
	const policies = props.policies;

	function handleSelectLocal (id) {
		handleSelect(id);
	}

	React.useEffect(() => {
		/* const body = JSON.stringify(status.userStatus.acStatus); */
		const body = {acStatus : status.userStatus.acStatus};
		client({
			method: 'PATCH', 
			path: '/api/security-users/' + status.userStatus.userId, 
			entity: body, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			getUsersCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
		}); 
	}, [status]);

	const changeAccountStatus = (acStatus, id) => {
		const newStatus = {acStatus : !acStatus, userId : id};
		setStatus({userStatus: newStatus});
	}

	/**
     * Handles the side effect of changed selections and updates the parent State 
     * with modified set of selected User Items.
     */
	useEffect(() => {
		setSelected(selections);
	}, [props.selections]);
	
	if (!users && !users.length)
		return null;

	return (
		<div>
		<Container className='content-header' textAlign='right'>
		</Container>
		<Container className='content-body'>
			<Segment basic textAlign="left" style={segmentStyle}>
				{!areAnySelected}
				<div style={{ visibility: areAnySelected ? 'visible' : 'hidden' }}>
				<span style={{marginRight: '8px'}}>{selectedCount} selected</span>
				<Button basic onClick={handleClearAll}>Clear</Button>
				</div>
				<div>
				<span>{users.length} Members</span>
				</div>
			</Segment>
			<div className = 'table-hscroll'>
			<Table striped style={stdTable}>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell width={1}>
						</Table.HeaderCell>
                        <Table.HeaderCell>User Id</Table.HeaderCell>
                        <Table.HeaderCell width={5}>Roles</Table.HeaderCell>
						<Table.HeaderCell width={5}>Password Policy</Table.HeaderCell>
						<Table.HeaderCell>Activation Date</Table.HeaderCell>
                        <Table.HeaderCell>Expiry Date</Table.HeaderCell>
						<Table.HeaderCell width={2}>Status</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
				{users.map((user, index) => (
					<Table.Row key = {users.indexOf(user)}>
						<Table.Cell>
							<Checkbox checked={isItemSelected(users.indexOf(user))} 
										onChange={handleSelectLocal.bind(this, users.indexOf(user))}/>
						</Table.Cell>
                        <Table.Cell>{user.username}</Table.Cell>
						<Table.Cell>
							{typeof roles[index] == 'undefined' ?
								<b/> : <Roles ur={roles[index]}/> }
						</Table.Cell>
						<Table.Cell>
							{typeof policies[index] == 'undefined' ?
								<b/> : <Policies up={policies[index]}/> }
						</Table.Cell>
						<Table.Cell>{user.activationDate}</Table.Cell>
                        <Table.Cell>{user.expiryDate}</Table.Cell>
                        <Table.Cell>
							<Checkbox toggle
								checked={user.acStatus}
								onChange={() =>{
									const id = user.accountId;
									const acStatus = user.acStatus;
									changeAccountStatus(acStatus,id);
								}}
							/>
						</Table.Cell>
						
					</Table.Row>
				))}
				</Table.Body>
				<Table.Footer>
				</Table.Footer>				
			</Table>
			</div>
		</Container>
	</div>
	)   
});

/** 
 * Component for rendering the User Administration toolbar. Child of {@link UserSecurity}.
 * 
 * @class
 * @augments React.Component
*/
class UserToolbar extends React.Component {
	render() {
	const roles_dd=this.props.roles_dd;
	const policies_dd=this.props.policies_dd;

	return (      
		<Fragment>
			<CreateUser roles_dd={roles_dd} policies_dd={policies_dd} 
						getUsers={this.props.getUsers}
			/> 
			<ModifyUser roles_dd={roles_dd} policies_dd={policies_dd} 
						getSelected={this.props.getSelected}
						getUsers={this.props.getUsers}
			/>			
			<DeleteUser getSelected={this.props.getSelected} 
						getUsers={this.props.getUsers}
			/>
		</Fragment>
		);
	}
}

/* const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/ */

let userValidationSchema = yup.object().shape({
	username: yup.string()
				.min(4, "Too Short.")
				.required("Username is a Required Field."),
	password: yup.string()
				.min(6, "Too Short.")
				.required("Password is a Required Field."),
	firstName: yup.string().required("First Name is a Required Field."),
	lastName: yup.string().required("Last Name is a Required Field."),
	email: yup.string()
				.email("Invalid Email.")
				.required("Email is a Required Field."),
	mobileNo: yup.string()
				.min(10, "Invalid Mobile Number")
				.required("Mobile Number is a Required Field."),
})

/**
 * Component for rendering the Button & Drawer views to create User.
 * Child of {@link UserToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class CreateUser extends React.Component {

	/**
     * Add Record for new User.
     * initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
			user : 
			{
				accId : "",
				username :"",
				password :"",
				firstName :"",
				lastName :"",
				middleInitial : "",
				email : "",
				mobileNo :"",
				role :"",
				policy :"",
				acStatus: true
			},
			show : false,
			roles_sel : [],
			policies_sel : [],
			user_new: {
			},
			roles_dd : this.props.roles_dd,
			policies_dd : this.props.policies_dd,
		}

		this.baseState = this.state.user;
		this.handleNotification = this.handleNotification.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.getUsersCb = this.props.getUsers;
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	close() {
		this.setState({show: false});
	}
	
	/**
	 * Gets the List of Roles and updates component's State.
	 * 
	 * @param {*} e 
	 */
	handleRoleChange = (e, {value}) => {
		const role_id = value;
		this.setState({roles_sel: role_id});
	}

	/**
	 * Gets the List of Policies and updates component's State.
	 * 
	 * @param {*} e 
	 */
	handlePolicyChange = (e, {value}) => {
		const policy_id = value;
		this.setState({policies_sel: policy_id})
	}  

	handleChange = (event,data) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		let user = {...this.state.user};

		if(data.type == 'checkbox') {
			user[data.name] = data.checked;
		} else {
			user[name] = value;
		}
		
		this.setState({user});
	};

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

	getBaseUri( link ) {
		var pathArray = link.split('/');
		var protocol = pathArray[0];
		var host  = pathArray[2];
		var url = protocol + '//' + host;
		return url;
	}

	/**
	 * Assign selected Role to the User.
	 * @param {*} accId 
	 */
	AssignRole ( accId ) {
		const role_lnk = this.state.user_new._links.role.href;
		const role_id = this.state.roles_sel;
		const base_uri = this.getBaseUri(role_lnk);
		const role_res =  base_uri + '/api/security-roles/' + role_id;
		var body =  {_links:{self:{href:''}}};
		body._links.self.href = role_res;

		client({
			method: 'PUT', 
			path: '/api/security-users/' + accId + '/role',
			entity: body,
			headers: { 'Content-Type': 'text/uri-list' },
			redirect: 'follow',
		}).done(response => {
			this.handleNotification('success','Role assigned Successfully');   
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
        });
	}

	/**
	 * Assign selected Password Policy to the User
	 * @param {*} accId 
	 */
	AssignPolicy ( accId ) {
		const policy_lnk = this.state.user_new._links.policy.href;
		const policy_id = this.state.policies_sel;
		const base_uri = this.getBaseUri(policy_lnk);
		const policy_res = base_uri + '/api/security-policies-password/' + policy_id;
		var body =  {_links:{self:{href:''}}};
		body._links.self.href = policy_res;
		
		client({
			method: 'PUT', 
			path: '/api/security-users/' + accId + '/policy', 
			entity: body, 
			headers: { 'Content-Type': 'text/uri-list' },
			redirect: 'follow',
		}).done(response => {
			this.handleNotification('success',"Policy Assigned Successfully");
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
        });
	}
	
	/**
     * Performs a REST request to Add new User Records.
     */
	handleAdd() {
		const users = {
			username: this.state.user.username,
			password:this.state.user.password,
			acStatus: this.state.user.acStatus,
			firstName: this.state.user.firstName,
			middleInitial: this.state.user.middleInitial,
			lastName: this.state.user.lastName,
			email: this.state.user.email,
			mobileNo: this.state.user.mobileNo,
		};
		let body = JSON.stringify(users);

		console.log(body);
		client({
			method: 'POST',
			path: '/api/security-users/', 
			entity: users, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.setState({user_new: response.entity}, () => { this.Assignments();});
			this.handleNotification('success','User added Successfully');
			this.setState({user: this.baseState});
			this.getUsersCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
		}); 
		this.close();
		return; 
	}
	
	/**
	 * Assing selected Role and Policy to the new User.
	 */
	Assignments () {
		let accId = this.state.user_new.accountId;
		this.AssignRole(accId);
		this.AssignPolicy(accId);
	}
	
	handleUserAdd(values) {
		this.setState({user: values});
		this.handleAdd();
	}
	/**
     * Renders a Button view to initiate Add operation and 
     * to open the Drawer to save new User Records.
     */
	render() {
		const user=this.state.user;
		const roles_dd = this.state.roles_dd;
		const policies_dd = this.state.policies_dd;
		
		return (
		<React.Fragment>  
			<Button style={tbButton} onClick={this.toggleDrawer}>Create </Button>
			<Drawer show={this.state.show} onHide={this.close}>
			<Drawer.Header> 
				<Header size='large'>Add User</Header>
			</Drawer.Header>
			<Drawer.Body>
			<Fragment>
			<Formik 
				initialValues={user}
				validationSchema={userValidationSchema}
				onSubmit={(values) => {
					this.handleUserAdd(values);
				}}
			>
			{({
				values,
				errors,
				touched,
				handleSubmit,
				handleChange
			}) => (
			<Form onSubmit={handleSubmit}>
			<Grid columns='equal'>
				<Grid.Row>
					<Grid.Column width={2}></Grid.Column>
					<Grid.Column width={12}>
						<Grid columns='equal'>
							<Grid.Row>
								<Grid.Column>User Name</Grid.Column>
								<Grid.Column>
									<Form.Input type="text" name='username' 
												value={values.username}
												onChange={handleChange}
									/>
									<p style={{color: 'red'}}>
										{errors.username 
										&& touched.username 
										&& errors.username}
									</p>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
							<Grid.Column>Password</Grid.Column>
								<Grid.Column>
									<Form.Input type="password" name="password" 
												value={values.password} 
												onChange={handleChange}
									/>
									<p style={{color: 'red'}}>
										{errors.password 
										&& touched.password 
										&& errors.password}
									</p>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>First Name</Grid.Column>
								<Grid.Column>
									<Form.Input type="text" name='firstName'
												value={values.firstName}
												onChange={handleChange}
									/>
									<p style={{color: 'red'}}>
										{errors.firstName 
										&& touched.firstName 
										&& errors.firstName}
									</p>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Middle Name</Grid.Column>
								<Grid.Column>
									<Form.Input type="text" name='middleInitial' 
												value={values.middleInitial}
												onChange={handleChange}
									/>
									<p style={{color: 'red'}}>
										{errors.middleInitial 
										&& touched.middleInitial 
										&& errors.middleInitial}
									</p>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Last Name</Grid.Column>
								<Grid.Column>
									<Form.Input type="text" name='lastName'
												value={values.lastName}
												onChange={handleChange}
									/>
									<p style={{color: 'red'}}>
										{errors.lastName 
										&& touched.lastName 
										&& errors.lastName}
									</p>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Email</Grid.Column>
								<Grid.Column>
									<Form.Input type="email" name='email'
												value={values.email}
												onChange={handleChange}
									/>
									<p style={{color: 'red'}}>
										{errors.email 
										&& touched.email 
										&& errors.email}
									</p>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Mobile Number</Grid.Column>
								<Grid.Column>
									<Form.Input type="text" name='mobileNo'
												value={values.mobileNo}
												onChange={handleChange}
									/>
									<p style={{color: 'red'}}>
										{errors.mobileNo 
										&& touched.mobileNo 
										&& errors.mobileNo}
									</p>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
							<Grid.Column>
								Role
							</Grid.Column>
							<Grid.Column>
								<Dropdown clearable selection fluid required
										placeholder="Select Role"
										options={roles_dd} 
										onChange={this.handleRoleChange}
								/>
							</Grid.Column>
							</Grid.Row>
							<Grid.Row>
							<Grid.Column>
								Password Policy
							</Grid.Column>
							<Grid.Column>
								<Dropdown  clearable selection fluid required
										placeholder="Select Policy"
										options={policies_dd}
										onChange={this.handlePolicyChange}
								/>
							</Grid.Column>
							</Grid.Row>
						</Grid>
					</Grid.Column>
					<Grid.Column width={2}></Grid.Column>
				</Grid.Row>
				<Grid.Row></Grid.Row>
				<Grid.Row></Grid.Row>
				<Grid.Row>
					<Grid.Column>
					</Grid.Column>
					<Grid.Column>
						<Button type='submit' icon style={tbButton} 
								content='Submit'>
						</Button>
						<Button onClick={this.close} type='button' icon style={tbButton}  
								floated='right' content='Cancel'>
						</Button>
					</Grid.Column>
					<Grid.Column></Grid.Column>
				</Grid.Row>
			</Grid>
			</Form>
			)}
			</Formik>
			</Fragment>
        </Drawer.Body>
		</Drawer>
      </React.Fragment>
        );
    }
}

/**
 * Component for rendering the Button & Drawer views to Modify User.
 * Child of {@link UserToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class ModifyUser extends React.Component {

	 /**
     * Initializes state to hold Record for the selected User.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props) {
		super(props);
		this.state = {
			user: 
			{
				username : "",
				roles : "",
				policy : ""
			},
			sel_id: null,
			showDrawer:false,
		}
		this.getSelectedCb = this.props.getSelected.bind(this);
	}

	closeDrawer = () => {
		this.setState({ showDrawer: false })
	}
	
	openDrawer = ()=> {
		this.setState({showDrawer: true})
		this.setState({sel_id: this.getSelectedCb()});
	}

	/**
     * Renders a Button view to initiate Modify operation on selected User and 
     * the Drawer view to display the selected User Record.
     */
	render() {
		const {sel_id} = this.state;
		const roles_dd = this.props.roles_dd;
		const policies_dd = this.props.policies_dd;

		const panes = [
			{ menuItem: 'User Profile', render: () => 
				<Tab.Pane style={noBorder}>
					<UserProfile sel_id={sel_id} closeDrawer={this.closeDrawer} 
								 roles_dd={roles_dd} policies_dd={policies_dd} 
								 getUsers={this.props.getUsers}
					/>
				</Tab.Pane> 
			},
			{ menuItem: 'Change Password', render: () => 
				<Tab.Pane style={noBorder}>
					<ChangePassword sel_id={sel_id} closeDrawer={this.closeDrawer} 
									roles_dd={roles_dd} policies_dd={policies_dd} 
									getUsers={this.props.getUsers}
					/>
				</Tab.Pane> 
			},
		]
		
        return (
			<Fragment>
			<Button style={tbButton} onClick={this.openDrawer}>Modify</Button>
			<Drawer show={this.state.showDrawer} onHide={this.closeDrawer}>
				<Drawer.Header> 
					<Header size='large'>Modify User</Header>
				</Drawer.Header>
				<Drawer.Body >
					{<Tab panes={panes} />}
				</Drawer.Body>
			</Drawer>
			</Fragment>
        );
    }
}


/**
 * Component for rendering the Button & Drawer views to Delete Users.
 * Child of {@link UserToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class DeleteUser extends React.Component {

	 /**
     * Initializes state to hold Record for the selected User.
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
		this.handleDelete = this.handleDelete.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.getUsersCb = this.props.getUsers;
	}

	openModal = ()=> {
		this.setState({showModal: true})
	}

	closeModal = () => {
		this.setState({ showModal: false });
	}

	handleDelete() {
		let id = this.getSelectedCb();
		this.onDelete(id);
		this.closeModal();
		return;
	}

	/**
	 * Invokes a REST request to Delete the selected User.
     * Also fetches the updated list of Users.
	 * 
	 * @param {number} id  ID of the User
	 */
	onDelete(id) {
		client({method: 'DELETE', path: '/api/security-users/' + id}).done(response => {
			this.getUsersCb();
			this.handleNotification('success','User Deleted Successfully');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','User Deletion Failed');
		});

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
     * Renders a Button view to initiate Delete operation on selected User and 
     * the Modal view to seek User confirmation.
    */
    render() {
        return (
        <Modal dimmer='inverted' open={this.state.showModal} onClose={this.closeModal}
				trigger={<Button style={tbButton} onClick={this.openModal}>Delete </Button>}>
            <Modal.Header>Delete User</Modal.Header>
                <Modal.Content>
					<Grid columns='equal'>
						<Grid.Row>
                     		<p>Are you sure you want to delete this user</p>
						</Grid.Row>
						<Grid.Row></Grid.Row>
						<Grid.Row>
							<Grid.Column>
							</Grid.Column>
							<Grid.Column></Grid.Column>
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

/**
 * To Change the password of the User.
 * @class
 * @augments React.Component
 * child of {@link ModifyUser}.
 */
class ChangePassword extends React.Component {

	/**
     * Initializes state to hold Record for the User Password.
     * 
     * @constructor
     * @param {*} props 
    */
	constructor(props) {
		super(props);
		this.state = {
			change : 
			{
				password : ""
			},

			confirmPassword : "",
			user: 
			{
				username : ""
			}
		};

		this.handleNotification = this.handleNotification.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.ConfirmPasswordChange = this.ConfirmPasswordChange.bind(this);
		this.ChangePassword = this.ChangePassword.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.closeDrawer = this.props.closeDrawer.bind(this);
		this.getUsersCb = this.props.getUsers;

		const id = props.sel_id;
	}
	
	handlePasswordChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let change = {...this.state.change};
		change[name] = value;
		this.setState({change});
	};

	ConfirmPasswordChange = event => {
		this.setState({
			confirmPassword: event.target.value,
		});
	};
	
	/**
     * Performs a REST request to fetch the details of the User Password
     * for display in the Drawer.
     * 
     */
	handleLoad() {
		let id = this.props.sel_id;	
		if (id == null)
			return;
		client({method: 'GET', path: '/api/security-users/' + id}).done(response => {
			this.setState({user: response.entity});
		}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
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

	componentDidMount() {
		this.handleLoad();
	}

	/**
	 *Performs a REST request when user Changes the Password.
	 */
	ChangePassword = () => {
		const {change,confirmPassword} = this.state;
		if (this.state.change.password !==confirmPassword) {
			alert("Passwords don't Match");
		} else {
			let id = this.props.sel_id;
			let body = this.state.change;
			delete body.id;
			var users = body;
			client({
				method: 'PATCH', 
				path: '/api/security-users/' + id, 
				entity: users, 
				headers: { 'Content-Type': 'application/json' }
			}).done(response => {
				this.closeDrawer();
				this.handleNotification('success','User password changed Successfully');
				this.getUsersCb();
			}, response => {
				if (response.status.code === 401) {
					console.log('UNAUTHORIZED');
					this.handleNotification('warning',"password not changed Successfully");
				}
				if (response.status.code === 403) {
					console.log('FORBIDDEN');	
					this.handleNotification('warning',"password not changed Successfully");
				}
				this.handleNotification('error','failed to change the user password');
			});
			this.closeModal();
			return; 
		}		
	}

	/**
     * Renders a Button view to initiate Change Password operation on selected User.
    */
	render() {
		const {change} = this.state;
		return(
			<div>
				<Grid columns='equal'>
					<Grid.Row>
						<Grid.Column width={2}></Grid.Column>
						<Grid.Column width={12}>
							<Form>
							<Grid columns='equal' width='1'>
							<Grid.Row>
                                <Grid.Column>User Name</Grid.Column>
                                <Grid.Column>
                                 <Form.Input type="text" name='username'
								 			 value={this.state.user.username} 
                            	  />
                                </Grid.Column>
                        	</Grid.Row>
							<Grid.Row>
                                <Grid.Column>Enter New Password</Grid.Column>
                                <Grid.Column>
								 <Form.Input type="password" name='password'
								 	required={true} 
									 value={change.password} 
									onChange={this.handlePasswordChange}
                            	  />
                                </Grid.Column>
                        	</Grid.Row>
							<Grid.Row>
									<Grid.Column>Re-Enter Password</Grid.Column>
									<Grid.Column>
										<Form.Input type="password" name="confirmPassword" 
											required={true} 
											value={this.state.confirmPassword} 
											onChange={this.ConfirmPasswordChange}
										/>
									</Grid.Column>
							</Grid.Row>
							<Grid.Row></Grid.Row>
							<Grid.Row></Grid.Row>
							</Grid>
							</Form>
           				</Grid.Column>
           				<Grid.Column width={2}></Grid.Column>
           			</Grid.Row>
					<Grid.Row>
						<Grid.Column>
						</Grid.Column>
						<Grid.Column>
						<Button onClick={this.ChangePassword.bind(this)} style={tbButton} icon 
								content='Submit'>
						</Button>
						<Button onClick={this.closeDrawer} style={tbButton} floated='right' 
								content='Cancel'>
						</Button>
						</Grid.Column>
						<Grid.Column></Grid.Column>
					</Grid.Row>
		  		</Grid>
		</div>
		)
	}
}

/**
 * To show the Details of the User.
 * @class
 * @augments React.Component
 * child of {@link ModifyUser}
 */
class UserProfile extends React.Component {
	/**
     * UserProfile constructor. Initializes state to hold User Records.
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props) {
		super(props);
		
		this.state = {
			user : {},
			user_role : {},
			user_policy : {},
			roles_dd : this.props.roles_dd,
			policies_dd : this.props.policies_dd,
			roles_sel : [],
			policies_sel : [],
			showModal : false
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.closeDrawer = this.props.closeDrawer.bind(this);	
		this.getUsersCb = this.props.getUsers;
		const id = props.sel_id;
	}

	/**
	 * Perform a REST request to get the assigned ROle of the User.
	 * @param {numver} user_id ID of the User.
	 */
	getUserRole (user_id) {
		const user_res = this.state.user._links.self.href;
		const base_uri = this.getBaseUri(user_res);
		const role_res = base_uri + '/api/security-users/' + user_id + '/role';

		client({
			method: 'GET', 
			path: role_res,
		}).done(response => {
			this.setState({user_role : response.entity});
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
        });
	}

	/**
	 * Perform a REST request to get the assigned Password Policy of the User.
	 * @param {number} user_id ID of the USer.
	 */
	getUserPolicy (user_id) {
		const user_res = this.state.user._links.self.href;
		const base_uri = this.getBaseUri(user_res);
		const policy_res = base_uri + '/api/security-users/' + user_id + '/policy';

		client({
			method: 'GET', 
			path: policy_res,
		}).done(response => {
			this.setState({user_policy : response.entity});
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('failed','failed to change the user profile');
        });
	}

	/**
     * Performs a REST request to fetch the details of the User.
     */
	handleLoad() {
		let id = this.props.sel_id;
		if (id == null)
			return;
		client({method: 'GET', path: '/api/security-users/' + id}).done(response => {
			this.setState({user: response.entity}, () => {
				this.getUserRole(id);
				this.getUserPolicy(id);
			});
		}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
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
	
	componentDidMount() {
		this.handleLoad();
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let user = {...this.state.user};
		user[name] = value;
		this.setState({user});
	};

	/**
	 * Gets the List of Roles and updates component's State.
	 * 
	 * @param {*} e 
	 */
	handleRoleChange = (e, {value}) => {
		const role_id = value;
		this.setState({roles_sel: role_id});
	}

	/**
	 * Gets the List of Policies and updates component's State.
	 * 
	 * @param {*} e 
	 */
	handlePolicyChange = (e, {value}) => {
		const policy_id = value;
		this.setState({policies_sel: policy_id})
	}

	getBaseUri( link ) {
		var pathArray = link.split('/');
		var protocol = pathArray[0];
		var host  = pathArray[2];
		var url = protocol + '//' + host;
		return url;
	}

	/**
	 * Update the Role and Password Ploicy of the User.
	 */
	UpdateUser() {
		const user_res = this.state.user._links.self.href;
		const base_uri = this.getBaseUri(user_res);

		const user_id = this.state.user.accountId;
		const role_id = this.state.roles_sel;
		const policy_id = this.state.policies_sel;

		this.UpdateRole(base_uri, user_id, role_id);
		this.UpdatePolicy(base_uri, user_id, policy_id);
	}

	/**
	 * Perform a REST request to update the Role of the User.
	 * @param {*} base_uri 
	 * @param {number} user_id ID of the User.
	 * @param {number} role_id ID of the Role.
	 */
	UpdateRole ( base_uri, user_id, role_id ) {
		const role_res = base_uri + '/api/security-roles/' + role_id;
		var body =  {_links:{self:{href:''}}};
		body._links.self.href = role_res;

		client({
			method: 'PUT', 
			path: '/api/security-users/' + user_id + '/role',
			entity: body,
			headers: { 'Content-Type': 'text/uri-list' },
			redirect: 'follow',
		}).done(response => {
			this.handleNotification('success','Role Updated Successfully');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','Role Update Failed');
        });
	}

	/**
	 * 
	 * Perform a REST request to Update the Password Policy of the User.
	 * @param {*} base_uri 
	 * @param {number} user_id ID of the User
	 * @param {number} policy_id ID of the Passsword Policy
	 */
	UpdatePolicy ( base_uri, user_id, policy_id ) {
		const policy_res = base_uri + '/api/security-policies-password/' + policy_id;
		var body =  {_links:{self:{href:''}}};
		body._links.self.href = policy_res;

		client({
			method: 'PUT', 
			path: '/api/security-users/' + user_id + '/policy', 
			entity: body, 
			headers: { 'Content-Type': 'text/uri-list' },
			redirect: 'follow',
		}).done(response => {
			this.setStatusCb("Policy Update Successful");
			this.handleNotification('success','Policy Updated sucessfully');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setStatusCb("Policy Update Failed");
			this.handleNotification('error','Policy Update Failed');
        });
	}
	/**
	 * Performs a REST request to add the changed details of the User.
	 */
	handleSubmit() {
		let uid = this.props.sel_id;
		let body = this.state.user;

		client({
			method: 'PATCH', 
			path: '/api/security-users/' + uid, 
			entity: body, 
			headers: { 'Content-Type': 'application/hal+json' }
		}).done(response => {
			this.UpdateUser();
			this.closeDrawer();
			this.getUsersCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
		});
		return;
	}

	/**
     * Renders a Button view to initiate User Profile operations on selected User.
    */
	render() {
		const user = this.state.user;
		const roles_dd = this.state.roles_dd;
		const policies_dd = this.state.policies_dd;
		const user_role = this.state.user_role;
		const user_policy = this.state.user_policy;
		var role_val;
		var policy_val;

		const role_idx = roles_dd.findIndex(x => x.text === user_role.roleName);
		const policy_idx = policies_dd.findIndex(x => x.text === user_policy.policyName);
		
		if (role_idx >= 0 && policy_idx >= 0) {
			role_val = role_idx >= 0 ? parseInt(roles_dd[role_idx].value) : -1;
			policy_val = policy_idx >= 0 ? parseInt(policies_dd[policy_idx].value) : -1;
		} else {
			return null;
		}

		return(
			<div>
				<Grid columns='equal'>
					<Grid.Row>
						<Grid.Column width={2}></Grid.Column>
						<Grid.Column width={12}>
							<Form>
							<Grid columns='equal' width='1'>
							<Grid.Row>
                                <Grid.Column>User Name</Grid.Column>
                                <Grid.Column>
                                 <Form.Input type="text" name='username'
										value={user.username} onChange={this.handleChange}
                            	  />
                                </Grid.Column>
                        	</Grid.Row>
							<Grid.Row>
								<Grid.Column>
									Role
								</Grid.Column>
								<Grid.Column>
									<Dropdown clearable selection fluid
											  placeholder="Select Role"
											  options={roles_dd}
											  defaultValue={role_val}
											  onChange={this.handleRoleChange} />
								</Grid.Column>
                    		</Grid.Row>
							<Grid.Row>
									<Grid.Column>Password Policy</Grid.Column>
									<Grid.Column>
										<Dropdown clearable selection fluid
												  placeholder="Select Policy"
												  options={policies_dd}
												  defaultValue={policy_val}
												  onChange={this.handlePolicyChange} />
									</Grid.Column>
							</Grid.Row>
							<Grid.Row></Grid.Row>
							<Grid.Row></Grid.Row>
							</Grid>
							</Form>
           				</Grid.Column>
           				<Grid.Column width={2}></Grid.Column>
           			</Grid.Row>
					<Grid.Row>
						<Grid.Column>
						</Grid.Column>
						<Grid.Column>
						<Button onClick={this.handleSubmit.bind(this)} style={tbButton} icon 
								content='Submit'>
						</Button>
						<Button onClick={this.closeDrawer} style={tbButton} icon floated='right' 
								content='Cancel'>
						</Button>
						</Grid.Column>
						<Grid.Column></Grid.Column>
					</Grid.Row>
					<Grid.Row></Grid.Row>
		  		</Grid>
			</div>
		)
	}
}

export default UserSecurity;