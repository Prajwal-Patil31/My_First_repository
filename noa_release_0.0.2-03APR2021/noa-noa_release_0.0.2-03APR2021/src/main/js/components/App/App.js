/**@module App */

'use strict';
import React from 'react';
import {BrowserRouter} from "react-router-dom";

import AppLayout from './AppLayout';
import LoginLayout from './LoginLayout';

import { AuthProvider, AuthConsumer } from './AuthContext';

/**
 * Component for the Application. implements App Layout{@link AppLayout}
 * or Login Layout{@link LoginLayout} 
 * 
 * @class
 * @augments React.Component
*/
class App extends React.Component {
	
	constructor(props) {
		super(props);
	}

	/**
	 * Renders a view based on User Authentication State.
	 * invokes Login Layout{@link LoginLayout} for login.
	*/
	render() {
		return (
			<div>
				<BrowserRouter>
				<AuthProvider>
					<AuthConsumer>
						{({ isAuth, login, logout }) => (
							<div>
							{isAuth ?
								<AppLayout/> : <LoginLayout/>
							}
							</div>
						)}
					</AuthConsumer>
				</AuthProvider>
				</BrowserRouter>
			</div>
		)
	}
}

export default App;