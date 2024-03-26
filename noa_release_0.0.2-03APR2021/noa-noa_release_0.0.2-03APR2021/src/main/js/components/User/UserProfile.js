import React, { Fragment, useEffect } from 'react';
import update from 'react-addons-update';

import {
	Grid, 
	Segment,
	Button, 
	Header, 
	Form, 
	Divider, 
	Container
} from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import {  noBoxShadow, tbButton, formFieldStyle, formStyle } from '../../constants';

const client = require('../../utils/client');

/**
 * Component for User Profile Management; Implements functionality for 
 * fetching User Profile Records and performing operations on them.
 * 
 * @class
 * @augments React.Component
*/
class UserProfile extends React.Component {

	/**
     * User Profile constructor. Initializes state to hold User Records.
     * 
     * @constructor
     * @param {*} props 
    */
	constructor(props) {
	super(props);
		this.state = {
			profile: {},
		};
		const updated = false;
	}

    /**
     * Makes a REST request to fetch User Records and updates
     * the component's State.
    */
	getUserProfile() {
		client({method: 'GET', path: '/api/profile', 
				headers: { 'Accept': 'application/json' }})
		.done(response => {
			this.setState({userProfile: response.entity});
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
		this.getUserProfile();
	}

   	/**
     * Renders User Profile component view invoking child components {@link UserProfileToolbar} 
     * and {@link Profile} with User Records fetched on component mount.
    */
	render() {
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
					  <Profile profile={profile}/>
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
 * Component for rendering the User Profile Management toolbar. Child of {@link UserProfile}.
 * 
 * @class
 * @augments React.Component
*/
class UserProfileToolbar extends React.Component {
	render() {
		return (
			<Fragment>
			</Fragment>
		)
	}
}

/** 
 * Component for rendering the User Profile Management Profile. Child of {@link UserProfile}.
 * 
 * @class
 * @augments React.Component
*/
class Profile extends React.Component {

	/**
     * Initializes state for User Profile
     * 
     * @constructor
     * @param {*} props 
    */
	constructor(props) {
		super(props);
		this.state = {
			change: 
			{
				confirmPassword :"",
			},
			userProfile : {}
		}
		this.baseState = this.state.userProfile;
		this.handleChange = this.handleChange.bind(this);
		this.ConfirmPasswordChange = this.ConfirmPasswordChange.bind(this);
		this.ChangePassword = this.ChangePassword.bind(this);
	}

	handleChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let userProfile = {...this.state.userProfile};
		userProfile[name] = value;
		this.setState({userProfile});
	};

	ConfirmPasswordChange = (e) => {
		const target = e.target;
		const value = target.value;
		const name = target.name;
		let change = {...this.state.change};
		change[name] = value;
		this.setState({change});
	};

	getUserProfile() {
		client({method: 'GET', path: '/api/profile', 
				headers: { 'Accept': 'application/json' }})
		.done(response => {
			this.setState({userProfile: response.entity});
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

	handleReset() {
		this.setState({userProfile: this.baseState});
	}

	componentDidMount() { 
		this.handleReset();
		this.getUserProfile();
	}

 	/**
     * Performs a REST request to Change Password of the User.
	 * Also fetches the updated Profile of User.
	 * 
    */
	ChangePassword = () => {
		if (this.state.change.confirmPassword !== this.state.userProfile.password) {
			alert("Passwords don't Match");
		} else {
			alert("Passwords Match");
			let body = this.state.userProfile;
			var users = body;
			const test = JSON.stringify(users);
			client({
				method: 'PATCH', 
				path: '/api/profile', 
				entity: users, 
				headers: { 'Content-Type': 'application/json' }
			}).done(response => {
				this.setState({status:"Modify Successful"});
				this.getUserProfile();
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

	/**
     * Renders a page to View User Profile of Logged In User.
	 * 
    */
	render() {
		let role;
		let profile = this.props.profile;
 		if (Object.keys(profile).length !== 0 ) {
			role = JSON.parse(JSON.stringify(profile.role));
		}
		let groups = [];
		if (Object.keys(profile).length !== 0 ) {
			groups = JSON.parse(JSON.stringify(profile.groups)); 
		}  
		const {userProfile} = this.state;
		return (
			<Form style={formStyle}>
				<Form.Field>
					<label left>User ID</label>
					<Form.Input style={formFieldStyle} 
								value={userProfile.userName} 
								name="userName" 
								onChange={this.handleChange}
					/>
				</Form.Field>
				<Form.Field widths='equal'>
					<label>First Name</label>
					<Form.Input style={formFieldStyle} 
								value={userProfile.firstName} 
								name="firstName" 
								onChange={this.handleChange}
					/>
					<label>Last Name</label>
					<Form.Input style={formFieldStyle} 
								value={userProfile.lastName} 
								name="lastName" 
								onChange={this.handleChange}
					/>
				</Form.Field>
				<Form.Group widths='equal'>
					<Form.Input type="password" 
								name='password' 
								label='Enter Password' 
								required={true} 
								value={userProfile.password} 
								onChange={this.handleChange}
					/>
					<Form.Input type="password" name="confirmPassword" 
								label='Re-Enter Password' required={true} 
								value={this.state.change.confirmPassword} 
								onChange={this.ConfirmPasswordChange}
					/>
				</Form.Group>
				<Form.Field>
					<label>Role</label>
					<input disabled style={formFieldStyle} 
						   placeholder={role ? role.roleName : ''} />
				</Form.Field>
				<Form.Field>
					<label>UserGroup</label>
						{groups.map((group,index) => (
							<ul><li>{group.groupName}</li></ul>
						))}
				</Form.Field>
				<Form.Field>
					<label>Policy</label>
					<input disabled style={formFieldStyle} 
						   placeholder={profile.policy ? profile.policy : ''} />
				</Form.Field> 
				<Form.Field>
					<label>Last Login Time</label>
					<input disabled style={formFieldStyle} 
						   placeholder={profile.lastLoginTime} />
				</Form.Field>
				<Button style={tbButton} onClick={this.ChangePassword.bind(this)}>Apply</Button>
			</Form>
		)
	}
}

export default UserProfile;