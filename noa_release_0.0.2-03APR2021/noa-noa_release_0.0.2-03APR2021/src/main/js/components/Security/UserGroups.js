/**@module UserGroups */

import React, { Fragment, useEffect, useState } from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';

import  BreadCrumb from '../Widgets/BreadCrumb';

import { CheckPicker, Drawer, Notification } from 'rsuite';

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

import { noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants';
import 'semantic-ui-css/semantic.min.css';

const client = require('../../utils/client');

import {Formik} from 'formik';

import * as yup from 'yup';

/**
 * Component for User Group Management; Implements functionality for 
 * fetching User Groups and performing operations on them.
 * 
 * @class 
 * @extends React.Component
 */
class UserGroups extends React.Component {

	/**
	 * User Group constructor. Initializes state to hold Users
     * and user selections.
	 * 
	 * @constructor
	 * @param {*} props 
	 */
    constructor(props) {
        super(props);
        this.state = {
            userGroups : [],
			selected :  [],
            users_all : [],
            users_dd : [],
            group_users : []
        };
        this.setSelected = this.setSelected.bind(this);
		this.getSelected = this.getSelected.bind(this);
		this.getUserGroups = this.getUserGroups.bind(this);
		this.clearState = this.clearState.bind(this);
		const update = false;
	}
	
    selectUpdateDone () {
        this.update = true;
    }
    
	/**
     * Updates the component state with the list of User Group Items selected by the User.
     * A callback passed to and invoked by {@link UserGroupTable}.
     * 
     * @param {Object} items Keyed object where the key is a specified id of the item in the list.
     */
    setSelected(items) {
        let sel = Object.keys(items);
        let id;
        if (Array.isArray(sel) && sel.length) {
            let rid = this.state.userGroups[sel[0]].groupId;
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
	
	clearState() {
		this.setState({users_dd: []});
	}

	/**
     * Gets the list of User selected User Group Items to operate upon.
     * A callback passed to the children of {@link UserGroupToolbar}.
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
	 * Iterates to get the Users of Each UserGroup.
	 * 
	*/
    fetchGroupUsers() {
		const len = this.state.userGroups.length;
		for (let groupno = 0; groupno < len; groupno++) {
			this.fetchUser( groupno );
		}
	}

	/**
	 * Makes a REST request to fetch all list of users specific to a group
	 * and updates component's state.
	 * 
	 * @param {Number} index 
	 */
	fetchUser( index ) {
		let id = this.state.userGroups[index].groupId;
		client({method: 'GET', path: '/api/security-groups/' + id + '/accounts'})
		.done(response => {
			this.setState({
				group_users: update(this.state.group_users, {[index]: 
										{ $set: response.entity._embedded["security-users"] }})
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
	 * Parses the users and shows in the Checkpicker
	 */
	parseUsers() {
		let users_dd = this.state.users_dd;
		let users_j;

		if (!this.state.users_all)
			return;

		this.state.users_all.forEach(function (item, index) {
			let user = { 'value': item.accountId, 'label': item.username, 
							'role': item.accountId };
			users_j = users_dd.push(user);
		});

		this.setState({users_dd: users_dd});
	}

	/**
	 * Makes a REST request and gets the List of All Users
	 * and updates component's State.
	 * 
	*/
	fetchAllUsers() {
		client({method: 'GET', path: '/api/security-users'})
		.done(response => { 
			this.setState({users_all: response.entity._embedded["security-users"]}, 
							this.parseUsers );
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
	 * Makes a REST request and gets the all the UserGroups with Pagination
	 * and updates the component's State.
	 * Also invokes fetchAllUsers and Fetching Resource specific to a UserGroup.
	 * 
	*/
    getUserGroups() {
        client({method: 'GET', path: '/api/security-groups'}).done(response => { 
            this.setState({userGroups: response.entity._embedded["security-groups"]},() => {
                this.fetchGroupUsers(); 
                this.fetchAllUsers(); });
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
        this.getUserGroups();
    }
    
	/**
     * Renders User Group component view invoking child components {@link UserGroupToolbar} 
     * and {@link UserGroupList} with User Group fetched on component mount.
     */
    render() {
        const userGroups = this.state.userGroups;
        const group_users = this.state.group_users;
        const users_dd = this.state.users_dd;
        return (
		<Container>
            <Grid style={noBoxShadow} centered verticalAlign='middle'>
                <Grid.Row style={noBoxShadow}>
                	<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Segment style={noBoxShadow}>
							<Grid columns={3} verticalAlign='middle'>
								<Grid.Column width={4} verticalAlign='middle' textAlign='left'>
									{<BreadCrumb/>}
									<Header size='medium'>User Group Administration</Header>
								</Grid.Column>
								<Grid.Column width={5} verticalAlign='middle' textAlign='left'>
								</Grid.Column>
								<Grid.Column width={7} textAlign='right' verticalAlign='middle'>
								<Fragment>
									<UserGroupToolbar getSelected={this.getSelected}
													getUserGroups={this.getUserGroups}
													users_dd={users_dd} clearState={this.clearState}
									/>
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
                            		<UserGroupList userGroups={userGroups}  
                                    	           setSelected={this.setSelected} 
                                           		   users={group_users}
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
* Component for rendering list of User Groups. Child of {@link UserGroups}.
* 
* @class
* @augments React.Component
*/
class UserGroupList extends React.Component {
    render() {
        return(
            <UserGroupTable setSelected={this.props.setSelected}
                            userGroups={this.props.userGroups}
                            users={this.props.users}
            />
        )
    }
}

/** 
 * Component for rendering the User Group Management toolbar. Child of {@link UserGroups}.
 * 
 * @class
 * @augments React.Component
*/
class UserGroupToolbar extends React.Component {
	render() {
		return(
			<Fragment>
				<CreateUserGroup 
					users_dd={this.props.users_dd} 
					getUserGroups={this.props.getUserGroups} 
					clearState={this.props.clearState}/>
				<ModifyUserGroup 
					users_dd={this.props.users_dd} 
					getSelected={this.props.getSelected}  
					getUserGroups={this.props.getUserGroups} 
					clearState={this.props.clearState}/>
				<DeleteUserGroup 
					getSelected={this.props.getSelected} 
					getUserGroups={this.props.getUserGroups}/>
			</Fragment>
		)
	}
} 

/**
 * Renders a tabular view of User Groups with data passed from {@link UserGroups} component. 
 * Implements selection mechanism trhough withSelections() hook.
 * 
 * @prop {ReactNode} props Callbacks exposed by withSelections() hook.
 * @prop {Function} setSelected Callback to update parent's state with a list of selected Resource Group Items.
 * @prop {Array} userGroups List of User Groups to be rendered.
 * @prop {Array} users List of Users to be rendered.
 * @returns {JSX} Rendered tabular view of Resource Groups
 */
const UserGroupTable = withSelections((props) => {
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
     * @callback setSelected Update state with the list of User Group Items selected by the User.
     */
	const setSelected = props.setSelected;

	/** 
     * List of User Groups to be rendered.
     * @type {Array}
     */
	const userGroups = props.userGroups;

	/** 
     * List of Users to be rendered.
     * @type {Array}
     */
    const users = props.users;

	const [activeIndex,setActiveIndex]  = useState(0);

	function handleSelectLocal (groupId) {
		handleSelect(groupId);
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
     * with modified set of selected UserGroup.
    */
	useEffect(() => {
		setSelected(selections);
		}, [props.selections]);

	if (!userGroups && !userGroups.length)
		return null;

	return(
		<div>
		<Segment basic textAlign="left" style={segmentStyle}>
			{!areAnySelected}
			<div style={{ visibility: areAnySelected ? 'visible' : 'hidden' }}>
				<span style={{marginRight: '8px'}}>{selectedCount} Selected</span>
				<Button basic onClick={handleClearAll}>Clear</Button>
			</div>
			<div><span>{userGroups.length} Groups</span></div>
      	</Segment>
		<div className = 'table-hscroll'>
        <Table striped style={stdTable}>
			<Table.Header>
			<Table.Row>
				<Table.HeaderCell width={1}>
				</Table.HeaderCell>
				<Table.HeaderCell width={2}>Group Id</Table.HeaderCell>
				<Table.HeaderCell width={5}>Group Name</Table.HeaderCell>
				<Table.HeaderCell width={4}>Group Code</Table.HeaderCell>
                <Table.HeaderCell width={5}>Users</Table.HeaderCell>
			</Table.Row>
			</Table.Header>
			<Table.Body>
			{userGroups.map((userGroup, index) => (
			<Table.Row key = {userGroups.indexOf(userGroup)}>
				<Table.Cell>
				<Checkbox checked={isItemSelected(userGroups.indexOf(userGroup))} 
						  onChange={handleSelectLocal.bind(this, userGroups.indexOf(userGroup))} />
				</Table.Cell>
				<Table.Cell>{userGroup.groupId}</Table.Cell>
				<Table.Cell>{userGroup.groupName}</Table.Cell>           
				<Table.Cell>{userGroup.groupCode}</Table.Cell>

				<Accordion>
					<Accordion.Title 
						active={activeIndex === index}
						index={index}
						onClick={handleClick}
					>
						<Icon name='dropdown'/>
						 Users...
					</Accordion.Title>
					<Accordion.Content active={activeIndex === index}>
					{index in users ? 
						users[index].map(user => ( <User fr={user}/>)) : ''}
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
 * Coponent for rendering the list of users
 * mapped to the User Group
 * 
 * Child of {@link UserGroupTable}
 * @class
 * @extends React.Component
 */
class User extends React.Component {
	render() {
		return(
			<div>{this.props.fr.username + '\n'}</div>
		)
	}
}

let userGroupSchema = yup.object().shape({
	groupName: yup.string()
				.min(4, "Too Short.")
				.required("Group Name is a Required Field."),
	groupCode: yup.string().required("Group Code is a Required Field.")
})

/**
 * Component for rendering the Button & Drawer views for Creating User Groups.
 * Child of {@link UserGroupTable}.
 * 
 * @class 
 * @extends React.Component
 */
class CreateUserGroup extends React.Component {

	/**
     * Initializes state to create new User Group.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
			userGroup : 
			{
				groupId: "",
				groupName : "",
				groupCode : ""
			},
            show:false,
            group_new : {},
			users_dd : this.props.users_dd,
			users_sel : [],
		};

		this.baseState = this.state.userGroup;
		this.handleNotification = this.handleNotification.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.getUserGroups = this.props.getUserGroups.bind(this);
		this.clearStateCb = this.props.clearState;
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
		this.setState({userGroup: this.baseState});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	/**
	 * Updates the changed values from input in component's State.
	 * @param {*} event 
	 * @param {*} data 
	*/
    handleChange = (event, data) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		let userGroup = {...this.state.userGroup};
		userGroup[name] = value;
		this.setState({userGroup});
    }

	/**
	 * Gets the List of Selected User and updates
	 * component's State.
	 * 
	 * @param {number} value Index of Selected user.
	*/
    handleUserChange = (value) => {
		this.setState({	users_sel: value });
	};

    getBaseUri( link ) {
		var pathArray = link.split('/');
		var protocol = pathArray[0];
		var host  = pathArray[2];
		var url = protocol + '//' + host;
		return url;
	}

	/**
	 * Performs a REST request to set User Group.
	 */
    setGroupUsers() {
		const group_lnk = this.state.group_new._links.self.href;
		const base_uri = this.getBaseUri(group_lnk);
		const group_id = this.state.group_new.groupId;
		const users = [];
		
		this.state.users_sel.forEach(function (item, index) {
			let user = {_links:{self:{href:''}}};
			user._links.self.href = base_uri + '/api/security-users/' + item;
			users.push(user);
		});

		client({
			method: 'PUT', 
			path: '/api/security-groups/' + group_id + '/accounts',
			entity: users,
			headers: { 'Content-Type': 'text/uri-list' },
			redirect: 'follow',
		}).done(response => {
			this.handleNotification('success','users have been added to the new user group');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','user or users hasnot been added to the user group');
        });
	}

	/**
     * Performs a REST request to Create a new User Group.
	 * Also fetches the updated list of User Group.
	 * 
    */
    handleAdd() {
		let body = this.state.userGroup;
		client({
				method: "POST", 
				path:'/api/security-groups', 
				entity: body,
				headers: { "Content-Type": "application/json" }
			}).done(response => {
				this.setState({group_new: response.entity}, () => { this.setGroupUsers();});
				this.handleNotification('success','A new user or users group has been created');
				this.getUserGroups();
				this.clearStateCb();
			}, response => {
				if (response.status.code === 401) {
					console.log('UNAUTHORIZED');
				}
				if (response.status.code === 403) {
					console.log('FORBIDDEN');	
				}
				this.handleNotification('error','Failed to Create Group');
		});
		this.close();
        return;
    }

	handleAddUserGroup(values) {
        this.setState({userGroup:values});
		this.handleAdd();
	}

	/**
     * Renders a Button view to initiate Create operation on selected User Groups and 
     * the Drawer view to enter the details of the User Group to be created.
     */
    render() {
		const userGroups = this.state.userGroup;
		const users_sel = this.state.users_sel;
        const users_dd = this.state.users_dd;
        return(
            <React.Fragment>
                <Button style={tbButton} onClick={this.toggleDrawer}>Create</Button>
                <Drawer show={this.state.show} onHide={this.close}>
                <Drawer.Header> 
                    <Header size='large'>Create User Group</Header>
                </Drawer.Header>
                <Drawer.Body >
				<Formik
					initialValues={userGroups}
					validationSchema={userGroupSchema}
					onSubmit={(values) => {
						this.handleAddUserGroup(values);
					}}
				>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleSubmit
				}) => (
					<Form onSubmit={handleSubmit}> 
					<Grid columns='equal'>
						<Grid.Row>
							<Grid.Column width={2}></Grid.Column>
							<Grid.Column width={12}>
							
							<Form.Field>
							<Grid columns='equal' width='1'>
								<Grid.Row>
									<Grid.Column>Group Name</Grid.Column>
									<Grid.Column>
										<Form.Input type='text' 
													name='groupName' 
													value={values.groupName} 
													onChange={handleChange}>
										</Form.Input>
										<p style={{color: 'red'}}>
											{errors.groupName 
											&& touched.groupName 
											&& errors.groupName}
										</p>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Group Code</Grid.Column>
									<Grid.Column>
										<Form.Input type='text' 
													name='groupCode' 
													value={values.groupCode} 
													onChange={handleChange}>
										</Form.Input>
										<p style={{color: 'red'}}>
											{errors.groupCode 
											&& touched.groupCode 
											&& errors.groupCode}
										</p>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
								<Grid.Column>Users</Grid.Column>
								<Grid.Column>
									<CheckPicker  
										searchable={true}
										placeholder="Select User"
										data = {users_dd}
										onChange = {this.handleUserChange} />
								</Grid.Column>
							</Grid.Row>
							</Grid>
							</Form.Field>
							
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
										content='Submit'/>
								<Button type='button' onClick={this.close} icon style={tbButton}  
										floated='right' content='Cancel'
										type='button'>
								</Button>
							</Grid.Column>
							<Grid.Column></Grid.Column>
						</Grid.Row>
					</Grid>
				</Form>
				)}
				</Formik>
                </Drawer.Body>
                </Drawer>
            </React.Fragment>  
        )
    }
}

/**
 * Component for rendering the Button & Drawer views for Modifying User Groups.
 * Child of {@link ResourceGroupToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class ModifyUserGroup extends React.Component {

	/**
     * Initializes state to hold Record for the selected User Group Item.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
			userGroup: 
			{
				groupId :"",
				groupName : "",
				groupCode : ""
			},
			show: false,
            group_new: {},
			users_dd: this.props.users_dd,
			users_sel: [],
			users_asg: [],
		};

		this.baseState = this.state.userGroup;
		this.baseUsers = this.state.users_asg;
		this.handleNotification = this.handleNotification.bind(this);
		this.handleModify = this.handleModify.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
        this.getUserGroups = this.props.getUserGroups.bind(this);
		this.fetchUser = this.fetchUser.bind(this);
		this.clearState = this.props.clearState;
    }

	handleReset() {
		this.setState({userGroup: this.baseState});
		this.setState({users_asg: this.baseUsers});
	}

	/**
     * Performs a REST request to fetch the details of the User selected User Group
     * for display in the Drawer.
     * 
     * @returns {void} On invalid selection.
     */
    handleLoad() {
		this.handleReset();
		let id = this.getSelectedCb();
		if (id == null)
			return;
		client({method: 'GET', path: '/api/security-groups/' + id}).done(response => {
			this.setState({userGroup: response.entity});
            this.fetchUser(id);
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
	 * Performs REST request to fetch User assigned to the
	 * User Group
	 * @param {Number} id ID of the User Group.
	 */
    fetchUser( id ) {
		client({method: 'GET', path: '/api/security-groups/' + id + '/accounts'})
		.done(response => {
			let users_j;
			let users = [];
			response.entity._embedded["security-users"].forEach(function (item, index) {
				users_j = users.push(item.accountId);
			});		
			this.setState({ users_asg: users });
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
	
	handleUserChange = (value) => {
		this.setState({	users_sel: value });
	};
   
	/**
	 * Performs a REST request to set Modify state of the User selected User Group
	 */
    handleModify() {
		let id = this.getSelectedCb();
		let body = this.state.userGroup;
		delete body.id;
		client({
			method: 'PATCH', 
			path: '/api/security-groups/' + id, 
			entity: body, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
            this.setState({group_new: response.entity}, () => { this.setGroupUsers();});
			this.handleNotification('success','modified group Successfully');
			this.clearState();
			this.handleReset();
			this.getUserGroups();
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

	/**
	 * Performs a REST request to form a User Group
	 * and assigning of Users to the Group
	 */
    setGroupUsers() {
		const group_lnk = this.state.group_new._links.self.href;
		const base_uri = this.getBaseUri(group_lnk);
		const group_id = this.state.group_new.groupId;
		const users = [];
		
		this.state.users_sel.forEach(function (item, index) {
			let user = {_links:{self:{href:''}}};
			user._links.self.href = base_uri + '/api/security-users/' + item;
			users.push(user);
		});

		client({
			method: 'PUT', 
			path: '/api/security-groups/' + group_id + '/accounts',
			entity: users,
			headers: { 'Content-Type': 'text/uri-list' },
			redirect: 'follow',
		}).done(response => {
			this.handleNotification('success','Adding or removing an User from a group is Successfully done');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','Adding User Failed');
        });
	}
    
    handleChange = (event, data) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		let userGroup = {...this.state.userGroup};
		userGroup[name] = value;
		this.setState({userGroup});
    }

	close() {
		this.setState({show: false});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}
	
	handleModifyUserGroup(values) {
		this.setState({userGroup:values});
		this.handleModify();
	}
	
	/**
     * Renders a Button view to initiate Modify operation on selected User Groups and 
     * the Drawer view to display the user selected User Groups.
     */
    render() {
        const userGroup = this.state.userGroup;
        const users_dd = this.state.users_dd;
		const users_asg = this.state.users_asg;
        return(
            <React.Fragment>			
                <Button style={tbButton} onClick={this.toggleDrawer}>Modify</Button>
                <Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
                <Drawer.Header>
                    <Header size='large' content='Modify User Group'/>
                </Drawer.Header>	
                <Drawer.Body >
				{userGroup.groupId ? 
				<Formik 
					initialValues={userGroup}
					validationSchema={userGroupSchema}
					onSubmit={(values) => {
						this.handleModifyUserGroup(values);
					}}
				>
				{({
					values,
					errors,
					touched,
					handleChange,
					handleSubmit
				}) => (
					<Form onSubmit={handleSubmit}> 
					<Grid columns='equal'>
						<Grid.Row>
							<Grid.Column width={2}></Grid.Column>
							<Grid.Column width={12}>
							
							<Form.Field>
							<Grid columns='equal' width='1'>
							<Grid.Row>
								<Grid.Column>Group Name</Grid.Column>
								<Grid.Column>
									<Form.Input type='text' 
												name='groupName' 
												value={values.groupName} 
												onChange={handleChange}>
									</Form.Input>
									<p style={{color: 'red'}}>
										{errors.groupName 
										&& touched.groupName 
										&& errors.groupName}
									</p>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Group Code</Grid.Column>
								<Grid.Column>
									<Form.Input type='text' 
												name='groupCode' 
												value={values.groupCode} 
												onChange={handleChange}>
									</Form.Input>
									<p style={{color: 'red'}}>
										{errors.groupCode 
										&& touched.groupCode 
										&& errors.groupCode}
									</p>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Users</Grid.Column>
								<Grid.Column>
									{users_asg.length == 0 ? '' :
									<CheckPicker  placeholder='Users' 
											searchable={true}
											data={users_dd}
											defaultValue = {users_asg}
											onChange = {this.handleUserChange} />
									}
								</Grid.Column>
							</Grid.Row>
						</Grid>
						</Form.Field>
						
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
								<Button type='button' onClick={this.close} icon style={tbButton}  
										floated='right' content='Cancel'>
								</Button>
							</Grid.Column>
							<Grid.Column></Grid.Column>
						</Grid.Row>	
					</Grid>
					</Form>
					)}
					</Formik>: <p>Please Select User Group</p>}
                    </Drawer.Body>
				</Drawer>
            </React.Fragment>  
        )
    }
}

/**
 * Component for rendering the Button & Modal views for Deleting User Groups.
 * Child of {@link UserGroupToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class DeleteUserGroup extends React.Component {

	/**
     * Initializes state to hold Record for the selected User Group Item.
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

		this.handleNotification=this.handleNotification.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.getUserGroups = this.props.getUserGroups.bind(this);
    }

    openModal = ()=> {
		this.setState({showModal: true})
	}

	closeModal = () => {
		this.setState({ showModal: false })
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
	 * Gets the selected ID of the User Group
	 */
	handleDelete() {
		let id = this.getSelectedCb();
		this.onDelete(id);
		this.closeModal();
		return;
	}

	/**
     * Invokes a REST request to Delete the User selected User Group.
     * Also fetches the updated list of User Groups.
     * 
     * @param {Number} id ID of the User Group
     */
	onDelete(id) {
		client({method: 'DELETE', path: '/api/security-groups/' + id}).done(response => {
			this.handleNotification('success','Deleted Successfully');
			this.getUserGroups();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','Deletion Failed');
		});
    }
    
	/**
     * Renders a Button view to initiate Delete operation on selected User Groups and 
     * the Modal view to seek User confirmation.
     */
    render() {
        return(
            <Modal  dimmer='inverted' open={this.state.showModal} onClose={this.closeModal} 
				trigger={<Button style={tbButton} onClick={this.openModal}>Delete </Button>}>
            <Modal.Header>Delete User Group</Modal.Header>
                <Modal.Content>
					<Grid columns='equal'>
						<Grid.Row>
							<p>Are you sure you want to delete this User Group</p>
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
        )
    }
}

export default UserGroups;