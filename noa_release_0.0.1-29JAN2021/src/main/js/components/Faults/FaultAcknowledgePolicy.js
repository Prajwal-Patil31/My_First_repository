import React, {Fragment, useState, useEffect} from 'react';
import update from 'react-addons-update';
import withSelections from 'react-item-select';
import { Notification,Drawer } from 'rsuite';
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
  Divider,Icon,
  Pagination} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { menuStyle, noBorder, noPadding, noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants'

const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const stompClient = require('../../utils/websocket-listener');
const root = '/api';

class FaultAcknowledgement extends React.Component{

	constructor(props) {
        super(props);
        
		this.state = {
			faultackpolicies: [], 
			selected: [], 
			page: {size: 0, totalPages : 0, number: 0},
			isLoggedIn: false
        };
        
        const updated =  false;
        this.getPage = this.getPage.bind(this);
		this.onChange = this.onChange.bind(this);
  		this.setSelected = this.setSelected.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.getAckPolicy = this.getAckPolicy.bind(this);
    }
    selectUpdateDone () {
		this.updated = true;
	}

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
    
    getSelected () {
		if (this.updated != true) {
			return null;
		} else {
			return this.state.selected[0];
		}
    }
    onChange (event, data) {
		client({method: 'GET', path: '/api/faults-policies-acknowledge?page=' + data.activePage}).done(response => {
			this.setState((state, props) => ({ 
				faultackpolicies: response.entity._embedded["faults-policies-acknowledge"]
			}));
			this.setState({page: response.entity.page});
		});
	}

	getPage() {
		client({method: 'GET', path: '/api/faults-policies-acknowledge?page=' + this.state.page.number}).done(response => {
			this.setState((state, props) => ({ 
				faultackpolicies: response.entity._embedded["faults-policies-acknowledge"]
			}));
			this.setState({page: response.entity.page});
		});
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
    componentDidMount() { (2)
		this.getAckPolicy();
    }

    render() {
        const isLoggedIn = this.state.isLoggedIn;
        const faultackpolicies = this.state.faultackpolicies;
        const page = this.state.page;

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
                        	<FaultAcknowledgeToolbar getSelected={this.getSelected} getAckPolicy = {this.getAckPolicy}/>
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
                                           			    page={page}
                                             		    setSelected={this.setSelected}
                                                        handleSort={this.handleSort}
                                                        onChange={this.onChange}
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

const FaultAcknowledgementTable = withSelections((props) =>{
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
    const faultackpolicies = props.faultackpolicies;
    const handleSort = props.handleSort;

    function handleSelectLocal (id) {
			handleSelect(id);
	}

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

class FaultAcknowledgementList extends React.Component{
	render() {
	  return <FaultAcknowledgementTable setSelected={this.props.setSelected}
	  							  		page={this.props.page}
		  						  		faultackpolicies = {this.props.faultackpolicies}
                                        handleSort = {this.props.handleSort}
                                        onChange = {this.props.onChange}
	    />;
	}
}

class FaultAcknowledgeToolbar extends React.Component{
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

class AddButton extends React.Component{

    constructor(props){
		super(props);
		this.state = {
			policy: {
                policyId: "",
            	severity: "",
				hrsOlder: "",
				daysOlder: "",
            	retainFault: "",
            	policyName: "",
            },
            show: false,
            status:"",
            
        };
        this.baseState = this.state.policy;
        this.handleAdd = this.handleAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getAckPolicy = this.props.getAckPolicy;
        this.close = this.close.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
    }

    close() {
		this.setState({
		  show: false
		});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}
   
    handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
    }

    handleAdd() {
        this.setState({policy: this.baseState});
		let body = this.state.policy;
        var policy = body;
        client({
			method: 'POST', 
			path: '/api/faults-policies-acknowledge/', 
			entity: policy, 
			headers: { 'Content-Type': 'application/json' }
		}).done(response => {
            this.setState({status:"Add Successful"});
            this.handleNotification('success','Policy Created Successfully');
            this.getAckPolicy();
		}, response => {
			if (response.status.code === 401) {
				console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
				console.log('FORBIDDEN');	
			}
            this.setState({status:"Add Failed"});
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

	updateStatus(value){
		this.setState({status:value});
	}

	render() {
        const {policy} = this.state;
        return(
        <React.Fragment>
           <Button onClick={this.toggleDrawer} style={tbButton}>Create</Button>
           <Drawer show={this.state.show} onHide={this.close}>   
           <Drawer.Header>
			    <Header size='large' content='Create Acknowledgement Policy'/>
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
                                                            value={policy.policyName} 
                                                            onChange={this.handleChange}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column> 
                                                Severity
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Form.Input type='text' 
                                                            name='severity' 
                                                            value={policy.severity} 
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
                                                            value={policy.daysOlder}
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
                                                            value={policy.hrsOlder} 
                                                            onChange={this.handleChange}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row columns={4}>
                                            <Grid.Column> 
                                                Retain Minimum Faults
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Form.Input type='number'
                                                            name='retainFault' 
                                                            value={policy.retainFault}
                                                            onChange={this.handleChange}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
					            </Form>
					        </Grid.Column>
					        <Grid.Column width={2}></Grid.Column>
					    </Grid.Row>
                        <Grid.Row></Grid.Row>
                        <Grid.Row></Grid.Row>
                        <Grid.Row>
                            <Grid.Column></Grid.Column>
                            <Grid.Column>
                                    <Button onClick={this.handleAdd.bind(this)} 
                                            icon style={tbButton} 
                                            content='Submit'>
                                    </Button>
                                    <Button onClick={this.close}
                                            icon style={tbButton} 
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

class ModifyButton extends React.Component{

    constructor(props){
		super(props);
		this.state = {
			policy: {
                policyId: "",
                severity: "",
				hrsOlder: "",
				daysOlder: "",
                retainFault: "",
                policyName: "",
			},
            status:"",
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
            this.setState({status:"Update Successful"});
            this.handleNotification('success','Update Successfully');
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
        let policy = {...this.state.policy};
        policy[name] = value;
        this.setState({policy});
    }

    updateStatus(value){
        this.setState({status:value});
    }
    
	render() {
        return(
            <React.Fragment>
           <Button style={tbButton}onClick={this.toggleDrawer}>Modify </Button>
           <Drawer show={this.state.show} onHide={this.close} onEnter={this.handleLoad.bind(this)}>  
                <Drawer.Header>
			        <Header size='large' content='Modify Acknowledgement Policy'/>
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
                                                        value={this.state.policy.policyName}
                                                        onChange={this.handleChange}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
					                <Grid.Row>
                                        <Grid.Column> 
                                            Severity
                                        </Grid.Column>
					                    <Grid.Column>
                                            <Form.Input type='text' 
                                                        name='severity' 
                                                        value={this.state.policy.severity} 
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
                                                        value={this.state.policy.daysOlder} 
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
                                                        value={this.state.policy.hrsOlder}
                                                        onChange={this.handleChange}
                                            />
						                </Grid.Column>
						            </Grid.Row>
						            <Grid.Row columns={4}>
                                        <Grid.Column> 
                                            Retain Minimum Faults
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Input type='number' 
                                                        name='retainFault' 
                                                        value={this.state.policy.retainFault}
                                                        onChange={this.handleChange}
                                            />
						                </Grid.Column>
						            </Grid.Row>
                                </Grid>
					            </Form>
					        </Grid.Column>
					        <Grid.Column width={2}></Grid.Column>
					    </Grid.Row>
                        <Grid.Row></Grid.Row>
                        <Grid.Row></Grid.Row>
                        <Grid.Row>
                            <Grid.Column></Grid.Column>
                            <Grid.Column>
                                    <Button onClick={this.handleModify.bind(this)}
                                            icon style={tbButton} content='Submit'>
                                    </Button>
                                    <Button onClick={this.close}
                                            icon style={tbButton}  
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
				status:"",				
        };
        
		this.handleDelete = this.handleDelete.bind(this);
		this.getSelectedCb = this.props.getSelected.bind(this);
		this.handleChange = this.handleChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.getAckPolicy = this.props.getAckPolicy;
    }

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
	
	handleDelete() {
		let id = this.getSelectedCb();
		this.onDelete(id);
		return;
    }
    
	onDelete(id){
		client({method: 'DELETE', path: '/api/faults-policies-acknowledge/' + id}).done(response => {
            this.getAckPolicy();
            this.handleNotification('success','Deleted Successfully');
            this.closeModal();
            this.getAckPolicy();
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
		this.state({status:value});
	}

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