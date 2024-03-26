/**@module FaultConfig */

import React, { Fragment, useEffect } from 'react';
import update from 'react-addons-update';
import withSelections from 'react-item-select';

import BreadCrumb from'../Widgets/BreadCrumb';

import { Notification, Drawer } from 'rsuite';
import * as yup from "yup";
import {Formik} from 'formik';

import { 
	Grid, 
	Container,
	Modal,
	Button,
	Header,
	Form,
	Table,
	Checkbox,
	Segment,
	Divider
} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import { noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants';

const client = require('../../utils/client');

/**
 * Component for Fault Configuration; Implements functionality for 
 * configuring Fault Records and performing operations on them.
 * 
 * @class
 * @augments React.Component
 */
class FaultConfig extends React.Component {
	/**
     * Fault Framework constructor. Initializes state to hold Fault Framework data
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props) {
		super(props);

		this.state = {
			frameworks : [],
			selected : [],
		};

		const updated = false;
		
		this.setSelected = this.setSelected.bind(this);
		this.getSelected = this.getSelected.bind(this);
		this.getFrameworks = this.getFrameworks.bind(this);
	}
	
	selectUpdateDone() {
		this.updated = true;
	}

	/**
     * Updates the component state with the list of Fault Configuration Framework Items selected by the User.
     * A callback passed to and invoked by {@link FaultTable}.
     * 
     * @param {Object} items Keyed object where the key is a specified id of the item in the list.
     */

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

	/**
     * Gets the list of User selected Fault Framework Items to operate upon.
     * A callback passed to the children of {@link FaultToolbar}.
     * 
     * @returns {Array} Array of IDs of selected items.
     */
	getSelected() {
		if (this.updated != true) {
			return null;
		} else {
			return this.state.selected[0];
		}
	}

	/**
     * Makes a REST request to fetch Fault Framework Records with Pagination 
     * and updates the component's State.
     */

	getFrameworks() {
		client({method: 'GET', path: '/api/faults-config'}).done(response => {
			this.setState({frameworks: response.entity._embedded["faults-config"]});
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
		this.getFrameworks();
	}

	/**
     * Renders Fault Configuration component view invoking child components {@link FaultConfigurationToolbar} 
     * and {@link FaultConfigurationList} with Fault Configuration fetched on component mount.
     */
	render() {
		const frameworks = this.state.frameworks;
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
									<FrameworkToolbar getSelected={this.getSelected} 
													  getFrameworks={this.getFrameworks}
									/>
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
									<FrameworkList  frameworks={frameworks}
													setSelected={this.setSelected} 
									/>
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

/**
 * Renders a tabular view of Fault Framework  with data passed from {@link FaultConfiguration} component. 
 * Implements selection mechanism through withSelections() hook.
 * 
 * @prop {ReactNode} props Callbacks exposed by withSelections() hook.
 * @prop {Function} setSelected Callback to update parent's state with a list of selected Fault Configuration Items.
 * @prop {Array} faultconfigure List of Fault Configuration to be rendered.
 * @return {JSX} Rendered tabular view of Fault Framework.
 */
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

	 /**
     * @callback setSelected Update state with the list of Fault Framework items selected by the User.
     */
	const setSelected = props.setSelected;

	/** 
     * List of Fault Framework Records to be rendered.
     * @type {Array}
     */
	const frameworks = props.frameworks;

	function handleSelectLocal (id) {
		handleSelect(id);
	}
 
    /**
     * Handles the side effect of changed selections and updates the parent State 
     * with modified set of selected Fault Framework Items.
     */
	useEffect(() => {
		setSelected(selections);
   	}, [props.selections]);

	if (!frameworks && !frameworks.length)
		return null;
		
	return (
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
/**
 * Component for rendering list of Fault Frameworks. Child of {@link Fault Framework}.
 * 
 * @class
 * @augments React.Component
 */
class FrameworkList extends React.Component{
	render() {
	return (
		<FrameworkTable frameworks={this.props.frameworks}
						onChange={this.props.onChange}
						setSelected={this.props.setSelected} 
		/>
	  );
	}
}

/** 
 * Component for rendering the Fault Framework Management toolbar. Child of {@link Fault Framework}.
 * 
 * @class
 * @augments React.Component
*/
class FrameworkToolbar extends React.Component {
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

const configValidationSchema = yup.object().shape({
    faultErrorCode: yup.string()
    				.required('Required'),
	severity: yup.string()
				.required('Required'),
	relatedErrorCode: yup.string()
						.required('Required'),
	trapCategory: yup.string()
					.required('Required')   
});

/**
 * Component for rendering the Button & Drawer views for Fault Configuration  updation(add).
 * Child of {@link FaultFrameworkToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class AddButton extends React.Component {

	 /**
     * Initializes state to hold Record for the selected Fault Configuration Item.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
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
			show:false,
		};
		this.baseState = this.state.frameworks;
		this.handleAdd = this.handleAdd.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.getFrameworks = this.props.getFrameworks;
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
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
     * Performs a REST request to Add the state of the User selected Fault Configuration.
     */
	handleAdd() {
		
		let body = this.state.frameworks;
		let frameworks = body;
		client({
			method: 'POST', 
			path: '/api/faults-config/', 
			entity: frameworks, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.handleNotification('success','Added Successful');
			this.getFrameworks();
			this.setState({frameworks: this.baseState});
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

	handleAddConfig(values) {
        this.setState({frameworks:values});
        this.handleAdd();
    }

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let frameworks = {...this.state.frameworks};
		frameworks[name] = value;
		this.setState({frameworks});
	}

	 /**
     * Renders a Button view to initiate Acknowledgement operation on selected Fault Configuration and 
     * the Drawer view to display the user selected Fault Configuration.
     */
  	render(){
		const frameworks = this.state.frameworks;
		return (
			<React.Fragment>
				<Button style={tbButton} onClick={this.toggleDrawer}>Create </Button>
				<Drawer show={this.state.show} onHide={this.close}>
					<Drawer.Header>
						<Header size='large'>Create Configuration</Header>
					</Drawer.Header>
					<Drawer.Body>
					<Formik
						initialValues={frameworks}						
						validationSchema={configValidationSchema}
						onSubmit={(values) => {
							this.handleAddConfig(values);
					}}>
					{({
						values,
						errors,
						touched,
						isSubmitting,
						handleChange,
						handleSubmit
					}) => (
					<Form onSubmit={handleSubmit}> 
						<Grid columns='equal'>
							<Grid.Row>
								<Grid.Column width={2}></Grid.Column>
								<Grid.Column width={12}>									
									<Grid columns='equal' width='1'>
										<Grid.Row>
											<Grid.Column>Error Code</Grid.Column>
											<Grid.Column>
												<Form.Input   
														type='text'
														name='faultErrorCode'
														value={values.faultErrorCode}
														onChange={handleChange} >	
												</Form.Input>
												<p style ={{fontSize: '12pxl', color: "red"}}>
													{errors.faultErrorCode 
													&& touched.faultErrorCode 
													&& errors.faultErrorCode} 
												</p>                                                           				   
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Related Error Code</Grid.Column>
											<Grid.Column>
											<Form.Input  
													type='text'
													name='relatedErrorCode'
													value={values.relatedErrorCode}
													onChange={handleChange} >
											</Form.Input>
											<p style ={{fontSize: '12pxl', color: "red"}}>
												{errors.relatedErrorCode 
												&& touched.relatedErrorCode 
												&& errors.relatedErrorCode} 
											</p>  										
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Severity</Grid.Column>
											<Grid.Column>
												<Form.Input
														type='number'
														name='severity'
														value={values.severity}
														onChange={handleChange}>
												</Form.Input>
												<p style ={{fontSize: '12pxl', color: "red"}}>
													{errors.severity 
													&& touched.severity 
													&& errors.severity}
												</p> 										
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Trap Category</Grid.Column>
											<Grid.Column columns={3}>
												<Form.Input     
															type='text'
															name='trapCategory'
															value={values.trapCategory}
															onChange={handleChange}>
												</Form.Input>
												<p style ={{fontSize: '12pxl', color: "red"}}>
													{errors.trapCategory 
													&& touched.trapCategory 
													&& errors.trapCategory}
												</p>
											</Grid.Column>
										</Grid.Row>
									</Grid>									
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
										<Button onClick={this.close} style={tbButton} icon 
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
		);
  	}
}

/**
 * Component for rendering the Button & Drawer views for Fault Configuration Modification.
 * Child of {@link FaultFrameworkToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class ModifyButton extends React.Component {

	  /**
     * Initializes state to hold Record for the selected Fault Configuration.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props){
		super(props);	
		
		this.state = {
		frameworks: {
				faultId: "",
				faultErrorCode: "",
				severity: " ",
				relatedErrorCode: "",
				trapCategory: "",
			},
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
     * Performs a REST request to fetch the details of the User selcted Fault Configuration
     * for display in the Drawer.
     * 
     * @returns {void} On invalid selection.
     */
	handleLoad() {
		this.setState({frameworks: this.baseState});
		let id = this.getSelectedCb();
		if (id == null)
			return;
		client({method: 'GET', path: '/api/faults-config/' + id}).done(response => {
			this.setState({frameworks: response.entity});
		}, response => {
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
     * Performs a REST request to Modify(update) the state of the User selected Fault Configuration.
     */
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
			this.handleNotification('success','Update Successful');
			this.getFrameworks();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
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

	handleModifyFmwk(values) {
        this.setState({frameworks:values});
        this.handleModify();
    }
	
	/**
     * Renders a Button view to initiate Clearance operation on selected Fault Configuration and 
     * the Drawer view to display the user selected Fault Configuration.
     */
	render() {
		const frameworks = this.state.frameworks;
    	return(
			<React.Fragment>
			<Button onClick={this.toggleDrawer} style={tbButton}>Modify </Button>
			<Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
			<Drawer.Header>
				<Header size='large'>Modify Configuration</Header>
			</Drawer.Header>
			<Drawer.Body>				
			{frameworks.faultId? 
			<Formik 
				initialValues={frameworks}
				validationSchema={configValidationSchema}   
				onSubmit={(values) => {
					this.handleModifyFmwk(values);
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
                    		<Grid columns='equal'>
							  	<Grid.Row>
									<Grid.Column>Error Code</Grid.Column>
									<Grid.Column>
										<Form.Input   
													type='text'
													name='faultErrorCode'
													value={values.faultErrorCode}
													onChange={handleChange}>			
										</Form.Input>
										<p style ={{fontSize: '12pxl', color: "red"}}>  
											{errors.faultErrorCode 
											&& touched.faultErrorCode 
											&& errors.faultErrorCode}
										</p>                         
									</Grid.Column>
							  	</Grid.Row>
								<Grid.Row>
									<Grid.Column>Related Error Code</Grid.Column>
									<Grid.Column>
										<Form.Input    
													type='text'
													name='relatedErrorCode'
													value={values.relatedErrorCode}
													onChange={handleChange}>
										</Form.Input>
										<p style ={{fontSize: '12pxl', color: "red"}}>
											{errors.relatedErrorCode 
											&& touched.relatedErrorCode 
											&& errors.relatedErrorCode}
										</p>
									</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<Grid.Column>Trap Category</Grid.Column>
									<Grid.Column>
										<Form.Input  	
													type='text'
													name='trapCategory'
													value={values.trapCategory}
													onChange={handleChange}>
										</Form.Input>
										<p style ={{fontSize: '12pxl', color: "red"}}>
											{errors.trapCategory 
											&& touched.trapCategory 
											&& errors.trapCategory}
										</p>
									</Grid.Column>
								</Grid.Row>
							</Grid>						
						</Grid.Column>
						<Grid.Column width={2}></Grid.Column>
					</Grid.Row>
					<Grid.Row></Grid.Row>
					<Grid.Row></Grid.Row>
					<Grid.Row>
						<Grid.Column></Grid.Column>
						<Grid.Column>
								<Button primary content='Submit' style={tbButton} 
										type='submit'
								/>
								<Button onClick={this.close} style={tbButton} 
										type='button'
										icon floated='right' content='Cancel'>
								</Button>
						</Grid.Column>
						<Grid.Column></Grid.Column>
					</Grid.Row>
					</Grid>
				</Form>
				)}
				</Formik>
				 : <p>Selection not Made</p>}
			</Drawer.Body>
			</Drawer>
			</React.Fragment>
	 );
 	}
}
/**
 * Component for rendering the Button & Modal views for Deleting Fault configuration.
 * Child of {@link FaultFramework}.
 * 
 * @class
 * @augments React.component
*/
class DeleteButton extends React.Component{
/**
     
     * Initializes state to hold Record for the selected Fault Configuration.
     * Also initializes handlers for Modal control.
	 * 
     * @constructor
	 * @param {*} props
     */
	constructor(props){
		super(props);
		this.state = {
			showModal: false
		};

		this.handleDelete = this.handleDelete.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.getFrameworks = this.props.getFrameworks;
	}

	openModal = () => {
		this.setState({ showModal: true })
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

	closeModal = () => {
		this.setState({ showModal: false })
	}

	handleDelete() {
		let id = this.getSelectedCb();
		this.onDelete(id);
		return;
	}

	 /**
     * Invokes a REST request to Delete the User selected Fault Configuration.
     * Also fetches the updated list of Fault Framework Records.
     * 
     * @param {Number} id ID of the Fault Framework Record
     */
	onDelete(id) {
		client({method: 'DELETE', path: '/api/faults-config/'+ id}).done(response => {
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
			this.handleNotification('error','Deleted Failed');
		});
	}

	/**
     * Renders a Button view to initiate Delete operation on selected Fault onfiguration and 
     * the Modal view to seek User confirmation.
     */
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