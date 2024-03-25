/**@module FaultsLayout */

'use strict';
import React from 'react';
import Fault from '../Faults/Fault';
import FaultConfig from '../Faults/FaultConfig';
import FaultEscalatePolicy from '../Faults/FaultEscalatePolicy';
import FaultAcknowledgePolicy from '../Faults/FaultAcknowledgePolicy';

import ProtectedRoute from './ProtectedRoute';

import {
  Switch,
  withRouter
} from "react-router-dom";

import PropTypes from "prop-types";

const styles = {
	marginBottom: 50
};

/**
 * Component to Redirect the User to pages related to Faults
 * in a protected way.
 * 
 * @class
 * @augments React.Component
*/
class FaultsLayout extends React.Component {

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
	
	/**
	 * Renders a view with pages based on URI path.
	*/
	render() {
		let { path,} = this.props.match;
		return (
			<div>
				<Switch>
                    <ProtectedRoute exact path={`${path}/faults`} component={Fault} />
					<ProtectedRoute exact path={`${path}/policies/escalate`} component={FaultEscalatePolicy} />
					<ProtectedRoute exact path={`${path}/policies/acknowledge`} component={FaultAcknowledgePolicy} />
					<ProtectedRoute exact path={`${path}/config`} component={FaultConfig} />
				</Switch>
				{this.props.children}
			</div>
		)
	}
}

export default withRouter(FaultsLayout);