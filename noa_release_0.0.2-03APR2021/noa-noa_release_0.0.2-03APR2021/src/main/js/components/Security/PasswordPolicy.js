/**@module PasswordPolicy*/
import React, {Fragment, useEffect} from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';

import { Drawer } from 'rsuite';

import BreadCrumb from '../Widgets/BreadCrumb';

import { Notification } from 'rsuite';

import { 
	Grid, 
	Segment, 
	Container, 
	Modal, 
	Button, 
	Header, 
	Checkbox,
	Divider,
    Form, 
	Icon,
    Table 
} from 'semantic-ui-react';

import { 
	noBoxShadow, 
	tbButton, 
	stdTable, 
    segmentStyle, 
} from '../../constants';

import 'semantic-ui-css/semantic.min.css';

import { Formik } from 'formik';
import * as yup from 'yup';

const client = require('../../utils/client');

/**
 * Component for Password Policy Management. implements functionality to
 * fetch Password Policies and perform operations on them.
 * 
 * @class
 * @augments React.Component
*/
class PasswordPolicy extends React.Component { 

	/**
     * PasswordPolicy constructor. Initializes state to hold PasswordPolicy Records
     * and user selections.
     * 
     * @constructor
     * @param {*} props 
    */
	constructor(props) {
		super(props);
		this.state = {
			passwordPolicy : [], 
			selected : [], 
			page : {size: 0, totalPages : 0, number: 0},
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

	/**
     * Updates the component state with the list of Password Policy Items selected by the User.
     * A callback passed to and invoked by {@link PasswordPolicyTable}.
     * 
     * @param {Object} items Keyed object where the key is a specified id of the item in the list.
    */
	setSelected (items) {
		let sel = Object.keys(items);
		let id;
		if (Array.isArray(sel) && sel.length) {
			let rid = this.state.passwordPolicy[sel[0]].policyId;
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
     * Gets the list of User selected Password Policy Items to operate upon.
     * A callback passed to the children of {@link PasswordPolicyToolbar}.
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
     * Performs a REST query to fetch Sorted listed of Password Policy Records and 
     * updates component state.
	 * A callback passed to the children of {@link PasswordPolicyList}.
     * 
     * @param {*} columnName Column name of the Password Policy Record table.
     * @param {*} direction Direction of sort (Ascending or Descending).
    */
	handleSort(columnName, direction) {
		client({method: 'GET', 
				path: '/api/security-policies-password?sort=' + columnName + ',' + direction
		})
		.done(response => {
			this.setState({passwordPolicy: response.entity._embedded["security-policies-password"]});
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
	 * Makes a REST request and gets the all the Password Policies with Pagination
	 * and updates the component's State.
	*/
	getPolicies() {
		client({method: 'GET', path: '/api/security-policies-password'}).done(response => {
			this.setState({passwordPolicy: response.entity._embedded["security-policies-password"]});
			this.setState({page: response.entity.page});
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');
			}
		});
	}

	componentDidMount() {
		this.getPolicies();
	}

	/**
     * Renders Password Policy component view invoking child components {@link PasswordPolicyToolbar} 
     * and {@link PasswordPolicyList} with Password Policies fetched on component mount.
	 * 
    */
  	render() {
		const passwordPolicy = this.state.passwordPolicy;
		const page = this.state.page;
	  
	  	return(
	  		<Container>
				<Grid style={noBoxShadow} centered verticalAlign='middle'>
					<Grid.Row style={noBoxShadow}>
						<Grid.Column style={noBoxShadow} verticalAlign='middle'>
							<Segment style={noBoxShadow}>
								<Grid columns={3} verticalAlign='middle'>
									<Grid.Column 
											width={3} 
											verticalAlign='middle' textAlign='left'>
										<BreadCrumb/>
										<Header size='medium'>Policy Administration</Header>
									</Grid.Column>
									<Grid.Column width={6} 
												verticalAlign='middle'
									 			textAlign='left'>	 
									 </Grid.Column>
									<Grid.Column width={7} textAlign='right' verticalAlign='middle'>
										<Fragment>
											<PasswordPolicyToolbar 
												getSelected={this.getSelected} 
												getPolicies={this.getPolicies}
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
										<PasswordPolicyList 
												passwordPolicy={passwordPolicy}
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

/**
 * Component for rendering the Password Policy Management toolbar. Child of {@link PasswordPolicy}.
 * 
 * @class
 * @augments React.Component
*/
class PasswordPolicyToolbar extends React.Component {
	render() {
		return(
			<Fragment>
				<CreatePasswordPolicy getSelected={this.props.getSelected} getPolicies={this.props.getPolicies}/>
				<ModifyPasswordPolicy getSelected={this.props.getSelected} getPolicies={this.props.getPolicies}/> 
				<DeletePasswordPolicy getSelected={this.props.getSelected} getPolicies={this.props.getPolicies}/>
			</Fragment>
		)
	}
}

/**
 * Component for rendering list of Password Policies. Child of {@link PasswordPolicy}.
 * 
 * @class
 * @augments React.Component
*/
class PasswordPolicyList extends React.Component {
	render() {
	  return( 
			<PasswordPolicyTable setSelected={this.props.setSelected}
								page={this.props.page}
								passwordPolicy = {this.props.passwordPolicy}
								handleSort = {this.props.handleSort}
			/>
	    )
	}
}

/**
 * Renders a tabular view of Password Policy Records with data passed from {@link PasswordPolicy} component. 
 * Implements selection mechanism through withSelections() hook.
 * 
 * @prop {ReactNode} props Callbacks exposed by withSelections() hook.
 * @prop {Function} setSelected Callback to update parent's state with a list of selected Password Policy Items.
 * @prop {Function} handleSort Callback to sort the list of selected Password Policy Items.
 * @prop {Array} passwordPolicy List of Password Policy Records to be rendered.
 * @return {JSX} Rendered tabular view of Password Policy Records.
*/
const PasswordPolicyTable = withSelections((props) =>{
	const {     
		areAnySelected,
		selectedCount,
		handleClearAll,
		handleSelect,
		isItemSelected,
		selections,
	} = props;

	/**
     * @callback setSelected Update state with the list of Password Policy Items selected by the User.
    */
	const setSelected = props.setSelected;

	/** 
     * List of Password Policy Records to be rendered.
     * @type {Array}
    */
	const passwordPolicy = props.passwordPolicy;
	
	/**
     * @callback handleSort Update state with the list of Sorted Password Policy Items selected by the User.
    */
	const handleSort = props.handleSort;

	function handleSelectLocal (id) {
		handleSelect(id);
	}

    /**
     * Handles the side effect of changed selections and updates the parent State 
     * with modified set of selected Password Policy Items.
    */
	useEffect(() => {
		setSelected(selections);
	}, [props.selections]);	
	
	if (!passwordPolicy && !passwordPolicy.length)
		return null;

	return (
		<div>
		<Container className='content-header' textAlign='right'></Container>
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
						<Table.HeaderCell width={1}></Table.HeaderCell>
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
				<Table.Footer></Table.Footer>				
			</Table>
			</div>
		</Container>
	</div>
	)   
});

let passwordPolicySchema = yup.object().shape({
	policyName : yup.string()
				.min(4, "Too Short.")
				.required("Policy Name is a Required Field."),
	maxFailAttempts : yup.string()
					.min(1, "Minimum 1 Required.")
					.required("Maximum Fail Attempts is a Required Field."),
	passExpDays : yup.string()
					.min(1, "Minimum 1 Required.")
					.required("Password Expiry Days is a Required Field."),
	minLength : yup.string()
					.min(1, "Minimum 1 Required.")
					.required("Minimum Length is a Required Field."),
	minDigits : yup.string()
					.min(1, "Minimum 1 Required.")
					.required("Minimum Digits is a Required Field."),
	minSplChar : yup.string()
					.min(1, "Minimum 1 Required.")
					.required("Minimum Special Characters is a Required Field."),
	minUpperChar : yup.string()
					.min(1, "Minimum 1 Required.")
					.required("Minimum Upper Characters is a Required Field."),
	minLowerChar : yup.string()
					.min(1, "Minimum 1 Required.")
					.required("Minimum Lower Characters is a Required Field."),
	numMultLogin : yup.string()
					.required("Number of Multiple Logins is a Required Field."),
	numOldPass : yup.string()
					.min(1, "Minimum 1 Required.")
					.required("Number of Old Passwords is a Required Field."),
	minReuseDays : yup.string()
					.min(1, "Minimum 1 Required.")
					.required("Minimum Reuse Days is a Required Field."),
})

/**
 * Component for rendering the Button & Drawer views for Creating new Password Policy.
 * Child of {@link PasswordPolicyToolbar}.
 * 
 * @class
 * @augments React.Component
*/
class CreatePasswordPolicy extends React.Component{	

	/**
     * Initializes state to Create new Password Policy.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
    */
	constructor(props){
		super(props);
		this.state = {
			passwordpolicy:
			 {
				policyId:"",
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
	
	/**
	 * Updates State of Drawer to Close.
	*/
	close() {
		this.setState({show: false});
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
	 * Updates State of Drawer to Open.
	*/
	toggleDrawer() {
		this.setState({ show: true });
	}

	/**
     * Performs a REST request to Create a New Password Policy.
	 * Also fetches the updated list of Password Policies.
	 * 
    */
	handleAdd() {
		let body = this.state.passwordpolicy;
		client({
			method: 'POST', 
			path: '/api/security-policies-password/', 
			entity: body, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.handleNotification('success','Added policy Successfully');
			this.setState({passwordpolicy: this.baseState});
			this.getPoliciesCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
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

	handleCreatePolicy(values) {
		this.setState({passwordpolicy: values});
		this.handleAdd();
	}
	
	/**
     * Renders a Button view to initiate Create Password Policy operation and 
     * the Drawer view to Enter Details of the Policy.
    */
    render() {
	  	const passwordpolicy = this.state.passwordpolicy;
		return (
			<React.Fragment> 
				<Button style={tbButton} onClick={this.toggleDrawer}>Create</Button>
				<Drawer show={this.state.show} onHide={this.close}>
					<Drawer.Header> 
						<Header size='large'>Create Policy</Header>
					</Drawer.Header>
					<Drawer.Body>
					<Formik
						initialValues={passwordpolicy}
						validationSchema={passwordPolicySchema}
						onSubmit={(values) => {
							this.handleCreatePolicy(values);
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
												<Grid.Column>Policy Name</Grid.Column>
												<Grid.Column>
													<Form.Input type='text'
																name='policyName'
																value={values.policyName}
																onChange={handleChange}>
													</Form.Input>
													<p style={{color: 'red'}}>
														{errors.policyName 
														&& touched.policyName 
														&& errors.policyName}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Max Fail Attempts</Grid.Column>
												<Grid.Column>
													<Form.Input type='number'
																name='maxFailAttempts'
																value={values.maxFailAttempts}
																onChange={handleChange}>
													</Form.Input>
													<p style={{color: 'red'}}>
														{errors.maxFailAttempts 
														&& touched.maxFailAttempts 
														&& errors.maxFailAttempts}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Password Expiry Days</Grid.Column>
												<Grid.Column>
													<Form.Input type='number'
																name='passExpDays'
																value={values.passExpDays}
																onChange={handleChange}>
													</Form.Input>
													<p style={{color: 'red'}}>
														{errors.passExpDays 
														&& touched.passExpDays 
														&& errors.passExpDays}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Min Length</Grid.Column>
												<Grid.Column>
													<Form.Input type='number'
																name='minLength'
																value={values.minLength}
																onChange={handleChange}>
													</Form.Input>
													<p style={{color: 'red'}}>
														{errors.minLength 
														&& touched.minLength 
														&& errors.minLength}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Min Digits</Grid.Column>
												<Grid.Column>
													<Form.Input type='number'
																name='minDigits'
																value={values.minDigits}
																onChange={handleChange}>
													</Form.Input>
													<p style={{color: 'red'}}>
														{errors.minDigits 
														&& touched.minDigits 
														&& errors.minDigits}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Min Special Char</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' 
																name='minSplChar'
																value={values.minSplChar}
																onChange={handleChange}>
													</Form.Input>
													<p style={{color: 'red'}}>
														{errors.minSplChar 
														&& touched.minSplChar 
														&& errors.minSplChar}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Min Upper Char</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' 
																name='minUpperChar'
																value={values.minUpperChar}
																onChange={handleChange}>
													</Form.Input>
													<p style={{color: 'red'}}>
														{errors.minUpperChar 
														&& touched.minUpperChar 
														&& errors.minUpperChar}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Min Lower Char</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' 
																name='minLowerChar'
																value={values.minLowerChar}
																onChange={handleChange}>
													</Form.Input>
													<p style={{color: 'red'}}>
														{errors.minLowerChar 
														&& touched.minLowerChar 
														&& errors.minLowerChar}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Num of Multiple Login</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' 
																name='numMultLogin'
																value={values.numMultLogin}
																onChange={handleChange}>
													</Form.Input>
													<p style={{color: 'red'}}>
														{errors.numMultLogin 
														&& touched.numMultLogin 
														&& errors.numMultLogin}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Num of Old Passwords</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' 
																name='numOldPass'
																value={values.numOldPass}
																onChange={handleChange}>
													</Form.Input>
													<p style={{color: 'red'}}>
														{errors.numOldPass 
														&& touched.numOldPass 
														&& errors.numOldPass}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Min Reuse Days</Grid.Column>
												<Grid.Column>
													<Form.Input type='number' 
																name='minReuseDays'
																value={values.minReuseDays}
																onChange={handleChange}>
													</Form.Input>
													<p style={{color: 'red'}}>
														{errors.minReuseDays 
														&& touched.minReuseDays 
														&& errors.minReuseDays}
													</p>
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
								<Grid.Column></Grid.Column>
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
					</Drawer.Body>
				</Drawer>
			</React.Fragment>  
		);
  	}
}

/**
 * Component for rendering the Button & Drawer views for Modifying existing Password Policy.
 * Child of {@link PasswordPolicyToolbar}.
 * 
 * @class
 * @augments React.Component
*/
class ModifyPasswordPolicy extends React.Component {

	/**
     * Initializes state to hold Record for the selected Password Policy.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
    */
	constructor(props) {
		super(props);
		this.state = {
			passwordpolicy : 
			{
				policyId : "",
				policyName : "",
				maxFailAttempts : "",
				passExpDays : "",
				minLength : "",
				minDigits : "",
				minSplChar : "",
				minUpperChar : "",
				minLowerChar : "",
				numMultLogin : "",
				minReuseDays : ""
			},
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
     * Performs a REST request to fetch the details of the User selcted Policy Record
     * for display in the Drawer.
     * 
     * @returns {void} On invalid selection.
    */
	handleLoad() {
		this.setState({passwordpolicy: this.baseState});
		let policyId = this.getSelectedCb();
		if (policyId == null)
			return;
		client({method: 'GET', path: '/api/security-policies-password/' + policyId}).done(response => {
			this.setState({passwordpolicy: response.entity});
			this.setState({showModal:true});
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

	close() {
		this.setState({show: false});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	/**
     * Performs a REST request to Modify the User selcted Password Policy.
	 * Also fetches the updated list of Password Policies.
	 * 
    */
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
			this.handleNotification('success','Modify policy is Successfully implemented');
			this.getPoliciesCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
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

	/**
     * Renders a Button view to initiate Modify operation on selected Policy and 
     * the Drawer view to display the user selected Policy Details.
    */
	render() {
        const passwordpolicy = this.state.passwordpolicy;
	  return (
		<React.Fragment>  
			<Button style={tbButton}  onClick={this.toggleDrawer}>Modify</Button>
			<Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
				<Drawer.Header>
					<Header size='large'>Modify Policy</Header>
				</Drawer.Header>
				<Drawer.Body>
				{passwordpolicy.policyId ? 	
				<Formik
					initialValues={passwordpolicy}
					validationSchema={passwordPolicySchema}
					onSubmit={(values) => {
						this.setState({passwordpolicy: values});
						this.handleModify();
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
											<Grid.Column>Policy Name</Grid.Column>
											<Grid.Column>
												<Form.Input type='text'
															name='policyName'
															value={values.policyName}
															onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.policyName 
													&& touched.policyName 
													&& errors.policyName}
                                				</p>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Max Fail Attempts</Grid.Column>
											<Grid.Column>
												<Form.Input type='number'
															name='maxFailAttempts'
															value={values.maxFailAttempts}
															onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.maxFailAttempts 
													&& touched.maxFailAttempts 
													&& errors.maxFailAttempts}
                                				</p>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Password Expiry Days</Grid.Column>
											<Grid.Column>
												<Form.Input type='number'
															name='passExpDays'
															value={values.passExpDays}
															onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.passExpDays 
													&& touched.passExpDays 
													&& errors.passExpDays}
                                				</p>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Min Length</Grid.Column>
											<Grid.Column>
												<Form.Input	type='number'
															name='minLength'
															value={values.minLength}
															onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.minLength 
													&& touched.minLength 
													&& errors.minLength}
                                				</p>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Min Digits</Grid.Column>
											<Grid.Column>
												<Form.Input type='number'
															name='minDigits'
															value={values.minDigits}
															onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.minDigits 
													&& touched.minDigits 
													&& errors.minDigits}
                                				</p>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Min Special Char</Grid.Column>
											<Grid.Column>
											<Form.Input type='number'
														name='minSplChar'
														value={values.minSplChar}
														onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.minSplChar 
													&& touched.minSplChar 
													&& errors.minSplChar}
                                				</p>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Min Upper Char</Grid.Column>
											<Grid.Column>
											<Form.Input type='number'
														name='minUpperChar'
														value={values.minUpperChar}
														onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.minUpperChar 
													&& touched.minUpperChar 
													&& errors.minUpperChar}
                                				</p>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Min Lower Char</Grid.Column>
											<Grid.Column>
											<Form.Input type='number'
														name='minLowerChar'
														value={values.minLowerChar}
														onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.minLowerChar 
													&& touched.minLowerChar 
													&& errors.minLowerChar}
                                				</p>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Num of Multiple Login</Grid.Column>
											<Grid.Column>
											<Form.Input type='number'
														name='numMultLogin'
														value={values.numMultLogin}
														onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.numMultLogin 
													&& touched.numMultLogin 
													&& errors.numMultLogin}
                                				</p>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Min Reuse Days</Grid.Column>
											<Grid.Column>
											<Form.Input type='number'
														name='minReuseDays'
														value={values.minReuseDays}
														onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.minReuseDays 
													&& touched.minReuseDays 
													&& errors.minReuseDays}
                                				</p>
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
							<Grid.Column></Grid.Column>
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
				</Formik>: <p>PLease Select Password Policy</p>}
				</Drawer.Body>
			</Drawer>
	  	</React.Fragment>  
		);
	}
}
  
/**
* Component for rendering the Button & Modal views for Deleting a Password Policy.
 * Child of {@link PasswordPolicyToolbar}.
 * 
 * @class
 * @augments React.Component
*/
class DeletePasswordPolicy extends React.Component {

	/**
     * Initializes state to hold Record for the selected Password Policy.
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
		this.getPoliciesCb = this.props.getPolicies;
	}

	openModal = () => {
		this.setState({showModal:true})
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

	handleDelete() {
		let id = this.getSelectedCb();
		this.onDelete(id);
		this.closeModal();
		return;
	}

	/**
     * Invokes a REST request to Delete the User selcted Policy.
     * Also fetches the updated list of Password Policies.
     * 
     * @param {Number} id ID of the Policy.
    */
	onDelete(id) {
		client({method: 'DELETE', path: '/api/security-policies-password/'+ id}).done(response => {
			this.handleNotification('success','Deleted policy Successfully');
			this.getPoliciesCb();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','Deletion of policy has failed');
		});
	}

	/**
     * Renders a Button view to initiate Delete operation on selected Policy and 
     * the Modal view to seek User confirmation.
    */
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

export default PasswordPolicy;