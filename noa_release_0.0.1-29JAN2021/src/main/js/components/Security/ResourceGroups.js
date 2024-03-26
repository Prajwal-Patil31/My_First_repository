import React, { Fragment, useEffect, useState } from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';
import  BreadCrumb from '../Widgets/BreadCrumb';

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
import { CheckPicker, Drawer, Notification } from 'rsuite';

const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const stompClient = require('../../utils/websocket-listener');
const root = '/api'

class ResourceGroups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resGroups: [],
            isLoggedIn: false,
			selected: [],
            resources_all:[],
            resources_dd:[],
            group_resources:[]
        };
        this.setSelected = this.setSelected.bind(this);
		this.getSelected = this.getSelected.bind(this);
		this.getResourceGroups = this.getResourceGroups.bind(this);
		this.clearState = this.clearState.bind(this);
		const update = false;
    }
    selectUpdateDone () {
        this.update = true;
	}
	
	clearState() {
		this.setState({resources_dd: []});
	}
        
    setSelected(items) {
        let sel = Object.keys(items);
        let id;
        if (Array.isArray(sel) && sel.length) {
            let rid = this.state.resGroups[sel[0]].resourceGroupId;
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
    fetchGroupResources() {
		const len = this.state.resGroups.length;
		for (let groupno = 0; groupno < len; groupno++) {
			this.fetResource( groupno );
		}
	}

	fetResource( index ) {
		let id = this.state.resGroups[index].resourceGroupId;

		client({method: 'GET', path: '/api/elements-groups/' + id + '/resources'})
		.done(response => {
			this.setState({
				group_resources: update(this.state.group_resources, {[index]: 
										{ $set: response.entity._embedded.elements }})
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

	parseResources() {
		let resources_dd = this.state.resources_dd;
		let resources_j;

		if (!this.state.resources_all)
			return;

		this.state.resources_all.forEach(function (item, index) {
			let resource = { 'value': item.resourceId, 'label': item.resourceName, 
							'role': item.resourceId };
            resources_j = resources_dd.push(resource);
		});

		this.setState({resources_dd: resources_dd});
	}

	fetchAllResources() {
		client({method: 'GET', path: '/api/elements'})
		.done(response => { 
			this.setState({resources_all: response.entity._embedded.elements}, 
							this.parseResources );
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

    getResourceGroups() {
        client({method: 'GET', path: '/api/elements-groups'}).done(response => { 
            this.setState({resGroups: response.entity._embedded["elements-groups"]},() => {
                this.fetchGroupResources();
                this.fetchAllResources(); });
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
        this.getResourceGroups();
    }
    
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        const resGroups = this.state.resGroups;
        const group_resources = this.state.group_resources;
        const resources_dd = this.state.resources_dd;
        return (
            <Container>
            <Grid style={noBoxShadow} centered verticalAlign='middle'>
                <Grid.Row style={noBoxShadow}>
                <Grid.Column style={noBoxShadow} verticalAlign='middle'>
                    <Segment style={noBoxShadow}>
                        <Grid columns={3} verticalAlign='middle'>
                        <Grid.Column width={4} verticalAlign='middle' textAlign='left'>
                        {<BreadCrumb/>}
                        <Header size='medium'>Resource Group Administration</Header>
                        </Grid.Column>
                        <Grid.Column width={5} verticalAlign='middle' textAlign='left'>
                        </Grid.Column>
                        <Grid.Column width={7} textAlign='right' verticalAlign='middle'>
                        <Fragment>
                            <ResourceGroupToolbar getSelected={this.getSelected}
                                        getResourceGroups={this.getResourceGroups}
                                        resources_dd={resources_dd} clearState={this.clearState}
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
                            <ResourceGroupList resGroups={resGroups}  
                                           setSelected={this.setSelected} 
                                           resources={group_resources}
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

class ResourceGroupList extends React.Component {
    render() {
        return(
            <ResourceGroupTable setSelected={this.props.setSelected}
                            resGroups={this.props.resGroups}
                            resources={this.props.resources}
            />
        )
    }
}

class ResourceGroupToolbar extends React.Component{
	render(){
		return(
			<Fragment>
			    <CreateResourceGroup resources_dd={this.props.resources_dd} getResourceGroups={this.props.getResourceGroups} 
									 clearState={this.props.clearState}
				/>
				<ModifyResourceGroup resources_dd={this.props.resources_dd} getSelected={this.props.getSelected} 
							     getResourceGroups={this.props.getResourceGroups} clearState={this.props.clearState}
				/>
				<DeleteResourceGroup getSelected={this.props.getSelected} getResourceGroups={this.props.getResourceGroups}
									 clearState={this.props.clearState}
				/>
			</Fragment>
		)
	}
} 

const ResourceGroupTable = withSelections((props) => {
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
	const resGroups = props.resGroups;
    const resources = props.resources;

	const [activeIndex,setActiveIndex]  = useState(0);

	function handleSelectLocal (resourceGroupId) {
		handleSelect(resourceGroupId);
	}

	const handleClick = (e, titleProps) => {
		const index  = titleProps.index
		const newIndex = activeIndex === index ? -1 : index
		setActiveIndex(newIndex);
	}

	useEffect(() => {
		setSelected(selections);
		}, [props.selections]);

	if (!resGroups && !resGroups.length)
		return null;

	return(
		<div>
		<Segment basic textAlign="left" style={segmentStyle}>
			{!areAnySelected}
			<div style={{ visibility: areAnySelected ? 'visible' : 'hidden' }}>
				<span style={{marginRight: '8px'}}>{selectedCount} Selected</span>
				<Button basic onClick={handleClearAll}>Clear</Button>
			</div>
			<div><span>{resGroups.length} Groups</span></div>
      	</Segment>
		<div className = 'table-hscroll'>
        <Table striped style={stdTable}>
			<Table.Header>
			<Table.Row>
				<Table.HeaderCell width={1}></Table.HeaderCell>
				<Table.HeaderCell width={5}>Group Id</Table.HeaderCell>
				<Table.HeaderCell width={5}>Group Name</Table.HeaderCell>
                <Table.HeaderCell width={5}>Resources</Table.HeaderCell>
			</Table.Row>
			</Table.Header>
			<Table.Body>
			{resGroups.map((resGroup, index) => (
			<Table.Row key = {resGroups.indexOf(resGroup)}>
				<Table.Cell>
				<Checkbox checked={isItemSelected(resGroups.indexOf(resGroup))} 
						  onChange={handleSelectLocal.bind(this, resGroups.indexOf(resGroup))} />
				</Table.Cell>
				<Table.Cell>{resGroup.resourceGroupId}</Table.Cell>
				<Table.Cell>{resGroup.resourceGroupName}</Table.Cell>           

				<Accordion>
					<Accordion.Title 
						active={activeIndex === index}
						index={index}
						onClick={handleClick}
					>
						<Icon name='dropdown'/>
						 Resources...
					</Accordion.Title>
					<Accordion.Content active={activeIndex === index}>
					{index in resources ? 
						resources[index].map(resource => ( <Resource fr={resource}/>)) : ''}
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

class Resource extends React.Component {
	render() {
		return(
			<div>{this.props.fr.resourceName + '\n'}</div>
		)
	}
}

class CreateResourceGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			resGroup: {
				resourceGroupId:"",
                resourceGroupName: "",
			},
			status:"",
            show:false,
            group_new: {},
			resources_dd: this.props.resources_dd,
			resources_sel: [],
		};
		this.baseState = this.state.resGroup;
		this.handleAdd = this.handleAdd.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.getResourceGroups = this.props.getResourceGroups.bind(this);
		this.clearState = this.props.clearState;
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
		let resGroup = {...this.state.resGroup};
		resGroup[name] = value;
		this.setState({resGroup});
    }

    handleResourceChange = (value) => {
		this.setState({	resources_sel: value });
	};

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

    setGroupResources() {
		const group_lnk = this.state.group_new._links.self.href;
		const base_uri = this.getBaseUri(group_lnk);
		const group_id = this.state.group_new.resourceGroupId;
		const resources = [];

		this.state.resources_sel.forEach(function (item, index) {
			let resource = {_links:{self:{href:''}}};
			resource._links.self.href = base_uri + '/api/elements/' + item;
			resources.push(resource);	
		});
		client({
			method: 'PUT', 
			path: '/api/elements-groups/' + group_id + '/resources',
			entity: resources,
			headers: { 'Content-Type': 'text/uri-list' },
			redirect: 'follow',
		}).done(response => {
			this.setState({status:"Adding Resource Successful"});
			this.handleNotification('success','Adding Resource Successful');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Adding Resource Failed"});
			this.handleNotification('error','Adding Resource Failed');
        });
	}

    handleAdd() {
		this.setState({resGroup: this.baseState});
		let body = this.state.resGroup;
		client({
				method: "POST", 
				path:'/api/elements-groups', 
				entity: body,
				headers: { "Content-Type": "application/json" }
			}).done(response => {
                this.setState({group_new: response.entity}, () => { this.setGroupResources();});
				this.handleNotification('success','Group Created Successfully');
				this.getResourceGroups();
				this.clearState();
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
        const resGroups = this.state.resGroup;
        const resources_dd = this.state.resources_dd;
        return(
            <React.Fragment>
                <Button style={tbButton} onClick={this.toggleDrawer}>Create</Button>
                <Drawer show={this.state.show} onHide={this.close}>
                <Drawer.Header> 
                    <Header size='large'>Create Resource Group</Header>
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
                                            <Form.Input type='text' name='resourceGroupName' value={resGroups.resourceGroupName} 
                                                        onChange={this.handleChange}>
                                            </Form.Input>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                    <Grid.Column>Resources</Grid.Column>
                                    <Grid.Column>
                                        <CheckPicker
											searchable={true}
                                            placeholder="Select Resource"
                                            data = {resources_dd}
                                            onChange = {this.handleResourceChange} />
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

class ModifyResourceGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			resGroup: {
				resourceGroupId:"",
                resourceGroupName: "",
			},
			show: false,
            status:"",
            group_new: {},
			resources_dd: this.props.resources_dd,
			resources_sel: [],
			resources_asg: [],
		};
		this.baseState = this.state.resGroup;
		this.baseResources = this.state.resources_asg;
		this.handleModify = this.handleModify.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
        this.getResourceGroups = this.props.getResourceGroups.bind(this);
		this.fetchResource = this.fetchResource.bind(this);
		this.clearState = this.props.clearState;
	}
	
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}


	handleReset() {
		this.setState({resGroup: this.baseState});
		this.setState({resources_asg: this.baseResources});
	}
	
    handleLoad() {
		this.handleReset();
		let id = this.getSelectedCb();
		if (id == null)
			return;
		client({method: 'GET', path: '/api/elements-groups/' + id}).done(response => {
			this.setState({resGroup: response.entity});
            this.setState({isLoggedin: true});
            this.fetchResource(id);
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
    
    fetchResource( id ) {
		client({method: 'GET', path: '/api/elements-groups/' + id + '/resources'})
		.done(response => {
			let resources_j;
			let resources = [];

			response.entity._embedded.elements.forEach(function (item, index) {
				resources_j = resources.push(item.resourceId);
			});
			
			this.setState({ resources_asg: resources });
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
    
	handleResourceChange = (value) => {
		this.setState({	resources_sel: value });
	};
   
    handleModify() {
		let id = this.getSelectedCb();
		let body = this.state.resGroup;
		delete body.id;

		client({
			method: 'PATCH', 
			path: '/api/elements-groups/' + id, 
			entity: body, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
            this.setState({group_new: response.entity}, () => { this.setGroupResources();});
			this.handleNotification('success','Group Created Successfully');
			this.clearState();
			this.getResourceGroups();
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

    setGroupResources() {
		const group_lnk = this.state.group_new._links.self.href;
		const base_uri = this.getBaseUri(group_lnk);
		const group_id = this.state.group_new.resourceGroupId;
		const resources = [];

		this.state.resources_sel.forEach(function (item, index) {
			let resource = {_links:{self:{href:''}}};
			resource._links.self.href = base_uri + '/api/elements/' + item;
			resources.push(resource);
		});

		client({
			method: 'PUT', 
			path: '/api/elements-groups/' + group_id + '/resources',
			entity: resources,
			headers: { 'Content-Type': 'text/uri-list' },
			redirect: 'follow',
		}).done(response => {
			this.setState({status:"Adding Resource Successful"});
			this.handleNotification('success','Adding Resource Successful');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Adding Resource Failed"});
			this.handleNotification('error','Adding Resource Failed');
        });
	}
    
    handleChange = (event, data) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		let resGroup = {...this.state.resGroup};
		resGroup[name] = value;
		this.setState({resGroup});
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
        const {resGroup} = this.state;
        const resources_dd = this.state.resources_dd;
		const resources_asg = this.state.resources_asg;
        return(
            <React.Fragment>			
                <Button style={tbButton} onClick={this.toggleDrawer}>Modify</Button>
                <Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
                <Drawer.Header>
                    <Header size='large' content='Modify Resource Group'/>
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
                                        <Form.Input type='text' name='resourceGroupName' value={resGroup.resourceGroupName} 
                                                    onChange={this.handleChange}>
                                        </Form.Input>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>Resources</Grid.Column>
                                    <Grid.Column width={16}>
                                        {resources_asg.length == 0 ? '' :
										<CheckPicker  placeholder='Resources' 
												searchable={true}
                                                data = {resources_dd}
                                                defaultValue = {resources_asg}
                                                onChange = {this.handleResourceChange} />
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
					{/* <Drawer.Footer style={drawerStyle}>
					<Input transparent value={this.state.status} />
					</Drawer.Footer> */}
                    </Drawer>
            </React.Fragment>  
        )
    }
}

class DeleteResourceGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			status:"",
			showModal: false
		};
		this.handleDelete = this.handleDelete.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.getResourceGroups = this.props.getResourceGroups.bind(this);
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
		client({method: 'DELETE', path: '/api/elements-groups/' + id}).done(response => {
			this.setState({status:"Deleted Successfully"});
			this.handleNotification('success','Deleted Successfully');

			this.getResourceGroups();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Deleted Failed"});
			this.handleNotification('error','Deleted Failed');
		});

    }
    
    render() {
        return(
            <Modal  dimmer='inverted' open={this.state.showModal} onClose={this.closeModal} 
				trigger={<Button style={tbButton} onClick={this.openModal}>Delete </Button>}>
            <Modal.Header>Delete Resources Group</Modal.Header>
                <Modal.Content>
					<Grid columns='equal'>
						<Grid.Row>
							<p>Are you sure you want to delete this Resource Group</p>
						</Grid.Row>
						<Grid.Row></Grid.Row>
						<Grid.Row>
							<Grid.Column>
								{/* <Input transparent value={this.state.status}/> */}
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

export default ResourceGroups;
