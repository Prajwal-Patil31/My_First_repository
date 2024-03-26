/**@module AuditInfo */

import React, { Fragment, useEffect } from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';

import BreadCrumb from '../Widgets/BreadCrumb';

import { Notification, Drawer } from 'rsuite';

import {
	Grid, 
	Segment, 
	Button,
	Header, 
	Table, 
	Form,
	Checkbox, 
	Divider, 
	Container,
	Icon
} from 'semantic-ui-react';

import { noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants';

import 'semantic-ui-css/semantic.min.css';

const client = require('../../utils/client');


/**
 * Component for Audit Info Management; Implements functionality for 
 * fetching Audit Info.
 * 
 * @class
 * @augments React.Component
 */
class AuditInfo extends React.Component {

	/**
     * Audit Info constructor. Initializes state to hold Audit Info
     * and user selections.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
		super(props);
			this.state = {
				audits : [],
				selected : []
			};
			const updated = false;
			this.setSelected = this.setSelected.bind(this);
			this.getSelected = this.getSelected.bind(this);
			this.handleSort = this.handleSort.bind(this);
			this.getAudits = this.getAudits.bind(this);
	}
	
    selectUpdateDone () {
        this.updated = true;
    }
	
	/**
     * Updates the component state with the list of Audit Items selected by the User.
     * A callback passed to and invoked by {@link AuditInfoTable}.
     * 
     * @param {Object} items Keyed object where the key is a specified id of the item in the list.
     */
    setSelected(items) {
        let sel = Object.keys(items);
        let id;
        if (Array.isArray(sel) && sel.length) {
            let rid = this.state.audits[sel[0]].auditId;
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
     * Gets the list of User selected Audit Items to operate upon.
     * A callback passed to the children of {@link AuditInfoToolbar}.
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
     * Performs a REST query to fetch Sorted listed of Audit Info and 
     * updates component state.
     * 
     * @param {*} columnName Column name of the Audit Info table.
     * @param {*} direction Direction of sort (Ascending or Descending).
     */
	handleSort(columnName,direction) {
		client({method: 'GET', path: '/api/security-audit?sort='+columnName + ','+direction})
		.done(response => {
			this.setState({audits: response.entity._embedded["security-audit"]});
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
     * Makes a REST request to fetch Audit details with Pagination 
     * and updates the component's State.
     */
	getAudits() {
		client({method: 'GET', path: '/api/security-audit'}).done(response => { 
			this.setState({audits: response.entity._embedded["security-audit"]});
			this.setState({isLoggedin: true});
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
	componentDidMount() {		
		this.getAudits();
	}

	/**
     * Renders Audit Info component view invoking child components {@link AuditInfoToolbar} 
     * and {@link AuditInfoList} with Audit Info fetched on component mount.
     */
	render() {
		const isLoggedIn = this.state.isLoggedIn;
		const audits = this.state.audits;

	return(
		<Container>
		<Grid style={noBoxShadow} centered verticalAlign='middle'>
		<Grid.Row style={noBoxShadow}>
		<Grid.Column style={noBoxShadow} verticalAlign='middle'>
		<Segment style={noBoxShadow}>
			<Grid columns={3} verticalAlign='middle'>
			<Grid.Column width={4} verticalAlign='middle' textAlign='left'>
			{<BreadCrumb/>}
			<Header size='medium'>Audit Information</Header>
			</Grid.Column>
			<Grid.Column width={5} verticalAlign='middle' textAlign='left'>
			</Grid.Column>
			<Grid.Column width={7} textAlign='right' verticalAlign='middle'>
				<Fragment>
					<AuditInfoToolbar getSelected={this.getSelected} 
									  getAudits={this.getAudits}
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
					<AuditInfoList  audits={audits} 
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
	)
  }
}

/**
 * Component for rendering list of Audits. Child of {@link AuditInfo}.
 * 
 * @class
 * @augments React.Component
 */
class AuditInfoList extends React.Component {
    render() {
        return (
            <AuditInfoTable setSelected={this.props.setSelected} 
							audits={this.props.audits}
							handleSort={this.props.handleSort}
			/>
        )
    }
}

/**
 * Renders a tabular view of Audit Info with data passed from {@link AuditInfo} component. 
 * Implements selection mechanism through withSelections() hook.
 * 
 * @prop {ReactNode} props Callbacks exposed by withSelections() hook.
 * @prop {Function} setSelected Callback to update parent's state with a list of selected Audit Items.
 * @prop {Array} faults List of Audit details to be rendered.
 * @return {JSX} Rendered tabular view of Audit details.
 */
const AuditInfoTable = withSelections((props) => {
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
     * @callback setSelected Update state with the list of Audit Items selected by the User.
     */
    const setSelected = props.setSelected;

	/** 
     * List of Audit Details to be rendered.
     * @type {Array}
     */
	const audits = props.audits;
	const handleSort = props.handleSort;

    function handleSelectLocal (id) {
        handleSelect(id);
    }

	/**
     * Handles the side effect of changed selections and updates the parent State 
     * with modified set of selected Audit Items.
     */
    useEffect(() => {
        setSelected(selections);
       }, [props.selections]);
	
	if (!audits && !audits.length)
		return null;

    return(
        <div>
        <Segment basic textAlign="left" style={segmentStyle}>
            {!areAnySelected}
            <div style={{ visibility: areAnySelected ? 'visible' : 'hidden' }}>
            <span style={{marginRight: '8px'}}>{selectedCount} selected</span>
            <Button basic onClick={handleClearAll}>Clear</Button>
            </div>
            <div>
            <span>{audits.length} Audit Logs</span>
            </div>
        </Segment>
		<div className = 'table-hscroll'>
        <Table striped style={stdTable}>
            <Table.Header>
                <Table.Row>
                <Table.HeaderCell width={1}>
                </Table.HeaderCell>
                <Table.HeaderCell>User Name</Table.HeaderCell>
                <Table.HeaderCell>
					Time
					<Icon name='caret up' 
						  onClick={() =>handleSort('time','asc')}/>
					<Icon name='caret down' 
						  onClick={() =>handleSort('time','desc')}/>
				</Table.HeaderCell>
                <Table.HeaderCell>Operation</Table.HeaderCell>
                <Table.HeaderCell>
					Status
					<Icon name='caret up' 
						  onClick={() =>handleSort('status','asc')}/>
					<Icon name='caret down' 
					      onClick={() =>handleSort('status','desc')}/>
				</Table.HeaderCell>
                <Table.HeaderCell>
					Host
					<Icon name='caret up' 
						  onClick={() =>handleSort('host','asc')}/>
					<Icon name='caret down' 
						  onClick={() =>handleSort('host','desc')}/>
				</Table.HeaderCell>
                <Table.HeaderCell width={2}>Activity</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {audits.map(audit => (
                <Table.Row key={audits.indexOf(audit)}>
                    <Table.Cell>
                        <Checkbox checked={isItemSelected(audits.indexOf(audit))}
								  onChange={handleSelectLocal.bind(this, 
											audits.indexOf(audit))} />
                    </Table.Cell>
                    <Table.Cell>{audit.userName}</Table.Cell>
                    <Table.Cell>{audit.time}</Table.Cell>
                    <Table.Cell>{audit.operation}</Table.Cell>
                    <Table.Cell>{audit.status}</Table.Cell>
                    <Table.Cell>{audit.host}</Table.Cell>
                    <Table.Cell>{audit.activity}</Table.Cell>
                </Table.Row>
                ))}
            </Table.Body>
        </Table>
		</div>
        </div>
	);
});

/** 
 * Component for rendering the Audit Info toolbar. Child of {@link AuditInfo}.
 * 
 * @class
 * @augments React.Component
*/
class AuditInfoToolbar extends React.Component {
    render() {
        return(
            <ViewDetails getSelected={this.props.getSelected}/>
        )
    }
}

/**
 * Component for rendering the Button & Drawer views for Audit Deatils.
 * Child of {@link AuditInfoToolbar}.
 * 
 * @class
 * @augments React.Component
 */
class ViewDetails extends React.Component {

	/**
     * Initializes state to hold Record for the selected Audit Item.
     * Also initializes handlers for Drawer control.
     * 
     * @constructor
     * @param {*} props 
     */
	constructor(props) {
		super(props);
		this.state = {
            audits : {
                userName : "",
                activity : "",
                apiName : "",
                desc : ""
			},
			show: false,
		};
		this.baseState = this.state.audits;
		this.handleNotification = this.handleNotification.bind(this);
		this.handleModify = this.handleModify.bind(this);
		this.handleLoad = this.handleLoad.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.getAudits = this.props.getAudits;
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
     * Performs a REST request to fetch the details of the User selected Audit
     * for display in the Drawer.
     * 
     * @returns {void} On invalid selection.
     */
	handleLoad() {
		this.setState({audits: this.baseState});
		let id = this.getSelectedCb();
		if (id == null)
			return;
		client({method: 'GET', path: '/api/security-audit/' + id}).done(response => {
			this.setState({audits: response.entity});
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

	/**
     * Performs a REST request to set Audit state of the User selected Audit Details.
     */
	handleModify() {
		let id = this.getSelectedCb();
		let body = this.state.audits;
		delete body.id;
		var logs = body;
		client({
			method: 'PUT', 
			path: '/api/security-audit/'+ id, 
			entity: logs, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
			this.handleNotification('success','change is Succesfully implemented');
			this.closeModal();
			this.getAudits();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
			this.setState({status:"Failed to Change"});
			this.handleNotification('error','change is not Succesfully implemented');
		});
		this.close;
		return;
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let audits = {...this.state.audits};
		audits[name] = value;
		this.setState({audits});
	}

	updateStatus(value){
		this.setState({status:value});
	}

	close() {
		this.setState({show: false});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	/**
     * Renders a Button view to initiate ViewDetails operation on selected Audits and 
     * the Drawer view to display the user selected Audit Details.
     */
	render() {
        const {audits} = this.state;
	  return (
		<React.Fragment>
		<Button style={tbButton} 
		   		onClick={this.toggleDrawer}>
			View
		</Button>
		<Drawer show={this.state.show} 
			 	onEnter={this.handleLoad.bind(this)} 
				onHide={this.close}>
		<Drawer.Header>
			<Header size='large' content='Audit Details' />
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
							<Grid.Column>User Name</Grid.Column>
							<Grid.Column>
								<Form.Input type='text' name='userName' 
											value={audits.userName} 
											onChange={this.handleChange}>
								</Form.Input>
							</Grid.Column>
						</Grid.Row>
							<Grid.Row>
							<Grid.Column>Activity</Grid.Column>
							<Grid.Column>
								<Form.Input type='text' name='activity' 
											value={audits.activity} 
											onChange={this.handleChange}>
								</Form.Input>
							</Grid.Column>
						</Grid.Row>
							<Grid.Row>
							<Grid.Column>API Name</Grid.Column>
							<Grid.Column>
								<Form.Input type='text' name='apiName' 
											value={audits.apiName} 
											onChange={this.handleChange}>
								</Form.Input>
							</Grid.Column>
						</Grid.Row>
							<Grid.Row>
							<Grid.Column>Change Description</Grid.Column>
							<Grid.Column>
								<Form.Input type='text' name='desc' 
											value={audits.desc} 
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
					<Button onClick={this.handleModify.bind(this)} 
							icon style={tbButton}
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

export default AuditInfo; 