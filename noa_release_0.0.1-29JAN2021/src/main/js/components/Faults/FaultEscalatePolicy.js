import React, {Fragment, useState, useEffect} from 'react';
import update from 'react-addons-update';
import withSelections from 'react-item-select';
import { Drawer, Notification } from 'rsuite';
import BreadCrumb from'../Widgets/BreadCrumb';
import {
  Grid, 
  Container,
  Step, 
  Modal,
  Button,
  Header,
  Input,
  Form,
  Label,
  Table,
  Dropdown,
  Checkbox,
  Segment,
  Divider, Icon,
  Pagination} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { menuStyle, noBorder, noPadding, noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants'

const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const stompClient = require('../../utils/websocket-listener');
const root = '/api';


class FaultEscalate extends React.Component{
    
	constructor(props) {
		super(props);
		this.state = {
			faultescpolicies: [], 
			selected: [], 
			page: {size: 0, totalPages : 0, number: 0},
			isLoggedIn: false
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

	setSelected (items) {
        let sel = Object.keys(items); 
        let id;
		if (Array.isArray(sel) && sel.length) {
            let rid = this.state.faultescpolicies[sel[0]].policyId;
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
			return null;
		} else {
			return this.state.selected[0];
		}
    }   
    handleSort(columnName,direction) {
        client({method: 'GET', path: '/api/faults-policies-escalate?sort='+columnName + ','+direction}).done(response => {
			this.setState({faultescpolicies: response.entity._embedded["faults-policies-escalate"]});
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
    getEscPolicy() {
        client({method: 'GET', path: '/api/faults-policies-escalate'}).done(response => {
			this.setState({faultescpolicies: response.entity._embedded["faults-policies-escalate"]});
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
		this.getEscPolicy();
	}
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        const faultescpolicies = this.state.faultescpolicies;
        const page = this.state.page;
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
                                <FaultEscalateToolbar getSelected={this.getSelected} getEscPolicy={this.getEscPolicy}/>       
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
													  page={page}
													  setSelected={this.setSelected}
                                                      handleSort={this.handleSort}
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

const FaultEscalateTable = withSelections((props) =>{
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
    const faultescpolicies = props.faultescpolicies;
    const noItems = faultescpolicies.length;
    const handleSort = props.handleSort;

    function handleSelectLocal (id) {
		handleSelect(id);
	}

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

class FaultEscalateList extends React.Component{
	render() {
	  return <FaultEscalateTable setSelected={this.props.setSelected}
	  							  page={this.props.page}
		  						  faultescpolicies = {this.props.faultescpolicies}
                                  handleSort = {this.props.handleSort}
	        />;
	}
  }

  class FaultEscalateToolbar extends React.Component{
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
              
class AddButton extends React.Component{

    constructor(props){
		super(props);
		this.state = {
			esc: {
                policyId: "",
				policyName: "",
				fromSeverity: "",
				hrsOlder: "",
                daysOlder: "",
                toSeverity: "",
			},
            status:"",
            show:false,
        };
        this.baseState = this.state.esc;
        this.handleAdd = this.handleAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getEscPolicy = this.props.getEscPolicy;
        this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
    }

    handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
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
    
    handleAdd() {
        this.setState({esc: this.baseState});
		let body = this.state.esc;
        var esc = body;
        client({
			method: 'POST', 
			path: '/api/faults-policies-escalate/' , 
			entity: esc, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
            this.setState({status:"ADD Successful"});
            this.handleNotification('success','ADD Successful');
            this.getEscPolicy();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
            this.setState({status:"ADD Failed"});
            this.handleNotification('error','ADD Failed');
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

	updateStatus(value){
		this.setState({status:value});
	}

    render(){
        const {esc} = this.state;
        return(
            <React.Fragment>
                <Button style={tbButton} onClick={this.toggleDrawer}>Create </Button>
                <Drawer show={this.state.show} onHide={this.close}>
                    <Drawer.Header>
                        <Header size='large'>Create Escalation Policy</Header>
                    </Drawer.Header>
                    <Drawer.Body>
                        <Grid columns='equal'>
                            <Grid.Row>
                                <Grid.Column width={2}>
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <Form> 
                                        <Grid columns='equal' width='1'>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    Policy Name
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='text'
                                                                name='policyName'
                                                                value={esc.policyName} 
                                                                onChange={this.handleChange}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    From Severity
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='text'
                                                                name='fromSeverity'
                                                                value={esc.fromSeverity} 
                                                                onChange={this.handleChange}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    No of Days Older
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='number'
                                                                name='daysOlder' 
                                                                value={esc.daysOlder} 
                                                                onChange={this.handleChange}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    No of Hours older
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='number' 
                                                                name='hrsOlder' 
                                                                value={esc.hrsOlder} 
                                                                onChange={this.handleChange}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row columns={4}>
                                                <Grid.Column> 
                                                    To Severity
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='text'
                                                                name='toSeverity'
                                                                value={esc.toSeverity} 
                                                                onChange={this.handleChange}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                        <div>
                                            
                                        </div>
                                    </Form>
                                </Grid.Column>
                                <Grid.Column width={2}></Grid.Column>
                            </Grid.Row>
                            <Grid.Row></Grid.Row>
                            <Grid.Row></Grid.Row>
                            <Grid.Row>
                                <Grid.Column></Grid.Column>
                                <Grid.Column>
                                        <Button onClick={this.handleAdd.bind(this)} icon style={tbButton} 
                                                content='Submit'>
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

class ModifyButton extends React.Component{

    constructor(props){
		super(props);
		this.state = {
			esc: {
                policyId: "",
				policyName: "",
				fromSeverity: "",
				hrsOlder: "",
                daysOlder: "",
                toSeverity: "",
			},
			status:"",
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

    handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
    }

    handleLoad() {
        this.setState({esc: this.baseState});
		let id = this.getSelectedCb();
		if (id == null)
			return;
		client({method: 'GET', path: '/api/faults-policies-escalate/' + id}).done(response => {
			this.setState({esc: response.entity});
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
		this.handleReset();
	}

	toggleDrawer() {
		this.setState({ show: true });
	}

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
            this.setState({status:"Update Successful"});
            this.handleNotification('success','Update Successful');
            this.getEscPolicy();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
            this.setState({status:"Update Failed"});
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

	updateStatus(value){
		this.setState({status:value});
	}
        
    render(){
        return(
            <React.Fragment>
                <Button style={tbButton} onClick={this.toggleDrawer}>Modify </Button>
                <Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>
                    <Drawer.Header>
                        <Header size='large'>Modify Escalation Policy</Header>
                    </Drawer.Header>
                    <Drawer.Body>
                        <Grid columns='equal'>
                            <Grid.Row>
                                <Grid.Column width={2}></Grid.Column>
                                <Grid.Column width={12}>
                                    <Form>
                                        <Grid columns='equal' width='1'>
                                        <Grid.Row>
                                                <Grid.Column>
                                                    Policy Name
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='text'
                                                                name='policyName'
                                                                value={this.state.esc.policyName}
                                                                onChange={this.handleChange}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    From Severity
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='text'
                                                                name='fromSeverity'
                                                                value={this.state.esc.fromSeverity}
                                                                onChange={this.handleChange}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    No of Days Older
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='number'
                                                                name='daysOlder'
                                                                value={this.state.esc.daysOlder}
                                                                onChange={this.handleChange}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    No of Hours Older
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='number'
                                                                name='hrsOlder'
                                                                value={this.state.esc.hrsOlder}
                                                                onChange={this.handleChange}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row columns={4}>
                                                <Grid.Column> 
                                                    To Severity
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Form.Input type='text'
                                                                name='toSeverity'
                                                                value={this.state.esc.toSeverity}
                                                                onChange={this.handleChange}
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                        <div>
                                            
                                        </div>
                                    </Form>
                                </Grid.Column>
                                <Grid.Column width={2}></Grid.Column>
                            </Grid.Row>
                            <Grid.Row></Grid.Row>
                            <Grid.Row></Grid.Row>
                            <Grid.Row>
                                <Grid.Column></Grid.Column>
                                <Grid.Column>
                                    <Button onClick={this.handleModify.bind(this)} style={tbButton} icon 
                                            content='Submit'>
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

class DeleteButton extends React.Component{

	constructor(props){
        super(props);
        this.state = {
			status:""

		};
		this.handleDelete = this.handleDelete.bind(this);
        this.getSelectedCb = this.props.getSelected.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.getEscPolicy = this.props.getEscPolicy;
    }
    openModal = () => {
		this.setState({ showModal: true })
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
		return;
    }

    onDelete(id) {
		client({method: 'DELETE', path: '/api/faults-policies-escalate/'+ id}).done(response => {
            this.setState({status:"Deleted Successful"});
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
            this.setState({status:"Deleted Failed"});
            this.handleNotification('error','Deleted Failed');
		});
    }
    handleChange(value){
		this.setState({status:value});
	}
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
