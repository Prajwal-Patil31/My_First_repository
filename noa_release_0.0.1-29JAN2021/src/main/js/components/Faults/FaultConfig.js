import React, { Fragment, useEffect } from 'react';
import update from 'react-addons-update';
import withSelections from 'react-item-select';
import { Drawer, Notification } from 'rsuite';

import { 
	Grid, 
	Container,
	Step, 
	Modal,
	Button,
	Header,
	Input,
	Form,
	Label,
	Table,
	Dropdown,
	Checkbox,
	Segment,
	Divider,
	Pagination,
	Icon } from 'semantic-ui-react';

import styled from 'styled-components';
import BreadCrumb from'../Widgets/BreadCrumb';
import { menuStyle, noBorder, noPadding, noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants'
import 'semantic-ui-css/semantic.min.css';

const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const stompClient = require('../../utils/websocket-listener');
const root = '/api';

class FaultConfig extends React.Component {
	constructor(props) {
		super(props);
			this.state = {
				frameworks: [],
				isLoggedIn: false,
				selected: [],
				page: {size: 0, totalPages : 0, number: 0},
			};
			const updated = false;
			this.setSelected = this.setSelected.bind(this);
			this.getSelected = this.getSelected.bind(this);
			this.onChange = this.onChange.bind(this);
			this.getFrameworks = this.getFrameworks.bind(this);
	}
	
	selectUpdateDone () {
		this.updated = true;
	}

	setSelected(items) {
		let sel = Object.keys(items);
		let id;
		if (Array.isArray(sel) && sel.length) {
			let rid = this.state.frameworks[sel[0]].faultId;
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
			return null;
		} else {
			return this.state.selected[0];
		}
	}
	onChange (event, data) {
		client({method: 'GET', path: '/api/faults-config?page=' + data.activePage}).done(response => {
			this.setState((state, props) => ({frameworks: response.entity._embedded["faults-config"]
			}));
			this.setState({page: response.entity.page});
		});
	}
	getFrameworks() {
		client({method: 'GET', path: '/api/faults-config'}).done(response => {
			this.setState({frameworks: response.entity._embedded["faults-config"]});
			this.setState({page: response.entity.page});
			this.setState({isLoggedin: true});
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
		this.getFrameworks();
	}
	render() {
		const isLoggedIn = this.state.isLoggedIn;
		const frameworks = this.state.frameworks;
		const page = this.state.page;
	return (
		<Container>
		<Grid style={noBoxShadow} centered verticalAlign='middle'>
			<Grid.Row style={noBoxShadow}>
			<Grid.Column style={noBoxShadow} verticalAlign='middle'>
				<Segment style={noBoxShadow}>
					<Grid columns={3} verticalAlign='middle'>
					<Grid.Column width={5} verticalAlign='middle' textAlign='left'>
						{<BreadCrumb/>}
						<Header size='medium'>Manage Fault Configuration</Header>
					</Grid.Column>
					<Grid.Column width={5} verticalAlign='middle' textAlign='left'>
						
					</Grid.Column>
					<Grid.Column width={6} textAlign='right' verticalAlign='middle'>
					<FrameworkToolbar getSelected={this.getSelected} getFrameworks={this.getFrameworks}/>
					</Grid.Column>
					</Grid>
				</Segment>
			</Grid.Column>
			</Grid.Row>
			<Divider />
			<Grid.Row style={noBoxShadow}>
			<Grid.Column style={noBoxShadow} verticalAlign='middle'>
				<Segment style={noBoxShadow}>
					<Grid style={noBoxShadow} columns={3}>
					<Grid.Column style={noBoxShadow} width={1}>
					</Grid.Column>
					<Grid.Column style={noBoxShadow} width={14}>
						<FrameworkList frameworks={frameworks}
										page={page}
										onChange={this.onChange}
										setSelected={this.setSelected} />
					</Grid.Column>
					<Grid.Column style={noBoxShadow} width={1}>
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

const FrameworkTable = withSelections((props) => {
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
	const frameworks = props.frameworks;

	function handleSelectLocal (id) {
		handleSelect(id);
	}

	useEffect(() => {
		setSelected(selections);
   	}, [props.selections]);

	if (!frameworks && !frameworks.length)
		return null;
		
	return(
		<div>
		<Container className='content-body'>
		<Segment basic textAlign="left" style={segmentStyle}>
			{!areAnySelected}
			<div style={{ visibility: areAnySelected ? 'visible' : 'hidden' }}>
				<span style={{marginRight: '8px'}}>{selectedCount} selected</span>
				<Button basic onClick={handleClearAll}>Clear</Button>
			</div>
			<div>
				<span>{frameworks.length} Fault Configurations</span>
			</div>
		</Segment>
		<div className = 'table-hscroll'>  
        <Table striped style={stdTable}>
			<Table.Header>
			<Table.Row>
				<Table.HeaderCell width={1}></Table.HeaderCell>
				<Table.HeaderCell width={3}>Fault Id</Table.HeaderCell>
				<Table.HeaderCell width={3}>Fault Error Code</Table.HeaderCell>
				<Table.HeaderCell width={3}>Severity</Table.HeaderCell>
				<Table.HeaderCell width={3}>Related Error Code</Table.HeaderCell>
				<Table.HeaderCell width={3}>Trap Category</Table.HeaderCell>
			</Table.Row>
			</Table.Header>
			<Table.Body>
			{frameworks.map(frame =>(
			<Table.Row key={frameworks.indexOf(frame)}>
				<Table.Cell>
				<Checkbox	checked={isItemSelected(frameworks.indexOf(frame))} 
							onChange={handleSelectLocal.bind(this, frameworks.indexOf(frame))} />
				</Table.Cell>
				<Table.Cell>{frame.faultId}</Table.Cell>
				<Table.Cell>{frame.faultErrorCode}</Table.Cell>
				<Table.Cell>{frame.severity}</Table.Cell>
				<Table.Cell>{frame.relatedErrorCode}</Table.Cell>
				<Table.Cell>{frame.trapCategory}</Table.Cell>
			</Table.Row>
			))}
			</Table.Body>
        </Table>
		</div>
		</Container>
		</div>
    );
});

class  FrameworkList extends React.Component{
	render() {
	return(
		<FrameworkTable frameworks={this.props.frameworks}
						page={this.props.page}
						onChange={this.props.onChange}
						setSelected={this.props.setSelected} />
	  );
	}
  }

class FrameworkToolbar extends React.Component{
	render() {
      return (      
		<Fragment>
			<AddButton getSelected={this.props.getSelected} getFrameworks={this.props.getFrameworks}/> 
			<ModifyButton getSelected={this.props.getSelected} getFrameworks={this.props.getFrameworks}/> 
			<DeleteButton getSelected={this.props.getSelected} getFrameworks={this.props.getFrameworks}/>
		</Fragment>
      );
    }
}

class AddButton extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			frameworks: {
				faultId: "",
				faultErrorCode: "",
				severity: "",
				relatedErrorCode: "",
				trapCategory: "",
			},
			status:"",
			show:false,
		};
		this.baseState = this.state.frameworks;
		this.handleAdd = this.handleAdd.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.getFrameworks = this.props.getFrameworks;
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
	}

	close() {
		this.setState({
		  show: false
		});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	handleAdd() {
		this.setState({frameworks: this.baseState});
		let body = this.state.frameworks;
		let frameworks = body;
		console.log("frameworks" + JSON.stringify(frameworks));
		client({
			method: 'POST', 
			path: '/api/faults-config/', 
			entity: frameworks, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.setState({status:"Added Successfully"});
			this.handleNotification('success','Added Successful');
			this.getFrameworks();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','Failed to Add');
		});
		this.close();
		return;
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let frameworks = {...this.state.frameworks};
		frameworks[name] = value;
		this.setState({frameworks});
	}

	updateStatus(value){
		this.setState({status:value});
	}
  	render(){
		return (
			<React.Fragment>
				<Button style={tbButton} onClick={this.toggleDrawer}>Create </Button>
				<Drawer show={this.state.show} onHide={this.close}>
					<Drawer.Header>
						<Header size='large'>Create Configuration</Header>
					</Drawer.Header>
					<Drawer.Body>
						<Grid columns='equal'>
							<Grid.Row>
								<Grid.Column width={2}></Grid.Column>
								<Grid.Column width={12}>
									<Form>
									<Grid columns='equal'>
										<Grid.Row>
										<Grid.Column>Error Code</Grid.Column>
										<Grid.Column>
										<Form.Input   name='faultErrorCode'
														value={this.state.frameworks.faultErrorCode}
														onChange={this.handleChange} >
										</Form.Input>
										</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column>Related Error Code</Grid.Column>
										<Grid.Column>
										<Form.Input  name='relatedErrorCode'
													value={this.state.frameworks.relatedErrorCode}
													onChange={this.handleChange} >
										</Form.Input>
										</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column>Severity Code</Grid.Column>
										<Grid.Column>
										<Form.Input   name='severity'
														value={this.state.frameworks.severity}
														onChange={this.handleChange} >
										</Form.Input>
										</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column>Trap Category</Grid.Column>
										<Grid.Column>
										<Form.Input   name='trapCategory'
														value={this.state.frameworks.trapCategory}
														onChange={this.handleChange} >
										</Form.Input>
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
								<Grid.Column></Grid.Column>
								<Grid.Column>
										<Button onClick={this.handleAdd.bind(this)} style={tbButton} icon 
												content='Submit'>
										</Button>
										<Button onClick={this.close} style={tbButton} icon 
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

class ModifyButton extends React.Component{

	constructor(props){
		super(props);	
		this.state = {
			frameworks: {
				faultId: "",
				faultErrorCode: "",
				severity: "",
				relatedErrorCode: "",
				trapCategory: "",
			},
			status:"",
			show: false,
		};
		this.baseState = this.state.frameworks;
		this.handleModify = this.handleModify.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.getFrameworks = this.props.getFrameworks;
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
	}
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	handleLoad() {
		this.setState({frameworks: this.baseState});
		let id = this.getSelectedCb();
		console.log("id : " + id);
		if (id == null)
			return;
		client({method: 'GET', path: '/api/faults-config/' + id}).done(response => {
			this.setState({frameworks: response.entity});
			this.setState({isLoggedin: true});
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

	close() {
		this.setState({
		  show: false
		});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	handleModify() {
		let id = this.getSelectedCb();
		let body = this.state.frameworks;
		delete body.id;
		var frameworks = body;
		client({
			method: 'PUT', 
			path: '/api/faults-config/' + id, 
			entity: frameworks, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.setState({status:"Update Successful"});
			this.handleNotification('success','Update Successful');
			this.getFrameworks();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Update Failed"});
			this.handleNotification('error','Update Failed');
		});
		this.close();
		return;
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let frameworks = {...this.state.frameworks};
		frameworks[name] = value;
		this.setState({frameworks});
	}

	updateStatus(value){
		this.setState({status:value});
	}
	render() {
    	return(
			<React.Fragment>
			<Button onClick={this.toggleDrawer} style={tbButton}>Modify </Button>
			<Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
			<Drawer.Header>
				<Header size='large'>Modify Configuration</Header>
			</Drawer.Header>
			<Drawer.Body>
				<Grid columns='equal'>
                	<Grid.Row>
                  		<Grid.Column width={2}></Grid.Column>
                  		<Grid.Column width={12}>
                    		<Form>
                    		<Grid columns='equal'>
							  <Grid.Row>
								<Grid.Column>Error Code</Grid.Column>
								<Grid.Column>
								  <Form.Input   name='faultErrorCode'
												value={this.state.frameworks.faultErrorCode}
												onChange={this.handleChange} >
								  </Form.Input>
								</Grid.Column>
							  </Grid.Row>
							  <Grid.Row>
								<Grid.Column>Related Error Code</Grid.Column>
								<Grid.Column>
								  <Form.Input   name='relatedErrorCode'
												value={this.state.frameworks.relatedErrorCode}
												onChange={this.handleChange} >
								  </Form.Input>
								</Grid.Column>
							  </Grid.Row>
							  <Grid.Row>
								<Grid.Column>Trap Category</Grid.Column>
								<Grid.Column>
								  <Form.Input  name='trapCategory'
											   value={this.state.frameworks.trapCategory}
											   onChange={this.handleChange} >
								  </Form.Input>
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
						<Grid.Column></Grid.Column>
						<Grid.Column>
								<Button onClick={this.handleModify.bind(this)} style={tbButton} 
										icon content='Submit'>
								</Button>
								<Button onClick={this.close} style={tbButton} 
										icon floated='right' content='Cancel'>
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

class DeleteButton extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			status:"",
		};
		this.handleDelete = this.handleDelete.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.getFrameworks = this.props.getFrameworks;
	}
	openModal = () => {
		this.setState({ showModal: true })
	}
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	closeModal = () => {
		this.setState({ showModal: false })
	}

	handleDelete() {
		let id = this.getSelectedCb();
		this.onDelete(id);
		return;
	}

	onDelete(id) {
		client({method: 'DELETE', path: '/api/faults-config/'+ id}).done(response => {
			this.setState({status:"Deleted Successful"});
			this.handleNotification('success','Deleted Successful');
			this.closeModal();
			this.getFrameworks();
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
	handleChange(value){
		this.setState({status:value});
	}
	render() {
		return(
			<Modal dimmer='inverted' open={this.state.showModal} onClose={this.closeModal} 
				   trigger={<Button style={tbButton} onClick={this.openModal}>Delete </Button>}>
				<Modal.Header>Delete Configuration </Modal.Header>
					<Modal.Content>
						<Grid columns='equal'>
							<Grid.Row>
								<p>Are you sure you want to delete</p>
							</Grid.Row>
							<Grid.Row></Grid.Row>
							<Grid.Row>
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
export default FaultConfig;