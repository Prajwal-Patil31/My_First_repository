/**@module SecurityLayout */

'use strict';
import React from 'react';
import UserSecurity from '../Security/UserSecurity';
import PasswordPolicy from '../Security/PasswordPolicy';
import Role from '../Security/Role';
import AuditInfo from '../Security/AuditInfo';
import ProtectedRoute from './ProtectedRoute';
import UserGroups from '../Security/UserGroups';
import Resource from '../Security/Resource';
import ResourceGroups from '../Security/ResourceGroups';

import {
  Switch,
  withRouter
} from "react-router-dom";

import PropTypes from "prop-types";

const styles = {
	marginBottom: 50
};

/**
 * Component to Redirect the User to pages related to Security
 * in a protected way.
 * 
 * @class
 * @augments React.Component
*/
class SecurityLayout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			active : 'users'
		};
		this.handleSelect = this.handleSelect.bind(this);
	}
	static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

	handleSelect(activeKey) {
		this.setState({ active: activeKey });
	}
	/**
	 * Renders a view with pages based on URI path.
	*/
	render() {
		let { path,} = this.props.match;
		
		return (
			<div>
				<Switch>
					<ProtectedRoute exact path={`${path}/users`} component={UserSecurity} />
					<ProtectedRoute exact path={`${path}/policies/password`} component={PasswordPolicy} />
					<ProtectedRoute exact path={`${path}/roles`} component={Role} />
					<ProtectedRoute exact path={`${path}/audit`} component={AuditInfo} />
					<ProtectedRoute exact path={`${path}/user/groups`} component={UserGroups} />
					<ProtectedRoute exact path={`${path}/resources`} component={Resource} />
					<ProtectedRoute exact path={`${path}/resourcegroups`} component={ResourceGroups} />
				</Switch>
				{this.props.children}
			</div>
		)
	}
}

export default withRouter(SecurityLayout);