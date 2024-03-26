import React, { Fragment, useEffect } from 'react';
import withSelections from 'react-item-select';
import update from 'react-addons-update';
import BreadCrumb from '../Widgets/BreadCrumb';
import { Notification } from 'rsuite';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import {
	Grid, Segment, Modal, Button,
	Header, Table, Form, Input,
	Checkbox, Label, Divider, Container,
	Icon, Dropdown} from 'semantic-ui-react';

import { menuStyle, noBorder, noPadding, 
		 noBoxShadow, tbButton, stdTable, 
		 segmentStyle, 
		 drawerStyle} from '../../constants';

import 'semantic-ui-css/semantic.min.css';
import { Drawer } from 'rsuite';

const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const stompClient = require('../../utils/websocket-listener');
const root = '/api'

class AuditInfo extends React.Component{
    constructor(props) {
		super(props);
			this.state = {
				audits: [],
				isLoggedIn: false,
				selected: []
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
	
    setSelected(items) {
        let sel = Object.keys(items);
        let id;
        if (Array.isArray(sel) && sel.length) {
            let rid = this.state.audits[sel[0]].auditId;
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

	render(){
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
					  		<AuditInfoToolbar getSelected={this.getSelected} getAudits={this.getAudits}/>
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
					  <AuditInfoList audits={audits} setSelected={this.setSelected}
					  				 handleSort={this.handleSort} />
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

class AuditInfoList extends React.Component {
    render() {
        return (
            <AuditInfoTable setSelected={this.props.setSelected} audits={this.props.audits}
							handleSort={this.props.handleSort}/>
        )
    }
}

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

    const setSelected = props.setSelected;
	const audits = props.audits;
	const handleSort = props.handleSort;

    function handleSelectLocal (id) {
        handleSelect(id);
    }

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
					<Icon name='caret up' onClick={() =>handleSort('time','asc')}/>
					<Icon name='caret down' onClick={() =>handleSort('time','desc')}/>
				</Table.HeaderCell>
                <Table.HeaderCell>Operation</Table.HeaderCell>
                <Table.HeaderCell>
					Status
					<Icon name='caret up' onClick={() =>handleSort('status','asc')}/>
					<Icon name='caret down' onClick={() =>handleSort('status','desc')}/>
				</Table.HeaderCell>
                <Table.HeaderCell>
					Host
					<Icon name='caret up' onClick={() =>handleSort('host','asc')}/>
					<Icon name='caret down' onClick={() =>handleSort('host','desc')}/>
				</Table.HeaderCell>
                <Table.HeaderCell width={2}>Activity</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {audits.map(audit => (
                <Table.Row key={audits.indexOf(audit)}>
                    <Table.Cell>
                        <Checkbox	checked={isItemSelected(audits.indexOf(audit))} 
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

class AuditInfoToolbar extends React.Component {
    render(){
        return(
            <ViewDetails getSelected={this.props.getSelected} />
        )
    }
}

class ViewDetails extends React.Component {

	state={showModal: false};

	constructor(props){
		super(props);
		this.state = {
            audits: {
                userName:"",
                activity:"",
                apiName:"",
                desc:""
			},
			status:"",
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

	handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

	handleLoad() {
		this.setState({audits: this.baseState});
		let id = this.getSelectedCb();
		if (id == null)
			return;
		client({method: 'GET', path: '/api/security-audit/' + id}).done(response => {
			this.setState({audits: response.entity});
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
			this.setState({status:"Change Successful"});
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
		this.setState({
		  show: false
		});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

	render(){
        const {audits} = this.state;
	  return (
		<React.Fragment>
		<Button style={tbButton} onClick={this.toggleDrawer}>View</Button>
		<Drawer show={this.state.show} onEnter={this.handleLoad.bind(this)} onHide={this.close}> 
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

export default AuditInfo; 