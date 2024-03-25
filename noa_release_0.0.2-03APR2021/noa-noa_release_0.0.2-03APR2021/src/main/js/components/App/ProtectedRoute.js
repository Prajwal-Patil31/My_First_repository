/**@module ProtectedRoute */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthConsumer } from './AuthContext';

/**
 * Routes to the Child Components based on URI.
 * also Initiates Authentication to the Routes using Context API.
 * 
*/
const ProtectedRoute = ({ component: Component, ...rest }) => (
	<AuthConsumer>
		{({ isAuth }) => (
		<Route
			render={props =>
			isAuth ? <Component {...props} /> : <Redirect to="/" />
			}
			{...rest}
		/>
		)}
	</AuthConsumer>
)

export default ProtectedRoute;