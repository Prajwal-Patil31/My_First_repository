/**@module Fault */

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

/**
 * Component for Fault Management; Implements functionality for 
 * fetching Fault Records and performing operations on them.
 * 
 * @class
 * @augments React.Component
 */
class Fault extends React.Component {

    /**
     * Fault constructor. Initializes state to hold Fault Records
     * and user selections.
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props) {
        super(props);
        
		this.state = {
			faults : [], 
			selected : [], 
        };
    
  		this.setSelected = this.setSelected.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.getFaults = this.getFaults.bind(this);
	}

	selectUpdateDone () {
		this.updated = true;
    }

    /**
     * Updates the component state with the list of Fault Items selected by the User.
     * A callback passed to and invoked by {@link FaultTable}.
     * 
     * @param {Object} items Keyed object where the key is a specified id of the item in the list.
     */
    setSelected (items) {
		let sel = Object.keys(items);
        let id;
		if (Array.isArray(sel) && sel.length) {
            let rid = this.state.faults[sel[0]].faultId;
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
     * Gets the list of User selected Fault Items to operate upon.
     * A callback passed to the children of {@link FaultToolbar}.
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

    /**
     * Performs a REST query to fetch Sorted listed of Fault Records and 
     * updates component state.
     * 
     * @param {*} columnName Column name of the Fault Record table.
     * @param {*} direction Direction of sort (Ascending or Descending).
     */
    handleSort(columnName, direction) {
        client({method: 'GET', path: '/api/faults?sort=' + columnName + ',' + direction}).done(response => {
			this.setState({faults: response.entity._embedded.faults});
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

    /**
     * Makes a REST request to fetch Fault Records with Pagination 
     * and updates the component's State.
     */
    getFaults() {
        client({method: 'GET', path: '/api/faults'}).done(response => {
			this.setState({faults: response.entity._embedded.faults});
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
		this.getFaults();
    }
    
    /**
     * Renders Fault component view invoking child components {@link FaultToolbar} 
     * and {@link FaultList} with Fault Records fetched on component mount.
    */
    render() {
        const faults = this.state.faults;
        return(
        <Container>
            <Grid style={noBoxShadow} centered verticalAlign='middle'>
                <Grid.Row style={noBoxShadow}>
                    <Grid.Column style={noBoxShadow} verticalAlign='middle'>
                        <Segment style={noBoxShadow}>
                        <Grid columns={3} verticalAlign='middle'>
                        <Grid.Column width={4} verticalAlign='middle' textAlign='left'>
                        {<BreadCrumb/>}
                            <Header size='medium'>List of Faults</Header>
                        </Grid.Column>
                        <Grid.Column width={5} verticalAlign='middle' textAlign='left'>
                            
                        </Grid.Column>
                        <Grid.Column width={7} textAlign='right' verticalAlign='middle'>
                            <FaultToolbar getSelected={this.getSelected}  getFaults={this.getFaults}/>  
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
                            <Grid.Column style={noBoxShadow} width={1}></Grid.Column>
                            <Grid.Column style={noBoxShadow} width={14}>
                                <FaultList  faults={faults} 
                                            setSelected={this.setSelected}
                                />
                            </Grid.Column>
                            <Grid.Column style={noBoxShadow} width={1}></Grid.Column>
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
 * Component for rendering the Fault Management toolbar. Child of {@link Fault}.
 * 
 * @class
 * @augments React.Component
*/
class FaultToolbar extends React.Component {
    render() {
        return(
            <Fragment>
                <AcknowledgeButton getSelected={this.props.getSelected} getFaults={this.props.getFaults}/> 
                <ClearButton getSelected={this.props.getSelected} getFaults={this.props.getFaults}/> 
                <DeleteButton getSelected={this.props.getSelected} getFaults={this.props.getFaults}/>                  
            </Fragment>
        )
    }
}

/**
 * Component for rendering list of Faults. Child of {@link Fault}.
 * 
 * @class
 * @augments React.Component
 */
class FaultList extends React.Component {
    render() {
        return (
            <FaultTable setSelected={this.props.setSelected} 
                            page={this.props.page}
                            onChange={this.props.onChange} 
                            faults = {this.props.faults}
            />
        )
    }
}

/**
 * Renders a tabular view of Fault Records with data passed from {@link Fault} component. 
 * Implements selection mechanism through withSelections() hook.
 * 
 * @prop {ReactNode} props Callbacks exposed by withSelections() hook.
 * @prop {Function} setSelected Callback to update parent's state with a list of selected Fault Items.
 * @prop {Array} faults List of Fault Records to be rendered.
 * @return {JSX} Rendered tabular view of Fault Records.
 */
const FaultTable = withSelections((props) => {
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
     * @callback setSelected Update state with the list of Fault Items selected by the User.
     */
    const setSelected = props.setSelected;
    
    /** 
     * List of Fault Records to be rendered.
     * @type {Array}
     */
    const faults = props.faults;

    function handleSelectLocal (faultId) {
		handleSelect(faultId);
	}
    
    /**
     * Handles the side effect of changed selections and updates the parent State 
     * with modified set of selected Fault Items.
     */
	useEffect(() => {
        setSelected(selections);
    }, [props.selections]);

    if (!faults && !faults.length)
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
                <span>{faults.length} Faults </span>
            </div>
        </Segment>
        <div className = 'table-hscroll'>
            <Table striped style={stdTable}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={1}></Table.HeaderCell>
                        <Table.HeaderCell width={2}>Fault Id</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Fault Date</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Fault Error Code</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Related Fault Id</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Severity</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Status Code</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Fault Content</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Fault Sys Id</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Clear Username</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Clear Date</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Ack Username</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Ack Date</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Hostname</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Site Id</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                    <Table.Body>
                    {faults.map(fault =>(
                        <Table.Row key = {faults.indexOf(fault)}>
                            <Table.Cell>
                                <Checkbox 
                                    checked={isItemSelected(faults.indexOf(fault))} 
                                    onChange={handleSelectLocal.bind(this, faults.indexOf(fault))}
                                />
                                </Table.Cell>
                                <Table.Cell>{fault.faultId}</Table.Cell>
                                <Table.Cell>{fault.faultDate}</Table.Cell>
                                <Table.Cell>{fault.faultErrorCode}</Table.Cell>
                                <Table.Cell>{fault.relatedFaultID}</Table.Cell>
                                <Table.Cell>{fault.severity}</Table.Cell>
                                <Table.Cell>{fault.statusCode}</Table.Cell>
                                <Table.Cell>{fault.faultContent}</Table.Cell>
                                <Table.Cell>{fault.faultSysId}</Table.Cell>
                                <Table.Cell>{fault.clearUsername}</Table.Cell>
                                <Table.Cell>{fault.clearDate}</Table.Cell>
                                <Table.Cell>{fault.ackUsername}</Table.Cell>
                                <Table.Cell>{fault.ackDate}</Table.Cell>
                                <Table.Cell>{fault.hostname}</Table.Cell>
                                <Table.Cell>{fault.siteId}</Table.Cell>
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
 * Component for rendering the Button & Drawer views for Fault Acknowledgement.
 * Child of {@link FaultToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class AcknowledgeButton extends React.Component {
 
    /**
     * Initializes state to hold Record for the selected Fault Item.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
		super(props);
		this.state = {
            faults: 
            {
                severity : "",
				subSysId : "",
				host : "",
				faultId : "",
				alamErrorCode : "",
                statusCode : "",
                status : "",
			},
            show:false,			
		};
		this.getSelectedCb = this.props.getSelected.bind(this);
        this.handleAck = this.handleAck.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getFaults = this.props.getFaults.bind(this);
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
     * Performs a REST request to fetch the details of the User selcted Fault Record
     * for display in the Drawer.
     * 
     * @returns {void} On invalid selection.
     */
    handleLoad() {
		let id = this.getSelectedCb();
		if (id == null)
            return;
        client({method: 'GET', path: '/api/faults/' + id}).done(response => {
            this.setState({faults: response.entity});
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
     * Performs a REST request to set Acknowledge state of the User selcted Fault Records.
     */
    handleAck() {
        let id = this.getSelectedCb();
        let body = this.state.faults;
        delete body.id;
        const faults = body;
        client({
            method: 'PUT', 
            path: '/api/faults/' + id , 
            entity: faults, 
            headers: { 'Content-Type': 'application/json' }
        }).done(response => {
            this.handleNotification('success','Acknowledge Success');
            this.getFaults();
        }, response => {
            if (response.status.code === 401) {
                console.log('UNAUTHORIZED');
            }
            if (response.status.code === 403) {
                console.log('FORBIDDEN');	
            }
            this.handleNotification('error','Acknowledge Failed');
        });
        this.close();
        return;
    }

    handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        let faults = {...this.state.faults};
        faults[name] = value;
        this.setState({faults});
    }

    close() {
		this.setState({show: false});
    }
    
	toggleDrawer() {
		this.setState({ show: true });
    }
    
    /**
     * Renders a Button view to initiate Acknowledgement operation on selected Faults and 
     * the Drawer view to display the user selected Fault Record.
     */
	render() {
        return(
            <React.Fragment>  
                <Button style={tbButton} onClick={this.toggleDrawer}>Acknowledge </Button>
                <Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
                    <Drawer.Header>
                    <Header size='large'>Acknowledge Fault</Header>
                    </Drawer.Header>
                    <Drawer.Body>
                        <Grid columns='equal'>
                            <Grid.Row>
                                <Grid.Column width={2}></Grid.Column>
                                <Grid.Column width={12}>
                                <Form>
                                <Form.Field>
                                    <Grid columns='equal' width='1'>
                                        <Grid.Row>
                                            <Grid.Column>Severity</Grid.Column>
                                            <Grid.Column>
                                                <Form.Input disabled type='text' name='severity' 
                                                            value={this.state.faults.severity} 
                                                            onChange={this.handleChange}>
                                                </Form.Input>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>Sub System Id</Grid.Column>
                                            <Grid.Column>
                                                <Form.Input disabled type='number' name='subsysId' 
                                                            value={this.state.faults.subSysId} 
                                                            onChange={this.handleChange}>
                                                </Form.Input>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>Host Name</Grid.Column>
                                            <Grid.Column>
                                                <Form.Input disabled type='text' name='hostName' 
                                                            value={this.state.faults.host} 
                                                            onChange={this.handleChange}>
                                                </Form.Input>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>Fault Id</Grid.Column>
                                            <Grid.Column>
                                                <Form.Input disabled type='text' name='faultId' 
                                                            value={this.state.faults.faultId} 
                                                            onChange={this.handleChange}>
                                                </Form.Input>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>Error Code</Grid.Column>
                                            <Grid.Column>
                                                <Form.Input disabled type='text' name='alamErrorCode' 
                                                            value={this.state.faults.alamErrorCode} 
                                                            onChange={this.handleChange}>
                                                </Form.Input>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>Status</Grid.Column>
                                            <Grid.Column>
                                                <Form.Input type='text' name='status' value={this.state.faults.status} 
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
                                <Grid.Column></Grid.Column>
                                <Grid.Column>
                                        <Button onClick={this.handleAck.bind(this)} style={tbButton} 
                                                icon  content='Submit'>
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

/**
 * Component for rendering the Button & Drawer views for Fault Clearance.
 * Child of {@link FaultToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class ClearButton extends React.Component {

    /**
     * Initializes state to hold Record for the selected Fault Item.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
		super(props);
		this.state = {
            faults: 
            {
                severity : "",
				subSysId : "",
				host : "",
				faultId : "",
				alamErrorCode : "",
                statusCode : "",
                status : "",
			},
            show:false,          			
		}; 
		this.getSelectedCb = this.props.getSelected.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getFaults =  this.props.getFaults.bind(this);
        this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
    }

    /**
     * Performs a REST request to fetch the details of the User selcted Fault Record
     * for display in the Drawer.
     * 
     * @returns {void} On invalid selection.
     */
    handleLoad() {
		let id = this.getSelectedCb();
		if (id == null)
            return;
        client({method: 'GET', path: '/api/faults/' + id}).done(response => {
            this.setState({faults: response.entity});
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
     * Performs a REST request to set Clearance state of the User selcted Fault Records.
     */
    handleClear() {
        let id = this.getSelectedCb();
        let body = this.state.faults;
        delete body.id;
        const faults = body;
        client({
            method: 'PUT', 
            path: '/api/faults/'+id , 
            entity: faults, 
            headers: { 'Content-Type': 'application/json' }
        }).done(response => {
            this.getFaults();
            this.handleNotification('success','Cleared Successfully');
        }, response => {
            if (response.status.code === 401) {
                console.log('UNAUTHORIZED');
            }
            if (response.status.code === 403) {
                console.log('FORBIDDEN');	
            }
            this.handleNotification('error','Clear failed');
        });
        this.close();
        return;
    }

    handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        let faults = {...this.state.faults};
        faults[name] = value;
        this.setState({faults});
    }

    close() {
        this.setState({show: false});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

    /**
     * Renders a Button view to initiate Clearance operation on selected Faults and 
     * the Drawer view to display the user selected Fault Record.
     */
	render() {
        return(
            <React.Fragment>
            <Button onClick={this.toggleDrawer} style={tbButton} >Clear </Button>
            <Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
            <Drawer.Header> 
			<Header size='large'>Clear Fault</Header>
		    </Drawer.Header>
            <Drawer.Body>
            <Grid columns='equal'>
                <Grid.Row>
                    <Grid.Column width={2}></Grid.Column>
                    <Grid.Column width={12}>
                        <Form>
                        <Form.Field>
                        <Grid columns='equal' width='1'>
                            <Grid.Row>
                                <Grid.Column>Severity</Grid.Column>
                                <Grid.Column>
                                    <Form.Input disabled type='text' name='severity' 
                                                value={this.state.faults.severity}
                                                onChange={this.handleChange}>
                                    </Form.Input>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>Sub System Id</Grid.Column>
                                <Grid.Column>
                                    <Form.Input disabled type='number' name='subsysId' 
                                                value={this.state.faults.subSysId}
                                                onChange={this.handleChange}>
                                    </Form.Input>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>Host Name</Grid.Column>
                                <Grid.Column>
                                    <Form.Input disabled type='text' name='hostName' 
                                                value={this.state.faults.host}
                                                onChange={this.handleChange}>
                                    </Form.Input>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>Fault Id</Grid.Column>
                                <Grid.Column>
                                    <Form.Input disabled type='text' name='faultId' 
                                                value={this.state.faults.faultId}
                                                onChange={this.handleChange}>
                                    </Form.Input>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>Error Code</Grid.Column>
                                <Grid.Column>
                                    <Form.Input disabled type='text' name='alamErrorCode' 
                                                value={this.state.faults.alamErrorCode}
                                                onChange={this.handleChange}>
                                    </Form.Input>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>Status</Grid.Column>
                                <Grid.Column>
                                    <Form.Input type='text' name='status' 
                                                value={this.state.faults.status}
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
                    <Grid.Column></Grid.Column>
                    <Grid.Column>
                            <Button onClick={this.handleClear.bind(this)} 
                                    style={tbButton} icon content='clear'>
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

/**
 * Component for rendering the Button & Modal views for Deleting Faults.
 * Child of {@link FaultToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class DeleteButton extends React.Component {

    /**
     * Initializes state to hold Record for the selected Fault Item.
     * Also initializes handlers for Modal control.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            status : "",
            showModal : false
        };
        
        this.handleDelete = this.handleDelete.bind(this);
        this.getSelectedCb = this.props.getSelected.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.getFaults =  this.props.getFaults.bind(this);
    }

    openModal = () => {
        this.setState({ showModal: true })
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }
    
    /**
     * 
     */
    handleDelete() {
        let id = this.getSelectedCb();
        this.onDelete(id);
        return;
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
     * Invokes a REST request to Delete the User selcted Fault Record.
     * Also fetches the updated list of Fault Records.
     * 
     * @param {Number} id ID of the Fault Record
     */
    onDelete(id) {
        client({method: 'DELETE', path: '/api/faults/'+ id}).done(response => {
            this.getFaults();
            this.handleNotification('success','Deleted Successfully');
        }, response => {
            if (response.status.code === 401) {
                console.log('UNAUTHORIZED');
            }
            if (response.status.code === 403) {
                console.log('FORBIDDEN');	
            }
            this.handleNotification('error','Deleted Failed ');
        });
    }

    /**
     * Renders a Button view to initiate Delete operation on selected Faults and 
     * the Modal view to seek User confirmation.
     */
    render() {
        return(
            <Modal dimmer='inverted' open={this.state.showModal} onClose={this.closeModal} 
                    trigger={<Button style={tbButton} onClick={this.openModal}>Delete </Button>}>
                <Modal.Header>Delete Fault</Modal.Header>
                    <Modal.Content>
                        <Grid columns='equal'>
                            <Grid.Row>
                                <p>Are you Sure you Want To Delete this Fault?</p>
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

export default Fault;