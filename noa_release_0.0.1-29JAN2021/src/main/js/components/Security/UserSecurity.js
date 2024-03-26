import React, {Fragment, useEffect} from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';
import { ButtonToolbar, Drawer } from 'rsuite';
import BreadCrumb from'../Widgets/BreadCrumb';

import { Notification } from 'rsuite';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { 
	Grid, Segment, Container, Modal, 
	Button, Header, Input, Checkbox,
	Label, TextArea, Dropdown, Divider,
    Form, Icon, Component, Pagination, Tab,
    Table, 
	Breadcrumb} from 'semantic-ui-react';

import { menuStyle, noBorder, noPadding, 
		 noBoxShadow, tbButton, stdTable, 
		 segmentStyle, 
		 drawerStyle} from '../../constants';

import 'semantic-ui-css/semantic.min.css';

const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const stompClient = require('../../utils/websocket-listener');
const root = '/api';

class UserSecurity extends React.Component {

    constructor(props) {
		super(props);

		this.state = {
            users: [],
            selected: [], 
			page: {size: 0, totalPages : 0, number: 0},
			isLoggedIn: false,
			user_role: [],
			user_policy:[],
			role_selected: 0,
			policy_selected:0,
			roles_all : [],
			policies_all : [],
			roles_dd : [],
			policies_dd : [],
		};

		this.getPage = this.getPage.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setSelected = this.setSelected.bind(this);
		this.getSelected = this.getSelected.bind(this);
		this.getUsers = this.getUsers.bind(this);
        const updated =  false;
	}

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
    
	setSelected (items) {		
		let sel = Object.keys(items);
		let id;
		if (Array.isArray(sel) && sel.length) {
			let rid = this.state.users[sel[0]].accountId;
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
		if (this.updated != true) {
			console.log('State update is pending');	
			return null;
		} else {
			return this.state.selected[0];
		}
	}

	fetchUserRoles() {
		const len = this.state.users.length;
		for(let userno = 0; userno < len; userno++) {
			this.fetchUserRole(userno);
		}
	}

	fetchUserPolicies() {
		const len = this.state.users.length;
		for(let userno = 0; userno < len; userno++) {
			this.fetchUserPolicy(userno);
		}
	}

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

	getUsers() {
		client({method: 'GET', path: '/api/security-users'}).done(response => {
			this.setState({users: response.entity._embedded["security-users"]}, () => { 
					this.fetchUserRoles(); this.fetchUserPolicies(); 
					this.fetchAllRoles(); this.fetchAllPolicies(); 
			});
			this.setState({page: response.entity.page});
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

    onChange (event, data) {
		client({method: 'GET', path: '/api/security-users?page=' + data.activePage})
		.done(response => {
			this.setState((state, props) => ({ 
				users: response.entity._embedded["security-users"]
			}));
			this.setState({page: response.entity.page});
		});
	}

	getPage() {
		client({method: 'GET', path: '/api/security-users?page=' + this.state.page.number})
		.done(response => {
			this.setState((state, props) => ({ 
				users: response.entity._embedded["security-users"]
			}));
			this.setState({page: response.entity.page});
		});
    }
    
    render() {
        const users = this.state.users;
		const page = this.state.page;
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
							<UserList users={users} page={page}
									  onChange={this.onChange} 
									  setSelected={this.setSelected}
									  roles={user_role}
									  policies={user_policy}
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

class Roles extends React.Component {
	render() {
		return (
			<div>{this.props.ur ? this.props.ur.roleName + '\n' : ''}</div>
		)
	}
}

class Policies extends React.Component {
	render() {
		return (
			<div>{this.props.up ? this.props.up.policyName + '\n' : ''}</div>
		)
	}
}

class UserList extends React.Component {
	render() {
	  return <UserTable setSelected={this.props.setSelected}
	  					page={this.props.page}
		  				users={this.props.users}
						roles={this.props.roles}
						policies={this.props.policies}
			/>;
	}
}

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

	const setSelected = props.setSelected;
    const users = props.users;
	const page = props.page;
	const roles = props.roles;
	const policies = props.policies;

	function handleSelectLocal (id) {
		handleSelect(id);
	}

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
                        <Table.Cell>{user.userId}</Table.Cell>
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
                        <Table.Cell>{user.status}</Table.Cell>
						
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

class AddUser extends React.Component {
    constructor(props){
        super(props);

        this.state = {
			user: {
				accId: "",
				userId:"",
				password:"",
				role:"",
				policy:""
			},
			status : "",
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

	close() {
		this.setState({
		  show: false
		});
		
		
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	handleRoleChange = (e, {value}) => {
		const role_id = value;
		this.setState({roles_sel: role_id});
	}

	handlePolicyChange = (e, {value}) => {
		const policy_id = value;
		this.setState({policies_sel: policy_id})
	}  

	handleChange = (event,data) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		let user = {...this.state.user};
		user[name] = value;
		this.setState({user});
	};

	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}
	
	updateStatus(value){
		this.setState({status:value});
	};

	getBaseUri( link ) {
		var pathArray = link.split('/');
		var protocol = pathArray[0];
		var host  = pathArray[2];
		var url = protocol + '//' + host;
		return url;
	}

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
			this.setState({status:"Assign Role Successful"});
			this.handleNotification('success','Role assigned Successfully');   

		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Assign Role Failed"});
        });
	}

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
			this.setState({status:"Assign Policy Successful"});
			this.handleNotification('success',"Policy Assigned Successfully");

		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Assign Policy Failed"});
        });
	}
		
	handleAdd() {
		this.setState({user: this.baseState});
		const users = {
			userId: this.state.user.userId,
			password:this.state.user.password,
		};
		let body = JSON.stringify(users);

		client({
			method: 'POST',
			path: '/api/security-users/', 
			entity: users, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.setState({user_new: response.entity}, () => { this.Assignments();});
			this.setState({status:"User Add Successful"});
			this.handleNotification('success','User added Successfully');
			this.getUsersCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"User Add Failed"});
		});
		this.close();
		return; 
	}
	
	Assignments () {
		let accId = this.state.user_new.accountId;
		this.AssignRole(accId);
		this.AssignPolicy(accId);
	}
	
	render() {
		const {user}=this.state;
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
			<Form>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column width={2}></Grid.Column>
                    <Grid.Column width={12}>
                        <Form>
                            <Grid columns='equal'>
                                <Grid.Row>
                                    <Grid.Column>User Name</Grid.Column>
                                    <Grid.Column>
                                        <Form.Input type="text" name='userId' required={true}
													value={user.userId}
													onChange={this.handleChange}
										/>
                                    </Grid.Column>
                                </Grid.Row>
								<Grid.Row>
								<Grid.Column>Password</Grid.Column>
									<Grid.Column>
									<Form.Input type="password" name="password"  required={true}
												value={user.password} 
												onChange={this.handleChange}
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
											  onChange={this.handleRoleChange}
									/>
								</Grid.Column>
                    			</Grid.Row>
								<Grid.Row>
								<Grid.Column>
									Password Policy
								</Grid.Column>
								<Grid.Column>
									<Dropdown  clearable selection fluid
											   placeholder="Select Policy"
											   options={policies_dd}
											   onChange={this.handlePolicyChange}
									/>
								</Grid.Column>
                    			</Grid.Row>
							</Grid>
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
			</Form>
            </Fragment>
        </Drawer.Body>
		</Drawer>
      </React.Fragment>
        );
    }
}

class ModifyUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {
				userName:"",
				roles:"",
				policy:""
			},
			sel_id: null,
			showDrawer:false,
			status: ""
		}
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.setStatus = this.setStatus.bind(this);
	}

	closeDrawer = () => {
		this.setState({ showDrawer: false })
	}
	
	openDrawer = ()=> {
		this.setState({showDrawer: true})
		this.setState({sel_id: this.getSelectedCb()});
	}

	setStatus = ( msg )=> {
		this.setState({status: msg})
	}

	render() {
		const {sel_id} = this.state;
		const roles_dd = this.props.roles_dd;
		const policies_dd = this.props.policies_dd;

		const panes = [
			{ menuItem: 'User Profile', render: () => 
				<Tab.Pane style={noBorder}>
					<UserProfile sel_id={sel_id} closeDrawer={this.closeDrawer} 
								 roles_dd={roles_dd} policies_dd={policies_dd} 
								 setStatus={this.setStatus} getUsers={this.props.getUsers}
					/>
				</Tab.Pane> 
			},
			{ menuItem: 'Change Password', render: () => 
				<Tab.Pane style={noBorder}>
					<ChangePassword sel_id={sel_id} closeDrawer={this.closeDrawer} 
									roles_dd={roles_dd} policies_dd={policies_dd} 
									setStatus={this.setStatus} getUsers={this.props.getUsers}
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

class ChangePassword extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			change: {
				password:""
			},

			confirmPassword:"",
			status:"",
			user: {
				userId: ""
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
		this.setStatusCb = this.props.setStatus.bind(this);
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
	
	handleLoad() {
		let id = this.props.sel_id;
		
		if (id == null)
			return;
		client({method: 'GET', path: '/api/security-users/' + id}).done(response => {
			this.setState({user: response.entity});
			this.setState({isLoggedin: true});
			this.setState({showModal:true});
		}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
			this.setState({isLoggedin: false});
		});
	}
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	componentDidMount() {
		this.handleLoad();
	}

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
				this.setStatusCb("Modify Successful");
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
				this.setStatusCb("Failed to Modify");
				this.handleNotification('error','failed to change the user password');
			});
			this.closeModal();
			return; 
		}		
	}
	
	updateStatus(value){
		this.setState({status:value});
	}

	render() {
		const closeModal = this.props.closeModal;
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
                                 <Form.Input type="text" name='userId'
								 			 value={this.state.user.userId} 
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

class UserProfile extends React.Component{
	constructor(props) {
		super(props);
		
		this.state = {
			user: {},
			user_role: {},
			user_policy: {},
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
		this.setStatusCb = this.props.setStatus.bind(this);
	}

	getUserRole (user_id) {
		const user_res = this.state.user._links.self.href;
		const base_uri = this.getBaseUri(user_res);
		const role_res = base_uri + '/api/security-users/' + user_id + '/role';

		client({
			method: 'GET', 
			path: role_res,
		}).done(response => {
			this.setState({user_role : response.entity});
			this.setStatusCb("Get Role Successful");
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setStatusCb("Get Role Failed");
        });
	}

	getUserPolicy (user_id) {
		const user_res = this.state.user._links.self.href;
		const base_uri = this.getBaseUri(user_res);
		const policy_res = base_uri + '/api/security-users/' + user_id + '/policy';

		client({
			method: 'GET', 
			path: policy_res,
		}).done(response => {
			this.setState({user_policy : response.entity});
			this.setStatusCb("Get Policy Successful");
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setStatusCb("Get Policy Failed");
			this.handleNotification('failed','failed to change the user profile');
        });
	}

	handleLoad() {
		let id = this.props.sel_id;
		if (id == null)
			return;
		client({method: 'GET', path: '/api/security-users/' + id}).done(response => {
			this.setState({user: response.entity}, () => {
				this.getUserRole(id);
				this.getUserPolicy(id);
			});
			this.setState({isLoggedin: true});
			this.setState({showModal: true});
		}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
			this.setState({isLoggedin: false});
		});
	}
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

	handleRoleChange = (e, {value}) => {
		const role_id = value;
		this.setState({roles_sel: role_id});
	}

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

	UpdateUser() {
		const user_res = this.state.user._links.self.href;
		const base_uri = this.getBaseUri(user_res);

		const user_id = this.state.user.accountId;
		const role_id = this.state.roles_sel;
		const policy_id = this.state.policies_sel;

		this.UpdateRole(base_uri, user_id, role_id);
		this.UpdatePolicy(base_uri, user_id, policy_id);
	}

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
			this.setStatusCb("Role Update Successful");
			this.handleNotification('success','Role Updated Successfully');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setStatusCb("Role Update Failed");
			this.handleNotification('error','Role Update Failed');
			
        });
	}

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
			this.setStatusCb("Modify Successful");
			this.getUsersCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setStatusCb("Failed to Modify");
		});
		return;
	}

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
                                 <Form.Input type="text" name='userId'
										value={user.userId} onChange={this.handleChange}
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

class DeleteUser extends React.Component {

    constructor(props){
		super(props);
		this.state = {
			status:"",
			showModal: false
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
	
	onDelete(id) {
		client({method: 'DELETE', path: '/api/security-users/' + id}).done(response => {
			this.setState({status:"Deleted Successful"});
			this.getUsersCb();
			this.handleNotification('success','User Deleted Successfully');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Deleted Failed"});
			this.handleNotification('error','User Deletion Failed');
		});

	}
	handleNotification(funcName, description) {
			Notification[funcName]({
			title: funcName,
			description: description
			});
		}
	  
	handleChange(value){
		this.setState({status:value});
    }
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

class UserToolbar extends React.Component{
	render() {
	const roles_dd=this.props.roles_dd;
	const policies_dd=this.props.policies_dd;

	return (      
		<Fragment>
			<AddUser roles_dd={roles_dd} policies_dd={policies_dd} getUsers={this.props.getUsers}/> 
			<ModifyUser roles_dd={roles_dd} policies_dd={policies_dd} 
							getSelected={this.props.getSelected}
							getUsers={this.props.getUsers}/>			
			<DeleteUser getSelected={this.props.getSelected} getUsers={this.props.getUsers}/>
		</Fragment>
		);
	}
}

export default UserSecurity;