'use strict';
import React, { Fragment, MouseEvent, useState, useEffect } from 'react';
import {
	BrowserRouter,
	Switch,
	Route,
	Link,
	Redirect
  } from "react-router-dom";

import AppLayout from './AppLayout';
import LoginLayout from './LoginLayout';
import { AuthProvider, AuthConsumer } from './AuthContext';

class App extends React.Component {
	
	constructor(props) {
		super(props);
	}

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