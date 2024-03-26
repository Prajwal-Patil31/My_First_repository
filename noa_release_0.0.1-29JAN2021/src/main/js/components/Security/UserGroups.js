import React, { Fragment, useEffect, useState } from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';
import  BreadCrumb from '../Widgets/BreadCrumb';
import { CheckPicker, Notification } from 'rsuite';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import {
	Grid, Segment, Modal, Button,
	Header, Table, Form, Input,
	Checkbox, Label, Divider, Container,
	Dropdown, 
	Accordion,
	Icon} from 'semantic-ui-react';

import { menuStyle, noBorder, noPadding, noBoxShadow, 
		 tbButton, stdTable, segmentStyle, drawerStyle } from '../../constants';
		 
import 'semantic-ui-css/semantic.min.css';
import { Drawer } from 'rsuite';

const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const stompClient = require('../../utils/websocket-listener');
const root = '/api'

class UserGroups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userGroups: [],
            isLoggedIn: false,
			selected: [],
            users_all:[],
            users_dd:[],
            group_users:[]
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
        
    setSelected(items) {
        let sel = Object.keys(items);
        let id;
        if (Array.isArray(sel) && sel.length) {
            let rid = this.state.userGroups[sel[0]].groupId;
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
	
	clearState() {
		this.setState({users_dd: []});
	}
    getSelected () {
        if (this.update != true) {
            console.log('State update is pending');	
            return null;
        } else {
            return this.state.selected[0];
        }
    }
    fetchGroupUsers() {
		const len = this.state.userGroups.length;
		for (let groupno = 0; groupno < len; groupno++) {
			this.fetchUser( groupno );
		}
	}

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

	parseUsers() {
		let users_dd = this.state.users_dd;
		let users_j;

		if (!this.state.users_all)
			return;

		this.state.users_all.forEach(function (item, index) {
			let user = { 'value': item.accountId, 'label': item.userId, 
							'role': item.accountId };
			users_j = users_dd.push(user);
		});

		this.setState({users_dd: users_dd});
	}

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
			this.setState({isLoggedin: false});
		});
	}

    getUserGroups() {
        client({method: 'GET', path: '/api/security-groups'}).done(response => { 
            this.setState({userGroups: response.entity._embedded["security-groups"]},() => {
                this.fetchGroupUsers(); 
                this.fetchAllUsers(); });
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
        this.getUserGroups();
    }
    
    render() {
        const isLoggedIn = this.state.isLoggedIn;
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

class UserGroupToolbar extends React.Component{
	render(){
		return(
			<Fragment>
			    <CreateUserGroup users_dd={this.props.users_dd} getUserGroups={this.props.getUserGroups} clearState={this.props.clearState}/>
				<ModifyUserGroup users_dd={this.props.users_dd} getSelected={this.props.getSelected}  
							     getUserGroups={this.props.getUserGroups} clearState={this.props.clearState}/>
				<DeleteUserGroup getSelected={this.props.getSelected} getUserGroups={this.props.getUserGroups}/>
			</Fragment>
		)
	}
} 

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

	const setSelected = props.setSelected;
	const userGroups = props.userGroups;
    const users = props.users;

	const [activeIndex,setActiveIndex]  = useState(0);

	function handleSelectLocal (groupId) {
		handleSelect(groupId);
	}

	const handleClick = (e, titleProps) => {
		const index  = titleProps.index
		const newIndex = activeIndex === index ? -1 : index
		setActiveIndex(newIndex);
	}

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
				<Table.HeaderCell width={5}>Group Id</Table.HeaderCell>
				<Table.HeaderCell width={5}>Group Name</Table.HeaderCell>
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

class User extends React.Component {
	render() {
		return(
			<div>{this.props.fr.userId + '\n'}</div>
		)
	}
}

class CreateUserGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			userGroup: {
				groupId:"",
                groupName: "",
			},
			status:"",
            show:false,
            group_new: {},
			users_dd: this.props.users_dd,
			users_sel: [],
		};
		this.baseState = this.state.userGroup;
		this.handleNotification = this.handleNotification.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.getUserGroups = this.props.getUserGroups.bind(this);
		this.clearState = this.props.clearState;
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

    handleChange = (event, data) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		let userGroup = {...this.state.userGroup};
		userGroup[name] = value;
		this.setState({userGroup});
    }

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
			this.setState({status:"Adding User Successful"});
			this.handleNotification('success','user or users has been added to the new user group');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Adding User Failed"});
			this.handleNotification('error','user or users hasnot been added to the user group');
        });
	}

    handleAdd() {
		this.setState({userGroup: this.baseState});
		let body = this.state.userGroup;
		client({
				method: "POST", 
				path:'/api/security-groups', 
				entity: body,
				headers: { "Content-Type": "application/json" }
			}).done(response => {
				this.setState({group_new: response.entity}, () => { this.setGroupUsers();});
				this.clearState();
				this.handleNotification('success','A new user or users group has been created');
				this.getUserGroups();
			}, response => {
				if (response.status.code === 401) {
					console.log('UNAUTHORIZED');
				}
				if (response.status.code === 403) {
					console.log('FORBIDDEN');	
				}
				this.setState({status:"Failed to Create Group"});
				this.handleNotification('error','Failed to Create Group');
		});
		this.close();
        return;
    }
    render() {
        const userGroups = this.state.userGroup;
        const users_dd = this.state.users_dd;
        return(
            <React.Fragment>
                <Button style={tbButton} onClick={this.toggleDrawer}>Create</Button>
                <Drawer show={this.state.show} onHide={this.close}>
                <Drawer.Header> 
                    <Header size='large'>Create User Group</Header>
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
                                        <Grid.Column>Group Name</Grid.Column>
                                        <Grid.Column>
                                            <Form.Input type='text' name='groupName' value={userGroups.groupName} 
                                                        onChange={this.handleChange}>
                                            </Form.Input>
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
        )
    }
}

class ModifyUserGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			userGroup: {
				groupId:"",
                groupName: "",
			},
			show: false,
            status:"",
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
    handleLoad() {
		this.handleReset();
		let id = this.getSelectedCb();
		if (id == null)
			return;
		client({method: 'GET', path: '/api/security-groups/' + id}).done(response => {
			this.setState({userGroup: response.entity});
            this.setState({isLoggedin: true});
            this.fetchUser(id);
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
    handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}
	
	handleUserChange = (value) => {
		this.setState({	users_sel: value });
	};
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
			this.setState({status:"Group Update Successful"});
			this.handleNotification('success','modified group Successfully');
			this.clearState();
			this.getUserGroups();
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
			this.setState({status:"Adding User Successful"});
			this.handleNotification('success','Adding or removing an User from a group is Successfully done');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Adding User Failed"});
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
		this.setState({
		  show: false
		});
	}

	toggleDrawer() {
		this.setState({ show: true });
    }
    render() {
        const {userGroup} = this.state;
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
                        <Grid columns='equal'>
                            <Grid.Row>
                                <Grid.Column width={2}></Grid.Column>
                                <Grid.Column width={12}>
                                <Form> 
                                <Form.Field>
                                <Grid columns='equal' width='1'>
                                <Grid.Row>
                                    <Grid.Column>Group Name</Grid.Column>
                                    <Grid.Column>
                                        <Form.Input type='text' name='groupName' value={userGroup.groupName} 
                                                    onChange={this.handleChange}>
                                        </Form.Input>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>Users</Grid.Column>
                                    <Grid.Column width={16}>
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
        )
    }
}

class DeleteUserGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			status:"",
			showModal: false
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
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	handleDelete() {
		let id = this.getSelectedCb();
		this.onDelete(id);
		this.closeModal();
		return;
	}

	onDelete(id) {
		client({method: 'DELETE', path: '/api/security-groups/' + id}).done(response => {
			this.setState({status:"Deleted Successfully"});
			this.handleNotification('success','Deleted Successfully');
			this.getUserGroups();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Deleted Failed"});
			this.handleNotification('error','Deletion Failed');
		});

    }
    
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
