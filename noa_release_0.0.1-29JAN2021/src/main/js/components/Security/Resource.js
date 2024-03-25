import React, {Fragment, useEffect, forwardRef} from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';
import { Drawer } from 'rsuite';
import BreadCrumb from '../Widgets/BreadCrumb';

import { 
	Grid, Segment, Container, Modal, 
	Button, Header, Input, Checkbox,
	Label, TextArea, Dropdown, Divider,
    Form, Icon, Component, Pagination,
    Table } from 'semantic-ui-react';

import { menuStyle, noBorder, noPadding, 
		 noBoxShadow, tbButton, stdTable, 
		 segmentStyle, drawerStyle } from '../../constants';

import 'semantic-ui-css/semantic.min.css';
import { Notification } from 'rsuite';
const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const root = '/api';

class Resource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resources: [],
            selected: [],
        }
        const updated =  false;
		
        this.setSelected = this.setSelected.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.getResources = this.getResources.bind(this);
	}

	selectUpdateDone () {
		this.updated = true;
	}

	setSelected (items) {
		
		let sel = Object.keys(items);
		let id;
		if (Array.isArray(sel) && sel.length) {
			let rid = this.state.resources[sel[0]].resourceId;
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
	getResources() {
		client({method: 'GET', path: '/api/elements'}).done(response => {
			this.setState({resources: response.entity._embedded.elements});
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

	componentDidMount() {
		this.getResources(); 
	}

    render() {
		const resources = this.state.resources;
        return(
            <Container>
			<Grid style={noBoxShadow} centered verticalAlign='middle'>
			  	<Grid.Row style={noBoxShadow}>
			  		<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Segment style={noBoxShadow}>
						<Grid columns={3} verticalAlign='middle'>
							<Grid.Column width={3} verticalAlign='middle' textAlign='left'>
							{<BreadCrumb/>}
								<Header size='medium'>Resources Administration</Header>
							</Grid.Column>
							<Grid.Column width={6} verticalAlign='middle' textAlign='left'>							
							</Grid.Column>
							<Grid.Column width={7} textAlign='right' verticalAlign='middle'>
							<Fragment>
                                <ResourceToolBar  getSelected={this.getSelected} 
                                                  getResources={this.getResources}
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
								<ResourceList   resources={resources}
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

class ResourceList extends React.Component {
    render() {
        return(
            <ResourceTable resources={this.props.resources}
                           setSelected={this.props.setSelected}
            />
        )
    }
}

class ResourceToolBar extends React.Component {
    render() {
        return(
            <Fragment>
				<AddButton getSelected={this.props.getSelected} getResources={this.props.getResources} />
				<ModifyButton getSelected={this.props.getSelected} getResources={this.props.getResources}/> 
				<DelButton getSelected={this.props.getSelected} getResources={this.props.getResources} />
			</Fragment>
        )
    }
}

const ResourceTable = withSelections((props) =>{
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
	const resources = props.resources;

	function handleSelectLocal (id) {
		handleSelect(id);
	}


	useEffect(() => {
		setSelected(selections);
	}, [props.selections]);	
	
	if (!resources && !resources.length)
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
				<span>{resources.length} resources</span>
				</div>
			</Segment>
			<div className = 'table-hscroll'>
			<Table striped style={stdTable}>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell width={1}>
						</Table.HeaderCell>
						<Table.HeaderCell width={5}>Resource Id</Table.HeaderCell>
						<Table.HeaderCell width={5}>Resource Name</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
				{resources.map(resource =>(
					<Table.Row key = {resources.indexOf(resource)}>
						<Table.Cell>
							<Checkbox checked={isItemSelected(resources.indexOf(resource))} 
									  onChange={handleSelectLocal.bind(this, 
										resources.indexOf(resource))}/>
						</Table.Cell>
						<Table.Cell>{resource.resourceId}</Table.Cell>
						<Table.Cell>{resource.resourceName}</Table.Cell>
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

class AddButton extends React.Component{	

	constructor(props){
		super(props);
		this.state = {
			resource: {
				resourceId: "",
				resourceName:"",
			},
			status:"",
			show:false,
			
		};
		this.baseState = this.state.resource;
		this.handleNotification = this.handleNotification.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.getResources = this.props.getResources.bind(this);
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
		this.setState({resource: this.baseState});
		let body = this.state.resource;
		var resource = body;
		console.log('resource : ' + JSON.stringify(resource));
		client({
			method: 'POST', 
			path: '/api/elements/', 
			entity: resource, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.setState({status:"Added Successfully"});
			this.handleNotification('success','Added resource Successfully');
			this.getResources();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Failed to Add"});
			this.handleNotification('error','Failed to Add Resource');
		});
		this.close();
		return;
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let resource = {...this.state.resource};
		resource[name] = value;
		this.setState({resource});
	}

    render(){
	  	const {resource} = this.state;
		return (
			<React.Fragment> 
			<Button style={tbButton} onClick={this.toggleDrawer}>Create</Button>
			<Drawer show={this.state.show} onHide={this.close}>
				<Drawer.Header> 
				<Header size='large'>Create Resource</Header>
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
									<Grid.Column>Resource Name</Grid.Column>
									<Grid.Column>
										<Form.Input type='text'
													name='resourceName'
													value={resource.resourceName}
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

class DelButton extends React.Component{

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
		this.getResources = this.props.getResources;
	}
	openModal = () => {
		this.setState({showModal:true})
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
		client({method: 'DELETE', path: '/api/elements/'+ id}).done(response => {
			this.setState({status:"Deleted Successful"});
			this.handleNotification('success','Deleted Resource Successfully');
			this.getResources();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Deleted Failed"});
			this.handleNotification('error','Deletion of Resource has failed');
		});
	}
	render() {
		return(
			<Modal  dimmer='inverted' open={this.state.showModal} onClose={this.closeModal} 
					trigger={<Button style={tbButton} onClick={this.openModal}>Delete</Button>}>
				<Modal.Header>Delete Resource</Modal.Header>
					<Modal.Content>
						<Grid columns='equal'>
							<Grid.Row>
								<p>Are you sure you want to delete this Resource</p>
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

class ModifyButton extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			resource: {
				resourceName:"",
			},
			status:"",
			show:false,
		};
		this.baseState = this.state.resource;
		this.handleNotification = this.handleNotification.bind(this);
		this.handleModify = this.handleModify.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.getResources = this.props.getResources;
	}
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	handleLoad() {
		this.setState({resource: this.baseState});
		let resourceId = this.getSelectedCb();
		if (resourceId == null)
			return;
		client({method: 'GET', path: '/api/elements/' + resourceId}).done(response => {
			this.setState({resource: response.entity});
			this.setState({isLoggedin: true});
			this.setState({showModal:true});
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

	close() {
		this.setState({
		  show: false
		});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	handleModify() {
		let resourceId = this.getSelectedCb();
		let body = this.state.resource;
		delete body.resourceId;
		var resource = body;
		client({
			method: 'PUT', 
			path: '/api/elements/' + resourceId, 
			entity: resource, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.setState({status:"Modify Successful"});
			this.handleNotification('success','Modify Resource is Successfully implemented');
			this.getResources();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Failed to Modify"});
			this.handleNotification('error','Modifying Resource is UnSuccessful');
		});
		this.close();
		return;
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let resource = {...this.state.resource};
		resource[name] = value;
		this.setState({resource});
	}

	render(){
        const {resource} = this.state;
	  return (
		<React.Fragment>  
			<Button style={tbButton}  onClick={this.toggleDrawer}>Modify</Button>
			<Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
			<Drawer.Header>
				<Header size='large'>Modify Resource</Header>
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
					  			<Grid.Column>Resource Name</Grid.Column>
					  			<Grid.Column>
					  				<Form.Input type='text'
						  						name='resourceName'
						  						value={resource.resourceName}
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
    
export default Resource;