/**@module UserLayout */

'use strict';
import React from 'react';
import UserProfile from '../User/UserProfile';
import {
  Switch,
  withRouter
} from "react-router-dom";
import PropTypes from "prop-types";
import ProtectedRoute from './ProtectedRoute';

/**
 * Component to Redirect the User to pages related to user
 * in a protected way.
 * 
 * @class
 * @augments React.Component
*/
class UserLayout extends React.Component {

	constructor(props) {
		super(props);
	}
	
	static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
	};
	
	/**
	 * Renders a view with pages based on URI path.
	 */
	render() {
		let { path,} = this.props.match;
		return (
			<div>
				<Switch>
					<ProtectedRoute exact path={`${path}/profile`} component={UserProfile} />
				</Switch>
				{this.props.children}
			</div>
		)
	}
}

export default withRouter(UserLayout);