/**@module FaultEscalate */
import React, { Fragment, useEffect } from 'react';
import update from 'react-addons-update';
import withSelections from 'react-item-select';

import BreadCrumb from'../Widgets/BreadCrumb';

import { Notification, Drawer } from 'rsuite';

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

import { noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants'

const client = require('../../utils/client');

import { Formik } from "formik";
import * as yup from "yup";

/**
 * Component for Fault Escalate Management; Implements functionality for 
 * fetching FaultEscalate Records and performing operations on them.
 * 
 * @method
 * @augments React.components
 */
class FaultEscalate extends React.Component {
   
    /**
     * Fault Constructor. Initializes state to hold Fault Escalated Policys
     * and user selection.
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props) {
		super(props);
        
        this.state = {
			faultescpolicies : [], 
			selected : [], 
        };
        
		const updated =  false;
		
        this.setSelected = this.setSelected.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.getEscPolicy = this.getEscPolicy.bind(this);
    }

    selectUpdateDone () {
		this.updated = true;
    }
    /**
     * Updates the component state with the list of Fault Escalation policies selected by the User.
     * A callback is passed to and invoked by {@link FaultEscalateTable}.
     *
     * @param {Object} items Keyed object where the key is specified id of the item in list.
     */

	setSelected (items) {
        let sel = Object.keys(items); 
        let id;
		if (Array.isArray(sel) && sel.length) {
            let rid = this.state.faultescpolicies[sel[0]].policyId;
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
     * Gets list of User selected Fault Escalate Items to operate upon.
     * A callback passed to the children of {@link FaultEscalateTable}.
     * 
     * @raturns {Array} Array of ID's of selected items.
     */
    getSelected () {
		if (this.updated != true) {
			return null;
		} else {
			return this.state.selected[0];
		}
    } 
    
    /**
     * Performs a REST query to fetch Sorted list of Fault Escalated Policys and 
     * Updates of component state
     * 
     * @param {JSON} columnName Column name of the Fault Escalated Policy Table.
     * @param {JSON} direction Direction of Sort(Ascending or Descending).
     */
    handleSort(columnName,direction) {
        client({method: 'GET', path: '/api/faults-policies-escalate?sort='+columnName + ','+direction}).done(response => {
			this.setState({faultescpolicies: response.entity._embedded["faults-policies-escalate"]});
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
     * Makes REST request to get list of Escalated policies.
     */
    getEscPolicy() {
        client({method: 'GET', path: '/api/faults-policies-escalate'}).done(response => {
			this.setState({faultescpolicies: response.entity._embedded["faults-policies-escalate"]});
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
		this.getEscPolicy();
    }

     /** 
        * Renders Fault Escalate policy component view invoking child components {@link FaultEscalateToolbar} 
        *and {@link FaultEscalatepolicyList} with Fault Records fetched on component mount.
     */
    render() {
        const faultescpolicies = this.state.faultescpolicies;
        return(
            <Container>
                <Grid style={noBoxShadow} centered verticalAlign='middle'>
                    <Grid.Row style={noBoxShadow}>
                        <Grid.Column style={noBoxShadow} verticalAlign='middle'>
                            <Segment style={noBoxShadow}>
                                <Grid columns={3} verticalAlign='middle'>
                                    <Grid.Column width={4} verticalAlign='middle' textAlign='left'>
                                        {<BreadCrumb/>}
                                        <Header size='medium'>Manage Escalation Policy</Header>
                                    </Grid.Column>
                                    <Grid.Column width={5} verticalAlign='middle' textAlign='left'>
                                    </Grid.Column>
                                    <Grid.Column width={7} textAlign='right' verticalAlign='middle'>
                                        <FaultEscalateToolbar getSelected={this.getSelected} 
                                                              getEscPolicy={this.getEscPolicy}
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
							            <FaultEscalateList  faultescpolicies={faultescpolicies}
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
		);
	}
}

/**
 * Renders a tabular view of Fault Records with data passed from{@link FaultEscalateTable} component.
 * Implements selection mechanism through withSelection() hook.
 * 
 * @prop {ReactNode} props Callbacks exposed by withSelection() hook.
 * @prop {Function} SetSelected Callback to update parent's state with a list of selected Fault policy Items.
 * @prop {Array} Faultespolicies List of Fault policies to be Render.
 * @return {JSX} Render tabular view of Fault policies.
 */
const FaultEscalateTable = withSelections((props) => {
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
     * @callback setSelected Update state with the list of Fault Escalate Items selected by the User.
     */
    const setSelected = props.setSelected;

    const faultescpolicies = props.faultescpolicies;

    function handleSelectLocal (id) {
		handleSelect(id);
    }
    
    /**
     * Handles the side effect of changed selections and updates the parent State 
     * with modified set of selected Fault Escalate Items.
     */
	useEffect(() => {
        setSelected(selections);
    }, [props.selections]);
    
    if (!faultescpolicies && !faultescpolicies.length)
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
					<span>{faultescpolicies.length} Escalation Policies</span>
				</div>
      		</Segment>
            <div className = 'table-hscroll'>
				<Table striped style={stdTable}>
				<Table.Header>
					<Table.Row>
                        <Table.HeaderCell width={1}></Table.HeaderCell>
                        <Table.HeaderCell width={2}>Policy Id</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Policy Name</Table.HeaderCell>
                        <Table.HeaderCell width={4}>To Severity</Table.HeaderCell>
                        <Table.HeaderCell width={2}>No Of Hours older</Table.HeaderCell>
                        <Table.HeaderCell width={2}>No Of Days older</Table.HeaderCell>
                        <Table.HeaderCell width={4}>From Severity</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {faultescpolicies.map(policy =>(
					<Table.Row key = {faultescpolicies.indexOf(policy)}>
						<Table.Cell>
							<Checkbox checked={isItemSelected(faultescpolicies.indexOf(policy))} 
                                onChange={handleSelectLocal.bind(this, faultescpolicies.indexOf(policy))}/>
                        </Table.Cell>
                        <Table.Cell>{policy.policyId}</Table.Cell>
                        <Table.Cell>{policy.policyName}</Table.Cell>
                        <Table.Cell>{policy.toSeverity}</Table.Cell>
                        <Table.Cell>{policy.hrsOlder}</Table.Cell>
                        <Table.Cell>{policy.daysOlder}</Table.Cell>
                        <Table.Cell>{policy.fromSeverity}</Table.Cell>
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

/**
 * Component for rendering list of FaultEscalateList. Child of {@link FaultEscalateTable}
 * 
 *  @class
 * @augments React.Component
 */
class FaultEscalateList extends React.Component {
	render() {
	  return <FaultEscalateTable  setSelected={this.props.setSelected}
		  						  faultescpolicies = {this.props.faultescpolicies}
	        />;
	}
}

/**
   * Component for rendering  the FaultEscalateToolbar.child of{@link FaultEscalateTable}.
   *   
   * @class
   * @augments React.Component
*/
class FaultEscalateToolbar extends React.Component {
	render() {
		return(
			<Fragment>
                <AddButton getSelected={this.props.getSelected} getEscPolicy={this.props.getEscPolicy} />
                <ModifyButton getSelected={this.props.getSelected} getEscPolicy={this.props.getEscPolicy}/> 
                <DeleteButton getSelected={this.props.getSelected} getEscPolicy={this.props.getEscPolicy}/>                
			</Fragment>
		)
	}
}

const escalateValidationSchema = yup.object().shape({
    policyName: yup.string()
                    .min(4, "Too Short.")
                    .required('Required'),
    fromSeverity: yup.string()
                    .required('Required'),
    hrsOlder: yup.string()
                    .required('Required'),
    daysOlder: yup.string()
                    .required('Required'),
    toSeverity: yup.string()
                    .required('Required')
});

/**
 * Component for rendering the Button & Drawer views for creating FaultEscalate policy.
 * Child of {@link FaultEscalateToolbar}.
 * 
 * @class
 * @augments React.Component
 */           
class AddButton extends React.Component {
     
    /**
     * Initializes state to create  Fault Escalate  Item.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
     constructor(props) {
		super(props);
		this.state = {
            esc : 
            {
                policyId : "",
				policyName : "",
				fromSeverity : "",
				hrsOlder : "",
                daysOlder : "",
                toSeverity : "",
			},
            show:false,
        };

        this.baseState = this.state.esc;
        this.handleAdd = this.handleAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getEscPolicy = this.props.getEscPolicy;
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
    
    handleAdd() {
		let body = this.state.esc;
        var esc = body;
        client({
			method: 'POST', 
			path: '/api/faults-policies-escalate/' , 
			entity: esc, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
            this.handleNotification('success','ADD Successful');
            this.getEscPolicy();
            this.setState({esc: this.baseState});
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
            this.handleNotification('error','ADD Failed');
        });
        this.close();
		return;
    }

    handleAddEsc(values) {
        this.setState({esc:values});
        this.handleAdd();
    }

    handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let esc = {...this.state.esc};
		esc[name] = value;
		this.setState({esc});
    }
    
    /**
     * Renders a Button view to create Escalation Policy  operation on selected Faults and 
     * the Drawer view to display the user selected Fault Record.
     */
    render() {
        const esc = this.state.esc;
        return(
            <React.Fragment>
                <Button style={tbButton} onClick={this.toggleDrawer}>Create </Button>
                <Drawer show={this.state.show} onHide={this.close}>
                    <Drawer.Header>
                        <Header size='large'>Create Escalation Policy</Header>
                    </Drawer.Header>
                    <Drawer.Body>
                    <Formik
                        initialValues={esc}
                        validationSchema={escalateValidationSchema}
                        onSubmit={(values) => {
                        this.handleAddEsc(values);
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
                                            From Severity
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Input type='text'
                                                        name='fromSeverity'
                                                        value={values.fromSeverity} 
                                                        onChange={handleChange}
                                            />
                                            <p style ={{fontSize: '12pxl', color: "red"}}>
                                                {errors.fromSeverity 
                                                && touched.fromSeverity 
                                                && errors.fromSeverity}
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
                                            No of Hours older
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
                                            To Severity
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Input type='text'
                                                        name='toSeverity'
                                                        value={values.toSeverity} 
                                                        onChange={handleChange}
                                            />
                                            <p style ={{fontSize: '12pxl', color: "red"}}>
                                                {errors.toSeverity 
                                                && touched.toSeverity 
                                                && errors.toSeverity} 
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
                                        content='Submit'/>                                       
                                <Button onClick={this.close} style={tbButton} icon 
                                        floated='right' type='button' content='Cancel'>
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
 * Component for rendering the Button & Drawer views for Fault Modify.
 * Child of {@link FaultEscalateToolbar}.
 * 
 * @class
 * @augments React.Component
 */
 class ModifyButton extends React.Component {

     /**
     * Initializes state to hold Record for the selected Fault Item.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props){
    super(props);
    this.state = {
            esc : 
            {
                policyId : "",
				policyName : "",
				fromSeverity : "",
				hrsOlder : "",
                daysOlder : "",
                toSeverity : "",
			},
			show: false,
        };
        this.baseState = this.state.esc;
        this.handleModify = this.handleModify.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getEscPolicy = this.props.getEscPolicy;
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
     * Performs a REST request to fetch the details of the User selcted Fault Escalate policy
     *  Record for display in the Drawer.
     * 
     * @returns {void} On invalid selection.
     */
    handleLoad() {
        this.setState({esc: this.baseState});
		let id = this.getSelectedCb();
		if (id == null)
			return;
		client({method: 'GET', path: '/api/faults-policies-escalate/' + id}).done(response => {
			this.setState({esc: response.entity});
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
     * Performs a REST request to modify state of the User selcted Fault Esacalate policies.
     */
    handleModify() {
		let id = this.getSelectedCb();
		let body = this.state.esc;
		delete body.id;
        var esc = body;
        client({
			method: 'PUT', 
			path: '/api/faults-policies-escalate/' +id, 
			entity: esc, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
            this.handleNotification('success','Update Successful');
            this.getEscPolicy();
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
		let esc = {...this.state.esc};
		esc[name] = value;
		this.setState({esc});
    }

    handleModifyEsc(values) {
        this.setState({esc:values});
        this.handleModify();
    }

    /**
     * Renders a Button view to initiate modify operation on selected Faults escalate policy and 
     * the Drawer view to display the user selected Fault escalate policy Record.
     */
    render() {
        const esc = this.state.esc;
        return(
            <React.Fragment>
                <Button style={tbButton} onClick={this.toggleDrawer}>Modify </Button>
                <Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
                    <Drawer.Header>
                        <Header size='large'>Modify Escalation Policy</Header>
                    </Drawer.Header>
                    <Drawer.Body>
                    {esc.policyId? 
                    <Container textAlign='center'>
                    <Formik 
                        initialValues={esc}
                        validationSchema={escalateValidationSchema}                
                        onSubmit={(values) => {
                            this.handleModifyEsc(values);
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
                                                    From Severity
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='text'
                                                                name='fromSeverity'
                                                                value={values.fromSeverity}
                                                                onChange={handleChange}
                                                    />
                                                    <p style ={{fontSize: '12pxl', color: "red"}}>
                                                        {errors.fromSeverity 
                                                        && touched.fromSeverity 
                                                        && errors.fromSeverity}
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
                                                        && touched.hrsOlder 
                                                        && errors.hrsOlder}
                                                    </p>  
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row columns={4}>
                                                <Grid.Column> 
                                                    To Severity
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='text'
                                                                name='toSeverity'
                                                                value={values.toSeverity}
                                                                onChange={handleChange}
                                                    />
                                                    <p style ={{fontSize: '12pxl', color: "red"}}>
                                                        {errors.toSeverity 
                                                        && touched.toSeverity 
                                                        && errors.toSeverity}
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
                                    <Button onClick={this.close} style={tbButton} icon  
                                            floated='right' content='Cancel'type='button'
                                            >
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
 * Component for rendering the Button & Modal views for Deleting Faults.
 * Child of {@linkFaultEscalateTable }.
 * 
 * @class
 * @augments React.Component
 */
class DeleteButton extends React.Component{

	constructor(props) {
        super(props);
        this.state = {
            showModal : false
		};
		this.handleDelete = this.handleDelete.bind(this);
        this.getSelectedCb = this.props.getSelected.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.getEscPolicy = this.props.getEscPolicy;
    }

    openModal = () => {
		this.setState({ showModal: true })
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
		return;
    }
     /**
     * Invokes a REST request to Delete the User selcted Fault escalate policy Record.
     * Also fetches the updated list of Fault escalate policy Records.
     * 
     * @param {Number} id ID of the Fault escalate policy Record
     */

    onDelete(id) {
		client({method: 'DELETE', path: '/api/faults-policies-escalate/'+ id}).done(response => {
            this.closeModal();
            this.handleNotification('success','Deleted Successful');
            this.getEscPolicy();
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
     * Renders a Button view to initiate Delete operation on selected Escalation policy and 
     * the Modal view to seek User confirmation.
     */

	render() {
		return(
            <Modal dimmer='inverted' open={this.state.showModal}
                onClose={this.closeModal} trigger={<Button style={tbButton}
                onClick={this.openModal}>Delete </Button>}>
				<Modal.Header>Delete Escalation Policy</Modal.Header>
					<Modal.Content>
                        <Grid columns='equal'>
                            <Grid.Row>
                                <p>Are you sure you want to delete this policy</p>
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
    
export default FaultEscalate;
