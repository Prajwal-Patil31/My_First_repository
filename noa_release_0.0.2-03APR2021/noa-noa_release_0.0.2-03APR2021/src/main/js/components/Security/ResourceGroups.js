/**@module ResourceGroups */
import React, { Fragment, useEffect, useState } from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';

import  BreadCrumb from '../Widgets/BreadCrumb';

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

import { 
	noBoxShadow, 
	tbButton, 
	stdTable, 
	segmentStyle,  
} from '../../constants';
		 
import 'semantic-ui-css/semantic.min.css';
import { CheckPicker, Drawer, Notification } from 'rsuite';

import {Formik} from 'formik';
import * as yup from 'yup';

const when = require('when');
const client = require('../../utils/client');

/**
 * Component for Resource Group Management; Implements functionality for 
 * fetching Resources Groups and performing operations on them.
 * 
 * @class 
 * @extends React.Component
 */
class ResourceGroups extends React.Component {

	/**
	 * Resource Group constructor. Initializes state to hold Resources
     * and user selections.
	 * 
	 * @constructor
	 * @param {*} props 
	 */
    constructor(props) {
        super(props);
		this.state = 
		{
            resGroups : [],
            isLoggedIn : false,
			selected : [],
            resources_all : [],
            resources_dd : [],
            group_resources : []
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

	/**
     * Updates the component state with the list of Resource Group Items selected by the User.
     * A callback passed to and invoked by {@link ResourceGroupTable}.
     * 
     * @param {Object} items Keyed object where the key is a specified id of the item in the list.
     */    
    setSelected(items) {
        let sel = Object.keys(items);
        let id;
        if (Array.isArray(sel) && sel.length) {
            let rid = this.state.resGroups[sel[0]].resourceGroupId;
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
     * Gets the list of User selected Resource Group Items to operate upon.
     * A callback passed to the children of {@link ResourceGroupToolbar}.
     * 
     * @returns {Array} Array of IDs of selected items.
     */
    getSelected () {
        if (this.update != true) {
            console.log('State update is pending');	
            return null;
		} 
		else {
            return this.state.selected[0];
        }
    }

	/**
	 * Iterates to get the Resources of Each ResourceGroup.
	 * 
	*/
    fetchGroupResources() {
		const len = this.state.resGroups.length;
		for (let groupno = 0; groupno < len; groupno++) {
			this.fetResource( groupno );
		}
	}

	/**
	 * Makes a REST request to fetch all list of resources specific to a group
	 * and updates component's state.
	 * 
	 * @param {Number} index 
	 */
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

	/**
	 * Parses the resources and shows in the Checkpicker
	 */
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

	/**
	 * Makes REST request to fetch all resources
	 * to show in the Checkpicker
	 */
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
		});
	}

	/**
	 * Makes a REST request and gets the all the ResourceGroups with Pagination
	 * and updates the component's State.
	 * Also invokes fetchAllResources and Fetching Resource specific to a ResourceGroup.
	 * 
	*/
    getResourceGroups() {
        client({method: 'GET', path: '/api/elements-groups'}).done(response => { 
            this.setState({resGroups: response.entity._embedded["elements-groups"]},() => {
                this.fetchGroupResources();
                this.fetchAllResources(); });
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
        this.getResourceGroups();
    }
    
	/**
     * Renders Resource Group component view invoking child components {@link ResourceGroupToolbar} 
     * and {@link ResourceGroupList} with Resource Group fetched on component mount.
     */
    render() {
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
										<BreadCrumb/>
										<Header size='medium'>Resource Group Administration</Header>
									</Grid.Column>
									<Grid.Column width={5} 
												verticalAlign='middle' 
												textAlign='left'>
									</Grid.Column>
									<Grid.Column width={7} 
												textAlign='right' 
												verticalAlign='middle'>
										<Fragment>
											<ResourceGroupToolbar 
												getSelected={this.getSelected}
												getResourceGroups={this.getResourceGroups}
												resources_dd={resources_dd} 
												clearState={this.clearState}
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

/** 
 * Component for rendering the Resource Group Management toolbar. Child of {@link ResourceGroups}.
 * 
 * @class
 * @augments React.Component
*/
class ResourceGroupToolbar extends React.Component {
	render() {
		return(
			<Fragment>
				<CreateResourceGroup 
					resources_dd={this.props.resources_dd} 
					getResourceGroups={this.props.getResourceGroups} 
					clearState={this.props.clearState}
				/>
				<ModifyResourceGroup 
					resources_dd={this.props.resources_dd} 
					getSelected={this.props.getSelected} 
					getResourceGroups={this.props.getResourceGroups} 
					clearState={this.props.clearState}
				/>
				<DeleteResourceGroup 
					getSelected={this.props.getSelected} 
					getResourceGroups={this.props.getResourceGroups}
					clearState={this.props.clearState}
				/>
			</Fragment>
		)
	}
} 

/**
* Component for rendering list of Resource Groups. Child of {@link ResourceGroups}.
* 
* @class
* @augments React.Component
*/
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

/**
 * Renders a tabular view of Resource Groups with data passed from {@link ResourceGroups} component. 
 * Implements selection mechanism trhough withSelections() hook.
 * 
 * @prop {ReactNode} props Callbacks exposed by withSelections() hook.
 * @prop {Function} setSelected Callback to update parent's state with a list of selected Resource Group Items.
 * @prop {Array} resources List of all Resources to be rendered.
 * @prop {Array} resGroups List of all Resource Groups to be rendered.
 * @returns {JSX} Rendered tabular view of Resource Groups.
 */
const ResourceGroupTable = withSelections((props) => {
	const {
		areAnySelected,
		selectedCount,
		handleClearAll,
		handleSelect,
		isItemSelected,
		selections,
	} = props;

	/**
     * @callback setSelected Update state with the list of Resource Group Items selected by the User.
     */
	const setSelected = props.setSelected;

	/** 
     * List of Resource Groups to be rendered.
     * @type {Array}
     */
	const resGroups = props.resGroups;

	/**
	 * List of Resources to be rendered.
	 * @type {Array}
	 */
    const resources = props.resources;

	const [activeIndex,setActiveIndex]  = useState(0);

	function handleSelectLocal (resourceGroupId) {
		handleSelect(resourceGroupId);
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
     * with modified set of selected Resource Group Items.
     */
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
					<Table.HeaderCell width={5}>Group Type</Table.HeaderCell>
					<Table.HeaderCell width={5}>Group Code</Table.HeaderCell>
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
					<Table.Cell>{resGroup.resourceGroupType}</Table.Cell>  
					<Table.Cell>{resGroup.resourceGroupCode}</Table.Cell>  
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

/**
 * Coponent for rendering the list of resources
 * mapped to the Resource Group
 * 
 * Child of {@link ResourceGroupTable}
 * @class
 * @extends React.Component
 */
class Resource extends React.Component {
	render() {
		return(
			<div>{this.props.fr.resourceName + '\n'}</div>
		)
	}
}

let resourceGroupSchema = yup.object().shape({
	resourceGroupName: yup.string()
						.min(4, "Too Short")
						.required("Resource Group Name is a Required Field."),
	resourceGroupCode: yup.string()
						.required("Resource Group Code is a Required Field."),
	resourceGroupType: yup.string()
						.required("Resource Group Type is a Required Field")
})

/**
 * Component for rendering the Button & Drawer views for Creating Resource Groups.
 * Child of {@link ResourceGroupTable}.
 * 
 * @class 
 * @extends React.Component
 */
class CreateResourceGroup extends React.Component {

	/**
     * Initializes state to create new Resource Group.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
			resGroup : 
			{
				resourceGroupId :"",
				resourceGroupName : "",
				resourceGroupCode : "",
				resourceGroupType : ""
			},
            show:false,
            group_new : {},
			resources_dd : this.props.resources_dd,
			resources_sel : [],
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
    
	/**
	 * Updates the changed values from input in component's State.
	 * @param {*} event 
	 * @param {*} data 
	*/
    handleChange = (event, data) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		let resGroup = {...this.state.resGroup};
		resGroup[name] = value;
		this.setState({resGroup});
    }

	/**
	 * Gets the List of Selected Resource and updates
	 * component's State.
	 * 
	 * @param {number} value Index of Selected resource.
	*/
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
	 * Performs a REST request to set Resource Group.
	 */
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
			this.handleNotification('success','Adding Resource Successful');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.handleNotification('error','Adding Resource Failed');
        });
	}

	/**
     * Performs a REST request to Create a new Resource Group.
	 * Also fetches the updated list of Resource Group.
	 * 
    */
    handleAdd() {
		let body = this.state.resGroup;
		client({
				method: "POST", 
				path:'/api/elements-groups', 
				entity: body,
				headers: { "Content-Type": "application/json" }
			}).done(response => {
                this.setState({group_new: response.entity}, () => { this.setGroupResources();});
				this.handleNotification('success','Group Created Successfully');
				this.setState({resGroup: this.baseState});
				this.getResourceGroups();
				this.clearState();
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

	handleAddResourceGroups(values) {
		this.setState({resGroup: values});
		this.handleAdd();
	}

	/**
     * Renders a Button view to initiate Create operation on selected Resource Groups and 
     * the Drawer view to enter the details of the Resource Group to be created.
     */
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
					<Drawer.Body>
					<Formik
						initialValues={resGroups}
						validationSchema={resourceGroupSchema}
						onSubmit={(values) => {
							this.handleAddResourceGroups(values);
						}}
					>
					{({
						values,
						errors,
						touched,
						handleSubmit,
						handleChange
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
												<Form.Input type='text' name='resourceGroupName' 
															value={values.resourceGroupName} 
															onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.resourceGroupName 
													&& touched.resourceGroupName 
													&& errors.resourceGroupName}
												</p>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Group Type</Grid.Column>
											<Grid.Column>
												<Form.Input type='text' name='resourceGroupType' 
															value={values.resourceGroupType} 
															onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.resourceGroupType 
													&& touched.resourceGroupType 
													&& errors.resourceGroupType}
												</p>
											</Grid.Column>
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>Group Code</Grid.Column>
											<Grid.Column>
												<Form.Input type='text' name='resourceGroupCode' 
															value={values.resourceGroupCode} 
															onChange={handleChange}>
												</Form.Input>
												<p style={{color: 'red'}}>
													{errors.resourceGroupCode 
													&& touched.resourceGroupCode 
													&& errors.resourceGroupCode}
												</p>
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
									<Button type='button' onClick={this.close} icon style={tbButton}  
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
        )
    }
}

/**
 * Component for rendering the Button & Drawer views for Modifying Resource Groups.
 * Child of {@link ResourceGroupToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class ModifyResourceGroup extends React.Component {

	/**
     * Initializes state to hold Record for the selected Resource Group Item.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
			resGroup: 
			{
				resourceGroupId : "",
				resourceGroupName : "",
				resourceGroupType : "",
				resourceGroupCode : ""
			},
			show: false,
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

	handleReset() {
		this.setState({resGroup: this.baseState});
		this.setState({resources_asg: this.baseResources});
	}
	
	/**
     * Performs a REST request to fetch the details of the User selected Resource Group
     * for display in the Drawer.
     * 
     * @returns {void} On invalid selection.
     */
    handleLoad() {
		this.handleReset();
		let id = this.getSelectedCb();
		if (id == null)
			return;
		client({method: 'GET', path: '/api/elements-groups/' + id}).done(response => {
			this.setState({resGroup: response.entity});
            this.fetchResource(id);
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
	 * Performs REST request to fetch Resources assigned to the
	 * Resource Group
	 * @param {Number} id ID of the Resource Group.
	 */
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
   
	/**
	 * Performs a REST request to set Modify state of the User selected Resource Group
	 */
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
			this.handleNotification('error','Failed to Modify');
		});
		this.close();
		return;
    }

	/**
	 * Performs a REST request to form a Resource Group
	 * and assigning of resources to the Group
	 */
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
			this.handleNotification('success','Adding Resource Successful');
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
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

	handleModifyResourceGroup(values) {
		this.setState({resGroup: values});
		this.handleModify();
	}
	/**
     * Renders a Button view to initiate Modify operation on selected Resource Groups and 
     * the Drawer view to display the user selected Resource Groups.
     */
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
					<Drawer.Body>
					{resGroup.resourceGroupId ? 
					<Formik
						initialValues={resGroup}
						validationSchema={resourceGroupSchema}
						onSubmit={(values) => {
							this.handleModifyResourceGroup(values);
						}}
					>
					{({
						values,
						errors,
						touched,
						handleSubmit,
						handleChange
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
											<Form.Input type='text' name='resourceGroupName' 
														value={values.resourceGroupName} 
														onChange={handleChange}>
											</Form.Input>
											<p style={{color: 'red'}}>
												{errors.resourceGroupName 
												&& touched.resourceGroupName 
												&& errors.resourceGroupName}
											</p>
										</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column>Group Code</Grid.Column>
										<Grid.Column>
											<Form.Input type='text' name='resourceGroupCode' 
														value={values.resourceGroupCode} 
														onChange={handleChange}>
											</Form.Input>
											<p style={{color: 'red'}}>
												{errors.resourceGroupCode 
												&& touched.resourceGroupCode 
												&& errors.resourceGroupCode}
											</p>
										</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column>Group Type</Grid.Column>
										<Grid.Column>
											<Form.Input type='text' name='resourceGroupType' 
														value={values.resourceGroupType} 
														onChange={handleChange}>
											</Form.Input>
											<p style={{color: 'red'}}>
												{errors.resourceGroupType 
												&& touched.resourceGroupType 
												&& errors.resourceGroupType}
											</p>
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
								<Button type='button' onClick={this.close} icon style={tbButton}  
										floated='right' content='Cancel'>
								</Button>
							</Grid.Column>
							<Grid.Column></Grid.Column>
						</Grid.Row>
					</Grid>
					</Form>
					)}
					</Formik> : <p>Please Select Resource Group</p>}
					</Drawer.Body>
				</Drawer>
            </React.Fragment>  
        )
    }
}

/**
 * Component for rendering the Button & Modal views for Deleting Resource Groups.
 * Child of {@link ResourceGroupToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class DeleteResourceGroup extends React.Component {

	/**
     * Initializes state to hold Record for the selected Resource Group Item.
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
	 * Gets the selected ID of the Resource Group
	 */
	handleDelete() {
		let id = this.getSelectedCb();
		this.onDelete(id);
		this.closeModal();
		return;
	}

	/**
     * Invokes a REST request to Delete the User selected Resource Group.
     * Also fetches the updated list of Resource Groups.
     * 
     * @param {Number} id ID of the Resource Group
     */
	onDelete(id) {
		client({method: 'DELETE', path: '/api/elements-groups/' + id}).done(response => {
			this.handleNotification('success','Deleted Successfully');

			this.getResourceGroups();
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
     * Renders a Button view to initiate Delete operation on selected Resource Groups and 
     * the Modal view to seek User confirmation.
     */
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
        )
    }
}

export default ResourceGroups;
