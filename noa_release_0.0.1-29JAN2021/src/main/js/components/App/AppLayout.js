'use strict';
import React, { createRef, Fragment, MouseEvent, useState, useEffect } from 'react';

import NHeader from '../Widgets/NHeader';
import Footer from '../Widgets/Footer';
import NavFrame from '../Widgets/NavFrame';
import SecurityLayout from './SecurityLayout';
import UserLayout from './UserLayout';
import Dashboard from '../Pages/Dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Logout from './Logout';

import {
  Route,
  Switch,
  Redirect,
  withRouter
} from "react-router-dom";

import { Container } from 'rsuite';

import PropTypes from "prop-types";

import {
	Grid,
	Segment,
	Pagination,
	Sticky,
	Responsive,
  } from 'semantic-ui-react';

import { noBorder, noPadding, noBoxShadow, 
		 fullHeight, noMargin, priFgnd, 
		 noMarginTB } from '../../constants';

import 'semantic-ui-css/semantic.min.css';
import { resetDefaultClient } from 'rest';
import 'rsuite/dist/styles/rsuite-default.css';
import FaultsLayout from './FaultsLayout';

class AppLayout extends React.Component {
	contextRef = createRef();
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
		<div ref={this.contextRef} >
			<Grid columns='equal' >
				<Grid.Column>
				<div>
					<NHeader className='root-header'/>
					<NavFrame minHeight='100%'>
					<Segment style={{marginTop: 0, marginBottom: 0}}>
					<Grid  columns='equal' textAlign='left' centered 
						  style={Object.assign({}, noPadding, noBoxShadow, {background: '#fff'})}>
						<Grid.Column style={noPadding}>
							<Segment style={Object.assign({}, noBorder, noMarginTB, fullHeight)}>
								<Grid style={Object.assign({}, noBoxShadow, noPadding, noMarginTB)} 
									columns='equal' minHeight='100%'>
									<Grid.Column style={noPadding} width={0}>
									</Grid.Column>
									<Grid.Column style={noPadding} width={16} className='content-area'>
									<Segment style={noBoxShadow} textAlign='center' className='content-segment'>
										<Switch>
											<Route exact path="/" component={Dashboard} />
											<ProtectedRoute path="/security" component={SecurityLayout}/>
											<ProtectedRoute path="/faults" component={FaultsLayout}/>
											<ProtectedRoute path="/user" component={UserLayout}/>
											<Route path="/login" component={Login}/>
											<Route path="/logout" component={Logout}/>
											<Redirect to="/" />
										</Switch>
										{this.props.children}
									</Segment>
									</Grid.Column>
									<Grid.Column style={noPadding} width={0}>
									</Grid.Column>
								</Grid>
							</Segment>
						</Grid.Column>
					</Grid>
					</Segment>
					</NavFrame>
				</div>
				</Grid.Column>
			</Grid>
			<Footer/>
		</div>
		)
	}
}

export default withRouter(AppLayout);