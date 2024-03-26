import React, {Fragment, useEffect} from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';
import { Drawer } from 'rsuite';
import BreadCrumb from '../Widgets/BreadCrumb';
import { Notification } from 'rsuite';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import { 
	Grid, Segment, Container, Modal, 
	Button, Header, Input, Checkbox,
	Label, TextArea, Dropdown, Divider,
    Form, Icon, Component, Pagination,
    Table } from 'semantic-ui-react';

import { menuStyle, noBorder, noPadding, 
		 noBoxShadow, tbButton, stdTable, 
		 segmentStyle, 
		 drawerStyle} from '../../constants';

import 'semantic-ui-css/semantic.min.css';

const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const root = '/api';

class PasswordPolicy extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			passwordPolicy: [], 
			selected: [], 
			page: {size: 0, totalPages : 0, number: 0},
			isLoggedIn: false
		};
		const updated =  false;
  		this.setSelected = this.setSelected.bind(this);
		this.getSelected = this.getSelected.bind(this);
		this.handleSort = this.handleSort.bind(this);
		this.getPolicies = this.getPolicies.bind(this);
	}
	selectUpdateDone () {
		this.updated = true;
	}


	setSelected (items) {
		
		let sel = Object.keys(items);
		let id;
		if (Array.isArray(sel) && sel.length) {
			let rid = this.state.passwordPolicy[sel[0]].policyId;
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
	handleSort(columnName, direction) {
		client({method: 'GET', 
				path: '/api/security-policies-password?sort=' + columnName + ',' + direction
		})
		.done(response => {
			this.setState({passwordPolicy: response.entity._embedded["security-policies-password"]});
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
	getPolicies() {
		client({method: 'GET', path: '/api/security-policies-password'}).done(response => {
			this.setState({passwordPolicy: response.entity._embedded["security-policies-password"]});
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
		this.getPolicies();
	}

  	render() {
		const isLoggedIn = this.state.isLoggedIn;
		const passwordPolicy = this.state.passwordPolicy;
		const page = this.state.page;
	  
	  	return(
	  		<Container>
			<Grid style={noBoxShadow} centered verticalAlign='middle'>
			  	<Grid.Row style={noBoxShadow}>
			  		<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Segment style={noBoxShadow}>
						<Grid columns={3} verticalAlign='middle'>
							<Grid.Column width={3} verticalAlign='middle' textAlign='left'>
							{<BreadCrumb/>}
								<Header size='medium'>Policy Administration</Header>
							</Grid.Column>
							<Grid.Column width={6} verticalAlign='middle' textAlign='left'>							
							</Grid.Column>
							<Grid.Column width={7} textAlign='right' verticalAlign='middle'>
							<Fragment>
								<PasswordPolicyToolbar getSelected={this.getSelected} 
													   getPolicies={this.getPolicies}
								/></Fragment>
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
								<PasswordPolicyList   passwordPolicy={passwordPolicy}
													  page={page}
													  setSelected={this.setSelected}
													  handleSort={this.handleSort}
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

class PasswordPolicyToolbar extends React.Component{
	render() {
		return(
			<Fragment>
				<AddButton getSelected={this.props.getSelected} getPolicies={this.props.getPolicies} />
				<ModifyButton getSelected={this.props.getSelected} getPolicies={this.props.getPolicies}/> 
				<DelButton getSelected={this.props.getSelected} getPolicies={this.props.getPolicies}
			/>
			</Fragment>
		)
	}
}

class PasswordPolicyList extends React.Component{
	render() {
	  return <PasswordPolicyTable setSelected={this.props.setSelected}
	  							  page={this.props.page}
		  						  passwordPolicy = {this.props.passwordPolicy}
								  handleSort = {this.props.handleSort}
	  		/>;
	}
  }

const PasswordPolicyTable = withSelections((props) =>{
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
	const passwordPolicy = props.passwordPolicy;
	const handleSort = props.handleSort;

	function handleSelectLocal (id) {
		handleSelect(id);
	}


	useEffect(() => {
		setSelected(selections);
	}, [props.selections]);	
	
	if (!passwordPolicy && !passwordPolicy.length)
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
				<span>{passwordPolicy.length} policies</span>
				</div>
			</Segment>
			<div className = 'table-hscroll'>
			<Table striped style={stdTable}>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell width={1}>
						</Table.HeaderCell>
						<Table.HeaderCell width={2}>Policy Name</Table.HeaderCell>
						<Table.HeaderCell width={2}>
							Maximum Fail Attempts
							<Icon name='caret up' onClick={() =>
								handleSort('maxFailAttempts','asc')}/>
							<Icon name='caret down' onClick={() =>
								handleSort('maxFailAttempts','desc')}/>
						</Table.HeaderCell>
						<Table.HeaderCell width={2}>
							Password Expiry Days
							<Icon name='caret up' onClick={() =>
								handleSort('passExpDays','asc')}/>
							<Icon name='caret down' onClick={() =>
								handleSort('passExpDays','desc')}/>
						</Table.HeaderCell>
						<Table.HeaderCell width={2}>
							Min Length 
							<Icon name='caret up' onClick={() =>
								handleSort('minLength','asc')}/>
							<Icon name='caret down' onClick={() =>
								handleSort('minLength','desc')}/>
						</Table.HeaderCell>
						<Table.HeaderCell width={2}>Min Digits</Table.HeaderCell>
						<Table.HeaderCell width={2}>Min Upper Char</Table.HeaderCell>
						<Table.HeaderCell>Min Lower Char</Table.HeaderCell>
						<Table.HeaderCell width={2}>
							Num of Multiple Logins
							<Icon name='caret up' onClick={() =>
								handleSort('numMultLogin','asc')}/>
							<Icon name='caret down' onClick={() =>
								handleSort('numMultLogin','desc')}/>
						</Table.HeaderCell>
						<Table.HeaderCell width={2}>
							Min Reuse Days
							<Icon name='caret up' onClick={() =>
								handleSort('minReuseDays','asc')}/>
							<Icon name='caret down' onClick={() =>
								handleSort('minReuseDays','desc')}/>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
				{passwordPolicy.map(policy =>(
					<Table.Row key = {passwordPolicy.indexOf(policy)}>
						<Table.Cell>
							<Checkbox checked={isItemSelected(passwordPolicy.indexOf(policy))} 
									  onChange={handleSelectLocal.bind(this, 
									  			passwordPolicy.indexOf(policy))}/>
						</Table.Cell>
						<Table.Cell>{policy.policyName}</Table.Cell>
						<Table.Cell>{policy.maxFailAttempts}</Table.Cell>
						<Table.Cell>{policy.passExpDays}</Table.Cell>
						<Table.Cell>{policy.minLength}</Table.Cell>
						<Table.Cell>{policy.minDigits}</Table.Cell>
						<Table.Cell>{policy.minUpperChar}</Table.Cell>
						<Table.Cell>{policy.minLowerChar}</Table.Cell>
						<Table.Cell>{policy.numMultLogin}</Table.Cell>
						<Table.Cell>{policy.minReuseDays}</Table.Cell>
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
			passwordpolicy: {
				policyName:"",
				maxFailAttempts:"",
				passExpDays:"",
				minLength:"",
				minDigits:"",
				minSplChar:"",
				minUpperChar:"",
				minLowerChar:"",
				numMultLogin:"",
				numOldPass: "",
				minReuseDays:""
			},
			status:"",
			show:false,
			
		};
		this.baseState = this.state.passwordpolicy;
		this.handleNotification = this.handleNotification.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.getPoliciesCb = this.props.getPolicies.bind(this);
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
		this.setState({passwordpolicy: this.baseState});
		let body = this.state.passwordpolicy;
		var passwordPolicy = body;
		client({
			method: 'POST', 
			path: '/api/security-policies-password/', 
			entity: passwordPolicy, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.setState({status:"Added Successfully"});
			this.handleNotification('success','Added policy Successfully');
			this.getPoliciesCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Failed to Add"});
			this.handleNotification('error','Failed to Add policy');
		});
		this.close();
		return;
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let passwordpolicy = {...this.state.passwordpolicy};
		passwordpolicy[name] = value;
		this.setState({passwordpolicy});
	}

	updateStatus(value){
		this.setState({status:value});
    }
    
    render(){
	  	const {passwordpolicy} = this.state;
		return (
			<React.Fragment> 
			<Button style={tbButton} onClick={this.toggleDrawer}>Create</Button>
			<Drawer show={this.state.show} onHide={this.close}>
				<Drawer.Header> 
				<Header size='large'>Create Policy</Header>
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
									<Grid.Column>Policy Name</Grid.Column>
									<Grid.Column>
										<Form.Input type='text'
													name='policyName'
													value={passwordpolicy.policyName}
													onChange={this.handleChange}>
										</Form.Input>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Max Fail Attempts</Grid.Column>
									<Grid.Column>
										<Form.Input type='number'
													name='maxFailAttempts'
													value={passwordpolicy.maxFailAttempts}
													onChange={this.handleChange}>
										</Form.Input>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Password Expiry Days</Grid.Column>
									<Grid.Column>
										<Form.Input type='number'
													name='passExpDays'
													value={passwordpolicy.passExpDays}
													onChange={this.handleChange}>
										</Form.Input>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Min Length</Grid.Column>
									<Grid.Column>
										<Form.Input type='number'
													name='minLength'
													value={passwordpolicy.minLength}
													onChange={this.handleChange}>
										</Form.Input>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Min Digits</Grid.Column>
									<Grid.Column>
										<Form.Input type='number'
													name='minDigits'
													value={passwordpolicy.minDigits}
													onChange={this.handleChange}>
										</Form.Input>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Min Special Char</Grid.Column>
									<Grid.Column>
										<Form.Input type='number' 
													name='minSplChar'
													value={passwordpolicy.minSplChar}
													onChange={this.handleChange}>
										</Form.Input>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Min Upper Char</Grid.Column>
									<Grid.Column>
										<Form.Input type='number' 
													name='minUpperChar'
													value={passwordpolicy.minUpperChar}
													onChange={this.handleChange}>
										</Form.Input>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Min Lower Char</Grid.Column>
									<Grid.Column>
										<Form.Input type='number' 
													name='minLowerChar'
													value={passwordpolicy.minLowerChar}
													onChange={this.handleChange}>
										</Form.Input>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Num of Multiple Login</Grid.Column>
									<Grid.Column>
										<Form.Input type='number' 
													name='numMultLogin'
													value={passwordpolicy.numMultLogin}
													onChange={this.handleChange}>
										</Form.Input>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Num of Old Passwords</Grid.Column>
									<Grid.Column>
										<Form.Input type='number' 
													name='numOldPass'
													value={passwordpolicy.numOldPass}
													onChange={this.handleChange}>
										</Form.Input>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Min Reuse Days</Grid.Column>
									<Grid.Column>
										<Form.Input type='number' 
													name='minReuseDays'
													value={passwordpolicy.minReuseDays}
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
		this.getPoliciesCb = this.props.getPolicies;
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
		client({method: 'DELETE', path: '/api/security-policies-password/'+ id}).done(response => {
			this.setState({status:"Deleted Successful"});
			this.handleNotification('success','Deleted policy Successfully');
			this.getPoliciesCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Deleted Failed"});
			this.handleNotification('error','Deletion of policy has failed');
		});
	}
	render() {
		return(
			<Modal  dimmer='inverted' open={this.state.showModal} onClose={this.closeModal} 
					trigger={<Button style={tbButton} onClick={this.openModal}>Delete</Button>}>
				<Modal.Header>Delete Password Policy</Modal.Header>
					<Modal.Content>
						<Grid columns='equal'>
							<Grid.Row>
								<p>Are you sure you want to delete this Policy</p>
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
			passwordpolicy: {
				policyName:"",
				maxFailAttempts:"",
				passExpDays:"",
				minLength:"",
				minDigits:"",
				minSplChar:"",
				minUpperChar:"",
				minLowerChar:"",
				numMultLogin:"",
				minReuseDays:""
			},
			status:"",
			show:false,
		};
		this.baseState = this.state.passwordpolicy;
		this.handleNotification = this.handleNotification.bind(this);
		this.handleModify = this.handleModify.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.getPoliciesCb = this.props.getPolicies;
	}
	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	handleLoad() {
		this.setState({passwordpolicy: this.baseState});
		let policyId = this.getSelectedCb();
		if (policyId == null)
			return;
		client({method: 'GET', path: '/api/security-policies-password/' + policyId}).done(response => {
			this.setState({passwordpolicy: response.entity});
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
		let policyId = this.getSelectedCb();
		let body = this.state.passwordpolicy;
		delete body.policyId;
		var passwordpolicy = body;
		client({
			method: 'PUT', 
			path: '/api/security-policies-password/' + policyId, 
			entity: passwordpolicy, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.setState({status:"Modify Successful"});
			this.handleNotification('success','Modify policy is Successfully implemented');
			this.getPoliciesCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Failed to Modify"});
			this.handleNotification('error','Modifying policy is UnSuccessful');
		});
		this.close();
		return;
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let passwordpolicy = {...this.state.passwordpolicy};
		passwordpolicy[name] = value;
		this.setState({passwordpolicy});
	}

	updateStatus(value){
		this.setState({status:value});
	}
	render(){
        const {passwordpolicy} = this.state;
	  return (
		<React.Fragment>  
			<Button style={tbButton}  onClick={this.toggleDrawer}>Modify</Button>
			<Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
			<Drawer.Header>
				<Header size='large'>Modify Policy</Header>
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
					  			<Grid.Column>Policy Name</Grid.Column>
					  			<Grid.Column>
					  				<Form.Input type='text'
						  						name='policyName'
						  						value={passwordpolicy.policyName}
						  						onChange={this.handleChange}>
					  				</Form.Input>
					  			</Grid.Column>
				  			</Grid.Row>
				  			<Grid.Row>
					  			<Grid.Column>Max Fail Attempts</Grid.Column>
					  			<Grid.Column>
					  				<Form.Input type='number'
												name='maxFailAttempts'
												value={passwordpolicy.maxFailAttempts}
						  						onChange={this.handleChange}>
					  				</Form.Input>
					  			</Grid.Column>
				  			</Grid.Row>
				  			<Grid.Row>
					  			<Grid.Column>Password Expiry Days</Grid.Column>
					  			<Grid.Column>
					  				<Form.Input type='number'
												name='passExpDays'
												value={passwordpolicy.passExpDays}
												onChange={this.handleChange}>
					  				</Form.Input>
					  			</Grid.Column>
				  			</Grid.Row>
				  			<Grid.Row>
					  			<Grid.Column>Min Length</Grid.Column>
					  			<Grid.Column>
					  				<Form.Input	type='number'
												name='minLength'
												value={passwordpolicy.minLength}
												onChange={this.handleChange}>
					  				</Form.Input>
					  			</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Min Digits</Grid.Column>
								<Grid.Column>
									<Form.Input type='number'
												name='minDigits'
												value={passwordpolicy.minDigits}
												onChange={this.handleChange}>
					  				</Form.Input>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Min Special Char</Grid.Column>
								<Grid.Column>
                                <Form.Input type='number'
											name='minSplChar'
											value={passwordpolicy.minSplChar}
											onChange={this.handleChange}>
					  				</Form.Input>
								</Grid.Column>
							</Grid.Row>
				  			<Grid.Row>
								<Grid.Column>Min Upper Char</Grid.Column>
								<Grid.Column>
                                <Form.Input type='number'
											name='minUpperChar'
											value={passwordpolicy.minUpperChar}
											onChange={this.handleChange}>
					  				</Form.Input>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Min Lower Char</Grid.Column>
								<Grid.Column>
                                <Form.Input type='number'
											name='minLowerChar'
											value={passwordpolicy.minLowerChar}
											onChange={this.handleChange}>
					  				</Form.Input>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Num of Multiple Login</Grid.Column>
								<Grid.Column>
                                <Form.Input type='number'
											name='numMultLogin'
											value={passwordpolicy.numMultLogin}
											onChange={this.handleChange}>
					  				</Form.Input>
								</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column>Min Reuse Days</Grid.Column>
								<Grid.Column>
                                <Form.Input type='number'
											name='minReuseDays'
											value={passwordpolicy.minReuseDays}
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
    
export default PasswordPolicy;