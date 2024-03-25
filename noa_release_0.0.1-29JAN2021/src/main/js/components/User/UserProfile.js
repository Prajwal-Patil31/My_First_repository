import React, { Fragment, useEffect } from 'react';
import update from 'react-addons-update';

import {
	Grid, Segment, Modal, Button, Header,
	Table, Form, Input, Checkbox, Label, 
	Divider, Message, Container, Icon, Dropdown} from 'semantic-ui-react';

import { menuStyle, noBorder, noPadding, 
		 noBoxShadow, tbButton, formFieldStyle, 
		 formStyle } from '../../constants';

import 'semantic-ui-css/semantic.min.css';


const when = require('when');
const client = require('../../utils/client');
const follow = require('../../utils/follow');
const stompClient = require('../../utils/websocket-listener');
const root = '/api'

class UserProfile extends React.Component {
	constructor(props) {
	super(props);
		this.state = {
			profile: {},
			isLoggedIn: false,
		};
		const updated = false;
	}

	componentDidMount() { 
		client({method: 'GET', path: '/api/profile', 
				headers: { 'Accept': 'application/json' }})
		.done(response => {
			this.setState({profile: response.entity});
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

	render() {
		const isLoggedIn = this.state.isLoggedIn;
		const profile = this.state.profile;

	return (
		<Container>
		  <Grid style={noBoxShadow} centered verticalAlign='middle'>
			<Grid.Row style={noBoxShadow}>
			  <Grid.Column style={noBoxShadow} verticalAlign='middle'>
				<Segment style={noBoxShadow}>
					<Grid columns={3} verticalAlign='middle'>
					<Grid.Column width={4} verticalAlign='middle' textAlign='left'>
					<Header size='medium'>User Profile</Header>
					</Grid.Column>
					<Grid.Column width={9} verticalAlign='middle' textAlign='left'>
					  <Fragment>
					  <UserProfileToolbar getSelected={this.getSelected} />
					  </Fragment>
					</Grid.Column>
					<Grid.Column width={3} textAlign='right' verticalAlign='middle'>
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
					  <Profile profile={profile} />
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

class UserProfileToolbar extends React.Component {
	render() {
		return (
			<Fragment>
			</Fragment>
		)
	}
}

class Profile extends React.Component {
	constructor() {
		super();
		this.state = {
			change: {
				password:""
			},
			confirmPassword:"",
			status:"",
		}
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.ConfirmPasswordChange = this.ConfirmPasswordChange.bind(this);
		this.ChangePassword = this.ChangePassword.bind(this);
	}
	handlePasswordChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let change = {...this.state.change};
		change[name] = value;
		this.setState({change});
	};

	ConfirmPasswordChange = event => {
		this.setState({
			confirmPassword: event.target.value,
		});
	};

	ChangePassword = () => {
		console.log("clicked");
		const {change,confirmPassword} = this.state;
		if (this.state.change.password !==confirmPassword) {
			alert("Passwords don't Match");
		} else {
			alert("Passwords Match");
			let profile = this.props.profile;
			const id = profile.accountId;
			let body = this.state.change;
			var users = body;
			const test = JSON.stringify(users);
			console.log("body:" + test);
			client({
				method: 'PATCH', 
				path: '/api/profile', 
				entity: users, 
				headers: { 'Content-Type': 'application/json' }
			}).done(response => {
				this.setState({status:"Modify Successful"});
			}, response => {
				if (response.status.code === 401) {
					console.log('UNAUTHORIZED');
				}
				if (response.status.code === 403) {
					console.log('FORBIDDEN');	
				}
				this.setState({status:"Failed to Modify"});
			});
			return; 
		}		
	}
	
	updateStatus(value){
		this.setState({status:value});
	}
	render() {
		let profile = this.props.profile;
		let role;
		if (Object.keys(profile).length !== 0 ) {
			role = JSON.parse(JSON.stringify(profile.role));
		}
		const {change} = this.state;

		return (
			<Form style={formStyle}>
				<Form.Field>
					<label left>User ID</label>
					<input disabled style={formFieldStyle} placeholder={profile.userId} />
				</Form.Field>
				<Form.Field widths='equal'>
					<label>First Name</label>
					<input disabled style={formFieldStyle} placeholder={profile.firstName}/>
					<label>Last Name</label>
					<input disabled style={formFieldStyle} placeholder={profile.lastName}/>
				</Form.Field>
				<Form.Group widths='equal'>
					<Form.Input type="password" name='password' label='Enter Password' required={true} 
								value={change.password} onChange={this.handlePasswordChange}
					/>
					<Form.Input type="password" name="confirmPassword" label='Re-Enter Password' required={true} 
								value={this.state.confirmPassword} 
								onChange={this.ConfirmPasswordChange}
					/>
				</Form.Group>
				<Form.Field>
					<label>Role</label>
					<input disabled style={formFieldStyle} placeholder={role ? role.roleName : ''} />
				</Form.Field>
				<Form.Field>
					<label>Policy</label>
					<input disabled style={formFieldStyle} placeholder={profile.policy ? profile.policy : ''} />
				</Form.Field>
				<Form.Field>
					<label>Last Login Time</label>
					<input disabled style={formFieldStyle} placeholder={profile.lastLoginTime} />
				</Form.Field>
				<Button style={tbButton} onClick={this.ChangePassword.bind(this)}>Apply</Button>
			</Form>
		)
	}
}

export default UserProfile;