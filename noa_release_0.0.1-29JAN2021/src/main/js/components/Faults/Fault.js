import React, {Fragment, useState, useEffect} from 'react';
import update from 'react-addons-update';
import withSelections from 'react-item-select';
import { Notification, Drawer } from 'rsuite';

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
import BreadCrumb from'../Widgets/BreadCrumb';
import { menuStyle, noBorder, noPadding, noBoxShadow, tbButton, stdTable, segmentStyle } from '../../constants'

const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const stompClient = require('../../utils/websocket-listener');
const root = '/api';

class Fault extends React.Component{

	constructor(props) {
        super(props);
        
		this.state = {
			faults: [], 
			selected: [], 
			page: {size: 0, totalPages : 0, number: 0},
			isLoggedIn: false
		};
		this.getPage = this.getPage.bind(this);
		this.onChange = this.onChange.bind(this);
  		this.setSelected = this.setSelected.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.getFaults = this.getFaults.bind(this);
	}
	selectUpdateDone () {
		this.updated = true;
    }

    setSelected (items) {
		let sel = Object.keys(items);
        let id;
		if (Array.isArray(sel) && sel.length) {
            let rid = this.state.faults[sel[0]].faultId;
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
		client({method: 'GET', path: '/api/faults?page=' + data.activePage}).done(response => {
			this.setState((state, props) => ({ 
				faults: response.entity._embedded.faults
			}));
			this.setState({page: response.entity.page});
		});
	}

	getPage() {
		client({method: 'GET', path: '/api/faults?page=' + this.state.page.number}).done(response => {
			this.setState((state, props) => ({ 
				faults: response.entity._embedded.faults
			}));
			this.setState({page: response.entity.page});
		});
    }
    handleSort(columnName,direction) {
        client({method: 'GET', path: '/api/faults?sort='+columnName + ','+direction}).done(response => {
			this.setState({faults: response.entity._embedded.faults});
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
    getFaults() {
        client({method: 'GET', path: '/api/faults'}).done(response => {
			this.setState({faults: response.entity._embedded.faults});
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
		this.getFaults();
    }
    
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        const faults = this.state.faults;
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
                                    <FaultList faults={faults} page={page} 
                                                    setSelected={this.setSelected}
                                                    onChange={this.onChange}
                                                    handleSort={this.handleSort}
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

const FaultTable = withSelections((props) =>{
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
    const faults = props.faults;
    const handleSort = props.handleSort;
    

    function handleSelectLocal (faultId) {
		handleSelect(faultId);
	}
    
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

class FaultList extends React.Component{
    render() {
        return <FaultTable setSelected={this.props.setSelected} 
                                page={this.props.page}
                                onChange={this.props.onChange} 
                                faults = {this.props.faults}
                                handleSort = {this.props.handleSort}
                                />;
        }
    }

class FaultToolbar extends React.Component{
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


class AcknowledgeButton extends React.Component{

    constructor(props){
		super(props);
		this.state = {
			faults: {
                severity: "",
				subSysId:"",
				host:"",
				faultId:"",
				alamErrorCode:"",
                statusCode:"",
                status:"",
			},
            updstatus:"",
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

    handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
	}

    handleLoad() {
		let id = this.getSelectedCb();
		if (id == null)
            return;
        client({method: 'GET', path: '/api/faults/' + id}).done(response => {
            this.setState({faults: response.entity});
            this.setState({isLoggedin: true});
            this.setState({showModal:true});
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

    handleAck() {
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
            this.setState({updstatus:"Acknowledge Successful"});
            this.handleNotification('success','Acknowledge Success');
            this.getFaults();
        }, response => {
            if (response.status.code === 401) {
                console.log('UNAUTHORIZED');
            }
            if (response.status.code === 403) {
                console.log('FORBIDDEN');	
            }
                this.setState({updstatus:"Acknowledge Failed"});
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
		this.setState({
		  show: false
		});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}
  
    updateStatus(value){
        this.setState({updstatus:value});
    }
	render() {
        return(
            <React.Fragment>  
                <Button style={tbButton} onClick={this.toggleDrawer}>Acknowledge </Button>
                <Drawer show={this.state.show} onHide={this.close}>
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
		
class ClearButton extends React.Component {

    constructor(props){
		super(props);
		this.state = {
			faults: {
                severity: "",
				subSysId:"",
				host:"",
				faultId:"",
				alamErrorCode:"",
                statusCode:"",
                status:"",
			},
            updstatus:"",
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

    handleLoad() {
		let id = this.getSelectedCb();
		if (id == null)
            return;
        client({method: 'GET', path: '/api/faults/' + id}).done(response => {
            this.setState({faults: response.entity});
            this.setState({isLoggedin: true});
            this.setState({showModal:true});
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
            this.setState({updstatus:"Clear Successful"});
            this.handleNotification('success','Cleared Successfully');
        }, response => {
            if (response.status.code === 401) {
                console.log('UNAUTHORIZED');
            }
            if (response.status.code === 403) {
                console.log('FORBIDDEN');	
            }
                this.setState({updstatus:"Clear Failed"});
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
		this.setState({
		  show: false
		});
	}

	toggleDrawer() {
		this.setState({ show: true });
	}
  
    updateStatus(value){
        this.setState({updstatus:value});
    }
    
	render() {
        return(
            <React.Fragment>
            <Button onClick={this.toggleDrawer} style={tbButton} >Clear </Button>
            <Drawer show={this.state.show} onHide={this.close}>
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
	    
class DeleteButton extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            status:"",
            showModal: false
        };
        
        this.handleDelete = this.handleDelete.bind(this);
        this.getSelectedCb = this.props.getSelected.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.getFaults =  this.props.getFaults.bind(this);
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

    handleNotification(funcName, description) {
		Notification[funcName]({
		  title: funcName,
		  description: description
		});
    }

    onDelete(id) {
        console.log("In onDelete ");
        client({method: 'DELETE', path: '/api/faults/'+ id}).done(response => {
            this.getFaults();
            this.setState({status:"Deleted Successful"});
            this.handleNotification('success','Deleted Successfully');
        }, response => {
            if (response.status.code === 401) {
                console.log('UNAUTHORIZED');
            }
            if (response.status.code === 403) {
                console.log('FORBIDDEN');	
            }
            this.setState({status:"Deleted Failed"});
            this.handleNotification('error','Deleted Failed ');
        });
    }
    
    handleChange(value){
        this.setState({status:value});
    }

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
    