/**@module AuthContext */

import React from 'react';
const client = require('../../utils/client');

/**
 *Initializing a new React Context. 
*/
const AuthContext = React.createContext();
export const USER_SESSION_KEY = 'USER_SESSION_KEY';

/**
 * Component to implement Login and Logout functionality.
 * 
 * @class 
 * @augments React.Component
*/
class AuthProvider extends React.Component {
	state = { 
		isAuth: false,
		userDetails: {}
	}

	constructor() {
		super()
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	componentDidMount() {
		let session = JSON.parse(sessionStorage.getItem(USER_SESSION_KEY));
		if (session !== null) {
		this.setState({userDetails: session});
		this.setState({isAuth: true});
		}
	}

	/**
	 * Makes a REST request to authenticate the User and Creates a new Session.
	 * @param {*} user Details of the User.
	 * @param {*} redirect Redirect to the page.
	 */
	login(user, redirect) {
		client({
				method: 'GET', 
				path: '/login', 
			headers: { 
			authorization: 'Basic ' + window.btoa(user.username + ":" + user.password),
			contenttype: 'application/json',
			accept: 'application/json' 
			}
			}).done(response => {
			this.setState({ isAuth: true });
			this.setState({userDetails: response.entity});
				sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(this.state.userDetails));
			}, response => {
				if (response.status.code === 401) {
					console.log('UNAUTHORIZED');
				}
				if (response.status.code === 403) {
					console.log('FORBIDDEN');	
				}
		});
		redirect();
	}

	/**
	 * Makes a REST request to logout the logged in User and Removes the 
	 * respective Session.
	 * @param {*} redirect Redirect to Home Page
	 *  
	 */
	logout(redirect) {
		client({
				method: 'GET', 
				path: '/logout'
			}).done(response => {
			this.setState({ isAuth: false });
			sessionStorage.removeItem(USER_SESSION_KEY);
			sessionStorage.clear();
			}, response => {
				if (response.status.code === 401) {
					console.log('UNAUTHORIZED');
				}
				if (response.status.code === 403) {
					console.log('FORBIDDEN');	
				}
		});
		redirect();
	}

	render() {
		const userDetails = this.state.userDetails
    return (
      	<AuthContext.Provider
			value={{
			isAuth: this.state.isAuth,
			firstName: userDetails.FirstName,
			lastName: userDetails.LastName,
			login: this.login,
			logout: this.logout
			}}
      	>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };