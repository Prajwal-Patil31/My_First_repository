/**@module ElementsLayout */

'use strict';
import React from 'react';

import NetworkTopology from '../Elements/NetworkTopology';
import ElementInventory from '../Elements/ElementInventory';
import CapableSwitchDetails from '../Elements/CapableSwitchDetails';
import ProtectedRoute from './ProtectedRoute';
import LogicalSwitchDetails from '../Elements/LogicalSwitchDetails';
import PortDetails from '../Elements/PortDetails';
import FlowTableDetails from '../Elements/FlowTableDetails';

import {
  Switch,
  withRouter
} from "react-router-dom";

import PropTypes from "prop-types";


const styles = {
	marginBottom: 50
};

/**
 * Component to Redirect the User to pages related to Elements
 * in a protected way.
 * 
 * @class
 * @augments React.Component
*/
class ElementsLayout extends React.Component {

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
		let { path, url } = this.props.match;
		const { active } = this.state;
		return (
			<div>
				<Switch>
					<ProtectedRoute exact path={`${path}/topology`} component={NetworkTopology} />
					<ProtectedRoute exact path={`${path}/elements`} component={ElementInventory} />
					<ProtectedRoute exact path={`${path}/elements/odl-ofconfig-netconf`} component={CapableSwitchDetails} />
					<ProtectedRoute exact path={`${path}/elements/logical-switch/ofc-bridge`} component={LogicalSwitchDetails} />
					<ProtectedRoute exact path={`${path}/elements/capableswitch/port/ofc-bridge`} component={PortDetails} />
					<ProtectedRoute exact path={`${path}/elements/capableswitch/flowtable`} component={FlowTableDetails} />
				</Switch>
				{this.props.children}
			</div>
		)
	}
}

export default withRouter(ElementsLayout);