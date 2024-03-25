'use strict';
import React, { Fragment, MouseEvent, useState, useEffect } from 'react';
import UserProfile from '../User/UserProfile';
import {
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import PropTypes from "prop-types";
import ProtectedRoute from './ProtectedRoute';


class UserLayout extends React.Component {

	constructor(props) {
		super(props);
	}
	
	static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
	};
	
	render() {
		let { path, url } = this.props.match;
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