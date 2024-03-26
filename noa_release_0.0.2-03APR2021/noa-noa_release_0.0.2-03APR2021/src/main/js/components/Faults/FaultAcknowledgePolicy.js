/**@module FaultAcknowledgePolicy */

import React, { Fragment, useEffect } from 'react';
import update from 'react-addons-update';
import withSelections from 'react-item-select';

import BreadCrumb from'../Widgets/BreadCrumb';

import { Notification, Drawer } from 'rsuite';

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

import * as yup from "yup";

import 'semantic-ui-css/semantic.min.css';

import { noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants'

const client = require('../../utils/client');

/**
 * Component for Fault Acknowledement Policy; Manages the Fault Acknowledgement Policy by
 * configuring Fault Policy Records and performing operations on them.
 * 
 * @class
 * @augments React.Component
 */

class FaultAcknowledgement extends React.Component {
/**
     * Fault Acknowledement Policy constructor. Initializes state to hold Fault Acknowledement Policy data
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props) {
        super(props);
        
		this.state = {
			faultackpolicies : [], 
			selected : [], 
        };
        
        const updated =  false;

  		this.setSelected = this.setSelected.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.getAckPolicy = this.getAckPolicy.bind(this);
    }

    selectUpdateDone () {
		this.updated = true;
	}

      /**
     * Updates the component state with the list of Fault Acknowledement Policy Items selected by the User.
     * A callback passed to and invoked by {@link FaultPolicyTable}.
     * 
     * @param {Object} items Keyed object where the key is a specified id of the item in the list.
     */

	setSelected (items) {
		let sel = Object.keys(items);
		let id;
		if (Array.isArray(sel) && sel.length) {
            let rid = this.state.faultackpolicies[sel[0]].policyId;
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
     * Gets the list of User selected Fault Policy Items to operate upon.
     * A callback passed to the children of {@link FaultPolicyToolbar}.
     * 
     * @returns {Array} Array of IDs of selected items.
     */
    getSelected () {
		if (this.updated != true) {
			return null;
		} else {
			return this.state.selected[0];
		}
    }

    handleSort(columnName,direction) {
        client({method: 'GET', path: '/api/faults-policies-acknowledge?sort='+columnName + ','+direction}).done(response => {
			this.setState({faultackpolicies: response.entity._embedded["faults-policies-acknowledge"]});
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

    /**
     * Makes a REST request to fetch Fault Policy Records with Pagination 
     * and updates the component's State.
     */
    getAckPolicy() {
        client({method: 'GET', path: '/api/faults-policies-acknowledge'}).done(response => {			
			this.setState({faultackpolicies: response.entity._embedded["faults-policies-acknowledge"]});
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
		this.getAckPolicy();
    }
/**
     * Renders Fault Acknowledgement Policy component view invoking child components {@link FaultPolicyToolbar} 
     * and {@link FaultPolicyList} with Fault Policy fetched on component mount.
     */
    render() {
        const faultackpolicies = this.state.faultackpolicies;
        return(
        <Container>
            <Grid style={noBoxShadow} centered verticalAlign='middle'>
                <Grid.Row style={noBoxShadow}>
                    <Grid.Column style={noBoxShadow} verticalAlign='middle'>
                        <Segment style={noBoxShadow}>
                            <Grid columns={3} verticalAlign='middle'>
                                <Grid.Column width={5} verticalAlign='middle' textAlign='left'>
                                    {<BreadCrumb/>}
                                    <Header size='medium'>Manage Acknowledgement Policy</Header>
                                </Grid.Column>
                                <Grid.Column width={5} verticalAlign='middle' textAlign='left'>
                                </Grid.Column>
                                <Grid.Column width={6} textAlign='right' verticalAlign='middle'>
                                    <FaultAcknowledgeToolbar getSelected={this.getSelected} 
                                                             getAckPolicy = {this.getAckPolicy}
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
                                    <FaultAcknowledgementList   faultackpolicies={faultackpolicies}
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
 * Renders a tabular view of Fault Policy with data passed from {@link FaultPolicy} component. 
 * Implements selection mechanism through withSelections() hook.
 * 
 * @prop {ReactNode} props Callbacks exposed by withSelections() hook.
 * @prop {Function} setSelected Callback to update parent's state with a list of selected Fault Policy Items.
 * @prop {Array} faultpolicy List of Fault Policies to be rendered.
 * @return {JSX} Rendered tabular view of Fault Acknowledgement Policy.
 */

const FaultAcknowledgementTable = withSelections((props) => {
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
     * @callback setSelected Update state with the list of Fault Policy items selected by the User.
     */
    const setSelected = props.setSelected;
    
	/** 
     * List of Fault Policy Records to be rendered.
     * @type {Array}
     */
    const faultackpolicies = props.faultackpolicies;

    function handleSelectLocal (id) {
			handleSelect(id);
	}

    /**
     * Handles the side effect of changed selections and updates the parent State 
     * with modified set of selected Fault Policy Items.
     */
	useEffect(() => {
		setSelected(selections);
    }, [props.selections]);

    if (!faultackpolicies && !faultackpolicies.length)
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
					<span>{faultackpolicies.length} Acknowledgement Policies</span>
				</div>
      		</Segment>
            <div className = 'table-hscroll'>
				<Table striped style={stdTable}>
					<Table.Header>
						<Table.Row>
                            <Table.HeaderCell width={1}></Table.HeaderCell>
                            <Table.HeaderCell width={2}>Policy Id</Table.HeaderCell>
                            <Table.HeaderCell width={4}>Policy Name</Table.HeaderCell>
                    		<Table.HeaderCell width={4}>Severity</Table.HeaderCell>
                    		<Table.HeaderCell width={2}>No Of Hours older</Table.HeaderCell>
                            <Table.HeaderCell width={2}>No Of Days older</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Retain faults</Table.HeaderCell>
			          	</Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {faultackpolicies.map(policy =>(
						<Table.Row key = {faultackpolicies.indexOf(policy)}>
							<Table.Cell>
								<Checkbox checked={isItemSelected(faultackpolicies.indexOf(policy))} 
                                          onChange={handleSelectLocal.bind(this, faultackpolicies.indexOf(policy))}/>
                            </Table.Cell>
                            <Table.Cell>{policy.policyId}</Table.Cell>
                            <Table.Cell>{policy.policyName}</Table.Cell>
                            <Table.Cell>{policy.severity}</Table.Cell>
                            <Table.Cell>{policy.hrsOlder}</Table.Cell>
                            <Table.Cell>{policy.daysOlder}</Table.Cell>
				            <Table.Cell>{policy.retainFault}</Table.Cell>
                        </Table.Row>
                        ))}
                    </Table.Body>		
				</Table>
            </div>
			</Container>
		</div>
	)   

});

/**
 * Component for rendering list of Fault Policies. Child of {@link Fault Policy}.
 * 
 * @class
 * @augments React.Component
 */
class FaultAcknowledgementList extends React.Component {
	render() {
	  return <FaultAcknowledgementTable setSelected={this.props.setSelected}
		  						  		faultackpolicies = {this.props.faultackpolicies}
            />;
	}
}
  /** 
 * Component for rendering the Fault Acknowledgement policy toolbar. Child of {@link Fault Policy}.
 * 
 * @class
 * @augments React.Component
*/
class FaultAcknowledgeToolbar extends React.Component {
	render() {
		return(
			<Fragment>
                <AddButton getSelected={this.props.getSelected} getAckPolicy={this.props.getAckPolicy}/> 
                <ModifyButton getSelected={this.props.getSelected} getAckPolicy={this.props.getAckPolicy}/> 
                <DeleteButton getSelected={this.props.getSelected} getAckPolicy={this.props.getAckPolicy}/>                
			</Fragment>
		)
	}
}

const ackValidationSchema = yup.object().shape({
    policyName: yup.string()
                    .min(4, "Too Short.")
                    .required('Required'),
    severity: yup.string()
                    .required('Required'),
    hrsOlder: yup.string()
                    .required('Required'),
    daysOlder: yup.string()
                    .required('Required'),
    retainFault: yup.string()
                    .required('Required')
});
     
/**
 * Component for rendering the Button & Drawer views for Fault Policy updation(add).
 * Child of {@link FaultPolicyToolbar}.
 * 
 * @class
 * @augments React.Component
 */ 
class AddButton extends React.Component {

     /**
     * Initializes state to hold Record for the selected Fault Policy Item.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
		super(props);
		this.state = {
            policy : 
            {
                policyId : "",
            	severity : "",
				hrsOlder : "",
				daysOlder : "",
            	retainFault : "",
            	policyName : "",
            },
            show: false,
        };
        this.baseState = this.state.policy;
        this.handleAdd = this.handleAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getAckPolicy = this.props.getAckPolicy;
        this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
    }

    close() {
		this.setState({show: false});
	}

	toggleDrawer() {
		this.setState({ show: true });
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
     * Performs a REST request to Add the state of the User selected Fault Policy.
     */
    handleAdd() {
       
		let body = this.state.policy;
        var policy = body;
        client({
			method: 'POST', 
			path: '/api/faults-policies-acknowledge/', 
			entity: policy, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
            this.handleNotification('success','Policy Created Successfully');
            this.getAckPolicy();
            this.setState({policy: this.baseState});
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
            this.handleNotification('error','Add Failed');
        });
        this.close();
        return;
    }
    handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let policy = {...this.state.policy};
		policy[name] = value;
		this.setState({policy});
    }
    
    handleAddAck(values) {
        this.setState({policy:values});
        this.handleAdd();
    }
/**
     * Renders a Button view to initiate Acknowledgement operation on selected Fault Poplicy and 
     * the Drawer view to display the user selected Fault Policy.
     */
	render() {       
        const policy = this.state.policy;
        return(
        <React.Fragment>
           <Button onClick={this.toggleDrawer} style={tbButton}>Create</Button>
           <Drawer show={this.state.show} onHide={this.close}>   
           <Drawer.Header>
			    <Header size='large' content='Create Acknowledgement Policy'/>
		    </Drawer.Header>         
                <Drawer.Body>               
                <Formik
                    initialValues={policy}
                    validationSchema={ackValidationSchema}                        
                    onSubmit={(values) => {
                        this.handleAddAck(values);
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
                                <Grid columns='equal' width='1'>
                                    <Grid.Row>
                                        <Grid.Column> 
                                            Policy Name
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Input type='text' 
                                                        name='policyName' 
                                                        value={values.policyName} 
                                                        onChange={handleChange}
                                            />
                                            <p style ={{fontSize: '12pxl', color: "red"}}>
                                                {errors.policyName 
                                                && touched.policyName 
                                                && errors.policyName}
                                            </p>                                               
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column> 
                                            Severity
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Input type='text' 
                                                        name='severity' 
                                                        value={values.severity} 
                                                        onChange={handleChange}
                                            />
                                            <p style ={{fontSize: '12pxl', color: "red"}}>
                                                {errors.severity 
                                                && touched.severity 
                                                && errors.severity}
                                            </p>                                                 
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            No of Days Older
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Input type='number' 
                                                        name='daysOlder'
                                                        value={values.daysOlder}
                                                        onChange={handleChange}
                                            />
                                            <p style ={{fontSize: '12pxl', color: "red"}}>
                                                {errors.daysOlder 
                                                && touched.daysOlder 
                                                && errors.daysOlder}
                                            </p>                                                
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            No of Hours Older
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Input type='number' 
                                                        name='hrsOlder'
                                                        value={values.hrsOlder} 
                                                        onChange={handleChange}
                                            />
                                            <p style ={{fontSize: '12pxl', color: "red"}}>
                                                {errors.hrsOlder 
                                                && touched.hrsOlder 
                                                && errors.hrsOlder}
                                            </p>                                         
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row columns={4}>
                                        <Grid.Column> 
                                            Retain Minimum Faults
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Input type='number'
                                                        name='retainFault' 
                                                        value={values.retainFault}
                                                        onChange={handleChange}
                                            />
                                            <p style ={{fontSize: '12pxl', color: "red"}}>
                                                {errors.retainFault 
                                                && touched.retainFault 
                                                && errors.retainFault}
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
                            <Button type='submit' icon style={tbButton} content='Submit'/>                                       
                            <Button onClick={this.close} style={tbButton} icon floated='right' content='Cancel'
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
 * Component for rendering the Button & Drawer views for Fault Policy Modification.
 * Child of {@link FaultAcknowledgementPolicyToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class ModifyButton extends React.Component {

     /**
     * Initializes state to hold Record for the selected Fault Policy.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
		super(props); 
		this.state = {
            policy : 
            {
                policyId : "",
                severity : "",
				hrsOlder : "",
				daysOlder : "",
                retainFault : "",
                policyName : "",
			},
            show: false,
        };
        
        this.baseState = this.state.policy;
        this.handleModify = this.handleModify.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getAckPolicy = this.props.getAckPolicy;
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
     * Performs a REST request to fetch the details of the User selected Fault Policy
     * for display in the Drawer.
     * 
     * @returns {void} On invalid selection.
     */
    handleLoad() {
        this.setState({policy: this.baseState});
		let id = this.getSelectedCb();
		if (id == null)
            return;
        client({method: 'GET', path: '/api/faults-policies-acknowledge/' + id}).done(response => {
            this.setState({policy: response.entity});
            this.setState({isLoggedin: true});
            this.setState({showModal: true});
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
		this.setState({show: false});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}
    
     /**
     * Performs a REST request to Update the User selected Fault Policy.
     */
    handleModify() {
        let id = this.getSelectedCb();
        let body = this.state.policy;
        delete body.id;
        var policy = body;
        client({
            method: 'PUT', 
            path: '/api/faults-policies-acknowledge/' +id, 
            entity: policy, 
            headers: { 'Content-Type': 'application/json' }
        }).done(response => {
            this.getAckPolicy();
            this.handleNotification('success','Update Successfully');
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
        let policy = {...this.state.policy};
        policy[name] = value;
        this.setState({policy});
    }

    handleModifyAck(values) {
        this.setState({policy:values});
        this.handleModify();
    }

     /**
     * Renders a Button view to initiate Clearance operation on selected Fault Policy and 
     * the Drawer view to display the user selected Fault Record.
     */
	render() {
            const policy = this.state.policy;
        return(
            <React.Fragment>
           <Button style={tbButton}onClick={this.toggleDrawer}>Modify </Button>
           <Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>  
                <Drawer.Header>
			        <Header size='large' content='Modify Acknowledgement Policy'/>
		        </Drawer.Header>
                <Drawer.Body>
                {policy.policyId?
                <Container textAlign='center'> 
                <Formik 
                    initialValues={policy}
                    validationSchema={ackValidationSchema}   
                    onSubmit={(values) => {
                    this.handleModifyAck(values);
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
                            <Grid columns='equal' width='1'>
                                <Grid.Row>
                                    <Grid.Column>
                                        Policy Name
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Input type='text'
                                                    name='policyName' 
                                                    value={values.policyName}
                                                    onChange={handleChange}
                                        />
                                        <p style ={{fontSize: '12pxl', color: "red"}}>
                                            {errors.policyName 
                                            && touched.policyName 
                                            && errors.policyName}
                                        </p>                                           
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column> 
                                        Severity
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Input type='text' 
                                                    name='severity' 
                                                    value={values.severity} 
                                                    onChange={handleChange}
                                        />
                                        <p style ={{fontSize: '12pxl', color: "red"}}>
                                            {errors.severity 
                                            && touched.severity 
                                            && errors.severity}
                                        </p>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        No of Days Older
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Input type='number' 
                                                    name='daysOlder'
                                                    value={values.daysOlder} 
                                                    onChange={handleChange}
                                        />
                                        <p style ={{fontSize: '12pxl', color: "red"}}>
                                            {errors.daysOlder 
                                            && touched.daysOlder 
                                            && errors.daysOlder}
                                        </p>  
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        No of Hours Older
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Input type='number' 
                                                    name='hrsOlder' 
                                                    value={values.hrsOlder}
                                                    onChange={handleChange}
                                        />
                                        <p style ={{fontSize: '12pxl', color: "red"}}>
                                            {errors.hrsOlder 
                                            && touched.hrsOlder 
                                            && errors.hrsOlder}
                                        </p>                                       
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={4}>
                                    <Grid.Column> 
                                        Retain Minimum Faults
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Form.Input type='number' 
                                                    name='retainFault' 
                                                    value={values.retainFault}
                                                    onChange={handleChange}
                                        />
                                        <p style ={{fontSize: '12pxl', color: "red"}}>
                                            {errors.retainFault 
                                            && touched.retainFault 
                                            && errors.retainFault}
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
                                <Button primary content='Submit' style={tbButton} type='submit'/>
                                <Button onClick={this.close} type='button'
                                        icon style={tbButton}  
                                        floated='right' content='Cancel'>
                                </Button>
                        </Grid.Column>
                        <Grid.Column></Grid.Column>
                    </Grid.Row>
                </Grid>	
                </Form>
                )}
                 </Formik>
                 </Container>
                  : <p>Selection not Made</p>}
                </Drawer.Body>  
                </Drawer> 
            </React.Fragment>
        );
	}
}
  
/**
 * Component for rendering the Button & Modal views for Deleting Fault Policies.
 * Child of {@link FaultAcknowledgementPolicyToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class DeleteButton extends React.Component {
      /**
     * Initializes state to hold Record for the selected Fault Policy Item.
     * Also initializes handlers for Modal control.
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props) {
		super(props);
        this.state = {
            showModal : false
        }
		this.handleDelete = this.handleDelete.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.getAckPolicy = this.props.getAckPolicy;
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

    openModal = () => {
		this.setState({ showModal: true })
    }
    
    closeModal = () => {
		this.setState({ showModal: false })
    }
    
	/**
     * Performs the delete operation of Fault Policy item.
     */
	handleDelete() {
		let id = this.getSelectedCb();
		this.onDelete(id);
		return;
    }
    
    /**
     * Invokes a REST request to Delete the User selected Fault Acknowledgement Policy Record.
     * Also fetches the updated list of Fault Policy Records.
     * 
     * @param {Number} id ID of the Fault Policy Record
     */
	onDelete(id) {
		client({method: 'DELETE', path: '/api/faults-policies-acknowledge/' + id}).done(response => {
            this.getAckPolicy();
            this.handleNotification('success','Deleted Successfully');
            this.closeModal();
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
     * Renders a Button view to initiate Delete operation on selected Fault policies  and 
     * the Modal view to seek User confirmation.
     */
	render() {
		return(
            <Modal dimmer='inverted' open={this.state.showModal} 
                onClose={this.closeModal} trigger={<Button style={tbButton} 
                onClick={this.openModal}>Delete </Button>}>
				<Modal.Header>Delete Acknowledge Policy</Modal.Header>
				<Modal.Content>
                    <Grid columns='equal'>
                        <Grid.Row>
                            <p>Are you sure you want to delete this policy</p>
                        </Grid.Row>
                        <Grid.Row></Grid.Row>
                        <Grid.Row>
                            <Grid.Column></Grid.Column>
                            <Grid.Column>
                                <Button style={tbButton} content='Yes'
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

export default FaultAcknowledgement;