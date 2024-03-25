'use strict';
import React, { Fragment, MouseEvent, useState, useEffect } from 'react';
import UserSecurity from '../Security/UserSecurity';
import PasswordPolicy from '../Security/PasswordPolicy';
import Role from '../Security/Role';
import AuditInfo from '../Security/AuditInfo';
import ProtectedRoute from './ProtectedRoute';

import {
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import UserGroups from '../Security/UserGroups';
import Resource from '../Security/Resource';
import ResourceGroups from '../Security/ResourceGroups';

const styles = {
	marginBottom: 50
};

class SecurityLayout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			active: 'users'
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

	render() {
		let { path, url } = this.props.match;
		const { active } = this.state;
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