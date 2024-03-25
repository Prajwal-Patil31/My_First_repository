/**@module Resource*/
import React, {Fragment, useEffect } from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';

import { Drawer } from 'rsuite';

import BreadCrumb from '../Widgets/BreadCrumb';

import * as yup from 'yup';

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
    Table, 
	GridColumn
} from 'semantic-ui-react';

import {  
	noBoxShadow, 
	tbButton, 
	stdTable, 
	segmentStyle
} from '../../constants';

import 'semantic-ui-css/semantic.min.css';

import { Notification } from 'rsuite';

import { Formik } from 'formik';

const when = require('when');
const client = require('../../utils/client');

/**
 * Component for Resource Management; Implements functionality for 
 * fetching Resources and performing operations on them.
 * 
 * @class 
 * @extends React.Component
 */
class Resource extends React.Component {

	/**
	 * Resource constructor. Initializes state to hold Resources
     * and user selections.
	 * 
	 * @constructor
	 * @param {*} props 
	 */
    constructor(props) {
        super(props);

        this.state = {
            resources : [],
            selected : [],
        }
        const updated =  false;
		
        this.setSelected = this.setSelected.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.getResources = this.getResources.bind(this);
	}

	selectUpdateDone () {
		this.updated = true;
	}

	/**
     * Updates the component state with the list of Resource Items selected by the User.
     * A callback passed to and invoked by {@link ResourceTable}.
     * 
     * @param {Object} items Keyed object where the key is a specified id of the item in the list.
     */
	setSelected (items) {
		
		let sel = Object.keys(items);
		let id;
		if (Array.isArray(sel) && sel.length) {
			let rid = this.state.resources[sel[0]].resourceId;
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
     * Gets the list of User selected Resource Items to operate upon.
     * A callback passed to the children of {@link ResourceToolBar}.
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
     * Makes a REST request to fetch Resources with Pagination 
     * and updates the component's State.
     */
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
		});
	}

	componentDidMount() {
		this.getResources(); 
	}

	/**
     * Renders Resource component view invoking child components {@link ResourceToolBar} 
     * and {@link ResourceList} with Resource fetched on component mount.
     */
    render() {
		const resources = this.state.resources;
        return(
            <Container>
			<Grid style={noBoxShadow} centered verticalAlign='middle'>
			<Grid.Row style={noBoxShadow}>
				<Grid.Column style={noBoxShadow} verticalAlign='middle'>
					<Segment style={noBoxShadow}>
						<Grid columns={3} verticalAlign='middle'>
							<Grid.Column width={3} 
									 	 verticalAlign='middle' 
										 textAlign='left'>
								<BreadCrumb/>
								<Header size='medium'>
									Resources Administration
								</Header>
							</Grid.Column>
							<Grid.Column width={6} 
										 verticalAlign='middle' 
										 textAlign='left'>
							</Grid.Column>
							<Grid.Column width={7} 
										 textAlign='right' 
										 verticalAlign='middle'
							>
							<Fragment>
							<ResourceToolBar getSelected={this.getSelected} 
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
				<Grid.Column style={noBoxShadow} 
							 verticalAlign='middle'>
					<Segment style={noBoxShadow}>
					<Grid style={noBoxShadow}>
					<Grid.Column style={noBoxShadow}>
						<ResourceList resources={resources}
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

/** 
 * Component for rendering the Resource Management toolbar. Child of {@link Resource}.
 * 
 * @class
 * @augments React.Component
*/
class ResourceToolBar extends React.Component {
    render() {
        return(
            <Fragment>
				<CreateResource getSelected={this.props.getSelected} 
				          		getResources={this.props.getResources} 
				/>
				<ModifyResource getSelected={this.props.getSelected} 
								getResources={this.props.getResources}
				/> 
				<DeleteResource getSelected={this.props.getSelected} 
								getResources={this.props.getResources} 
				/>
			</Fragment>
        )
    }
}

/**
* Component for rendering list of Resources. Child of {@link Resource}.
* 
* @class
* @augments React.Component
*/
class ResourceList extends React.Component {
    render() {
        return(
            <ResourceTable resources={this.props.resources}
                           setSelected={this.props.setSelected}
            />
        )
    }
}

/**
 * Renders a tabular view of Resources with data passed from {@link Resource} component. 
 * Implements selection mechanism through withSelections() hook.
 * 
 * @prop {ReactNode} props Callbacks exposed by withSelections() hook.
 * @prop {Function} setSelected Callback to update parent's state with a list of selected Resource Items.
 * @prop {Array} resources List of Resources to be rendered.
 * @returns {JSX} Rendered tabular view of Resources
 */
const ResourceTable = withSelections((props) => {
	const {
		areAnySelected,
		selectedCount,
		handleClearAll,
		handleSelect,
		isItemSelected,
		selections,
	} = props;

	/**
     * @callback setSelected Update state with the list of Resource Items selected by the User.
     */
	const setSelected = props.setSelected;

	/** 
     * List of Resources to be rendered.
     * @type {Array}
     */
	const resources = props.resources;

	function handleSelectLocal (id) {
		handleSelect(id);
	}

	/**
     * Handles the side effect of changed selections and updates the parent State 
     * with modified set of selected Resource Items.
     */
	useEffect(() => {
		setSelected(selections);
	}, [props.selections]);	
	
	if (!resources && !resources.length)
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
			<span>{resources.length} resources</span>
			</div>
			</Segment>
			<div className = 'table-hscroll'>
			<Table striped style={stdTable}>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell width={1}></Table.HeaderCell>
						<Table.HeaderCell width={5}>
							Resource Id
						</Table.HeaderCell>
						<Table.HeaderCell width={5}>
							Resource Type
						</Table.HeaderCell>
						<Table.HeaderCell width={5}>
							Resource Code
						</Table.HeaderCell>
						<Table.HeaderCell width={5}>
							Resource Name
						</Table.HeaderCell>
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
							<Table.Cell>{resource.resourceType}</Table.Cell>
							<Table.Cell>{resource.resourceCode}</Table.Cell>
							<Table.Cell>{resource.resourceName}</Table.Cell>
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

let resourceSchema = yup.object().shape({
	resourceName: yup.string()
						.min(4, "Too Short.")
						.max(10,"Too Long")
						.required("Resource Name is a Required Field."),
	resourceCode: yup.string()
						.min(1,"Atleast single digit should be given")
						.max(5,"should not exceed more than 5 digits")
						.required("Resource Code is a Required Field.")
})

/**
 * Component for rendering the Button & Drawer views for Creating Resources.
 * Child of {@link ResourceToolBar}.
 * 
 * @class 
 * @extends React.Component
 */
class CreateResource extends React.Component {	

	/**
     * Initializes state to create new Resource.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props) {
		super(props);
		this.state = {
			resource : 
			{
				resourceId : "",
				resourceName : "",
				resourceCode : "",
			},
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

	toggleDrawer() {
		this.setState({ show: true });
	}

	/**
	 * Performs a REST request to create new Resource 
	 */
	handleAdd() {
		let body = this.state.resource;
		var resource = body;
		console.log('resource : ' + JSON.stringify(resource));
		client({
			method: 'POST', 
			path: '/api/elements/', 
			entity: resource, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.handleNotification('success','Added resource Successfully');
			this.getResources();
			this.setState({resource: this.baseState});
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','Failed to Add Resource');
		});
		this.close();
		return;
	}

	handleAddresource(values) {
		this.setState({resource:values});
		this.handleAdd();
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let resource = {...this.state.resource};
		resource[name] = value;
		this.setState({resource});
	}

	/**
     * Renders a Button view to initiate Create operation on selected Resources and 
     * the Drawer view to enter the details of the Resource to be created.
     */
    render() {
	  	const resource = this.state.resource;
		return (
			<React.Fragment> 
				<Button style={tbButton} onClick={this.toggleDrawer}>
					Create
				</Button>
				<Drawer show={this.state.show} onHide={this.close}>
					<Drawer.Header> 
						<Header size='large'>Create Resource</Header>
					</Drawer.Header>
					<Drawer.Body >
					<Formik
						initialValues={resource}
						validationSchema={resourceSchema}
						onSubmit={(values) => {
							this.handleAddresource(values);
						}}
					>
					{({
						values, 
						errors, 
						touched, 
						isSubmitting, 
						handleChange, 
						handleSubmit
					}) =>(
					<Grid columns='equal'>
					<Grid.Row>
						<Grid.Column width={2}></Grid.Column>
						<Grid.Column width={12}>
						<Form onSubmit={handleSubmit}> 
						<Form.Field>
							<Grid columns='equal' width='1'>
								<Grid.Row>
								<Grid.Column>Resource Name</Grid.Column>
								<Grid.Column>
									<Form.Input type='text'
												name='resourceName'
												value={values.resourceName}
												onChange={handleChange}>
									</Form.Input>
									<p style={{fontSize: '12pxl', color: "red"}}>
										{errors.resourceName 
										&& touched.resourceName 
										&& errors.resourceName}
									</p>
								</Grid.Column>
								</Grid.Row>
								<Grid.Row>
								<Grid.Column>Resource Code</Grid.Column>
								<Grid.Column>
									<Form.Input type='text'
												name='resourceCode'
												value={values.resourceCode}
												onChange={handleChange}>

									</Form.Input>
									<p style={{fontSize: '12pxl', color: "red"}}>
										{errors.resourceCode 
										&& touched.resourceCode 
										&& errors.resourceCode}
									</p>
								</Grid.Column>
								</Grid.Row>
								<Grid.Row>
									<GridColumn>
									<Button type='submit' 
											icon style={tbButton}  
											content='Submit'
									/>
									<Button onClick={this.close} icon style={tbButton}  
											floated='right' content='Cancel'
											type='button'
									/>
									</GridColumn>
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
						<Grid.Column></Grid.Column>
						<Grid.Column></Grid.Column>
					</Grid.Row>
					</Grid>
					)}
					</Formik>
					</Drawer.Body>
				</Drawer>
			</React.Fragment>  
		);
  	}
}

/**
 * Component for rendering the Button & Drawer views for Modifying Resources.
 * Child of {@link ResourceToolBar}.
 * 
 * @class
 * @augments React.Component
 */
class ModifyResource extends React.Component {

	/**
     * Initializes state to hold Record for the selected Resource Item.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props) {
		super(props);
		this.state = {
			resource : 
			{
				resourceName : "",
				resourceCode : ""
			},
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
     * Performs a REST request to fetch the details of the User selected Resource
     * for display in the Drawer.
     * 
     * @returns {void} On invalid selection.
     */
	handleLoad() {
		this.setState({resource: this.baseState});
		let resourceId = this.getSelectedCb();
		if (resourceId == null)
			return;
		client({method: 'GET', path: '/api/elements/' + resourceId}).done(response => {
			this.setState({resource: response.entity});
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
		this.setState({
		  show: false
		});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	/**
	 * Performs a REST request to set Modify state of the User selected Resource
	 */
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
			this.handleNotification('success','Modify Resource is Successfully');
			this.getResources();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','Modifying Resource is UnSuccessful');
		});
		this.close();
		return;
	}

	handleModifyresource(values) {
		this.setState({resource:values});
		this.handleModify();
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let resource = {...this.state.resource};
		resource[name] = value;
		this.setState({resource});
	}

	/**
     * Renders a Button view to initiate Modify operation on selected Resources and 
     * the Drawer view to display the user selected Resources.
     */
	render() {
        const {resource} = this.state;
	  return (
		<React.Fragment>  
			<Button style={tbButton}  onClick={this.toggleDrawer}>Modify</Button>
			<Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
				<Drawer.Header>
					<Header size='large'>Modify Resource</Header>
				</Drawer.Header>
				<Drawer.Body >
					{resource.resourceId ?
				<Formik
					initialValues={resource}
					validationSchema={resourceSchema}
					onSubmit={(values) => {
						this.handleModifyresource(values);
					}}
				>
				{({
					values,
					errors,
					touched,
					isSubmitting,
					handleChange,
					handleSubmit
				}) => (
					<Grid columns='equal'>
						<Grid.Row>
							<Grid.Column width={2}></Grid.Column>
							<Grid.Column width={12}>
								<Form onSubmit={handleSubmit}> 
									<Form.Field>
										<Grid columns='equal' width='1'>
											<Grid.Row>
												<Grid.Column>Resource Name</Grid.Column>
												<Grid.Column>
													<Form.Input type='text'
																name='resourceName'
																value={values.resourceName}
																onChange={handleChange}>
													</Form.Input>
													<p style={{fontSize: '12pxl', color: "red"}}>
														{errors.resourceName 
														&& touched.resourceName 
														&& errors.resourceName}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
												<Grid.Column>Resource Code</Grid.Column>
												<Grid.Column>
													<Form.Input type='text'
																name='resourceCode'
																value={values.resourceCode}
																onChange={handleChange}>
													</Form.Input>
													<p style={{fontSize: '12pxl', color: "red"}}>
														{errors.resourceCode 
														&& touched.resourceCode 
														&& errors.resourceCode}
													</p>
												</Grid.Column>
											</Grid.Row>
											<Grid.Row>
											<Grid.Column>
												<Button type='submit' icon style={tbButton}
														content='Submit'>
												</Button>
												<Button onClick={this.close} icon style={tbButton}  
														floated='right' content='Cancel'
														type='button'>
												</Button>
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
							<Grid.Column></Grid.Column>
							<Grid.Column></Grid.Column>
						</Grid.Row>
					</Grid>
						)}
					</Formik> : <p>Selection not Made</p>}
				</Drawer.Body>
			</Drawer>
	  	</React.Fragment>  
		);
	}
}

/**
 * Component for rendering the Button & Modal views for Deleting Resources.
 * Child of {@link ResourceToolBar}.
 * 
 * @class
 * @augments React.Component
 */
class DeleteResource extends React.Component {

	/**
     * Initializes state to hold Record for the selected Resource Item.
     * Also initializes handlers for Modal control.
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props) {
		super(props);
		this.state = 
		{
			showModal : false
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
	 * Gets the selected ID of the Resource
	 */
	handleDelete() {
		let id = this.getSelectedCb();
		this.onDelete(id);
		this.closeModal();
		return;
	}

	/**
     * Invokes a REST request to Delete the User selected Resource.
     * Also fetches the updated list of Resources.
     * 
     * @param {Number} id ID of the Resource
     */
	onDelete(id) {
		client({method: 'DELETE', path: '/api/elements/'+ id}).done(response => {
			this.handleNotification('success','Deleted Resource Successfully');
			this.getResources();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','Deletion of Resource has failed');
		});
	}

	/**
     * Renders a Button view to initiate Delete operation on selected Resources and 
     * the Modal view to seek User confirmation.
     */
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

export default Resource;