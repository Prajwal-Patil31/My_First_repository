'use strict';
import React, { Fragment , useState } from 'react';
import { Link } from "react-router-dom";
import { AuthConsumer } from '../App/AuthContext';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
// import "~rsuite-notification/lib/less/index";
// import { Alert, Notify} from 'rsuite-notification';
import {
	Grid,
	Header,
	Icon,
	Image,
	Segment,
	Search,
	Button,
	Menu,
	Dropdown,
	Container,
  } from 'semantic-ui-react'
import {Divider} from 'rsuite';  
const when = require('when');
import { menuStyle, noBorder, noPadding, noBoxShadow, priFgnd, noMarginTB } from '../../constants'
import 'semantic-ui-css/semantic.min.css';

class NHeader extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Segment style={noBoxShadow}>
					<Grid style={Object.assign({}, noBoxShadow)} columns={2} 
						stackable verticalAlign='middle'>
						<Grid.Column style={noPadding} width={8}  textAlign='left' verticalAlign='middle'>
						<Segment.Group style={Object.assign({}, noBoxShadow, noMarginTB)} 
							horizontal vertical='true'>
							<Segment >
								<Image 
								style={{display: "inline-block", paddingLeft: "6px"}} 
								size="small" 
								src="/images/unoa-l.png"/>
							</Segment>
							<Segment style={{display: 'flex', alignItems: 'center', borderLeft: '0px'}}
								vertical='true'>
								<Header></Header>
							</Segment>
						</Segment.Group>
						</Grid.Column>
						<Grid.Column style={noPadding} width={8} floated right textAlign='right'
							verticalAlign='middle' >
						<Segment style={Object.assign({}, noBoxShadow, noMarginTB)}>
							<Grid  columns={2} textAlign='right'>
							<Grid.Column  width={10} textAlign='right' verticalAlign='middle'>
								<AuthConsumer>
									{({firstName, lastName}) => (
										<Header as='h5' style={{fontFamily: 'CiscoSans'}}>Welcome, {firstName} {lastName}</Header>
									)
									}
								</AuthConsumer>
							</Grid.Column>
							<Grid.Column width={6} textAlign='right' verticalAlign='middle'>
									<Menu attached='top' textAlign='right' style={Object.assign({}, noBoxShadow)}>
										<Dropdown textAlign='right' item icon='user outline' simple>
											<Dropdown.Menu>
												<Dropdown.Item><nav>
													<Link to={`/user/profile`}>User Profile</Link></nav>
												</Dropdown.Item>
												<Dropdown.Divider />
												<AuthConsumer>
												{({ isAuth, login, logout }) => (
													<div>
													{isAuth ?
														(<Dropdown.Item><Link to="/logout">Logout</Link></Dropdown.Item>) :
														(<Dropdown.Item><Link to="/login">Login</Link></Dropdown.Item>)
													}
												  	</div>
												)}
												</AuthConsumer>
											</Dropdown.Menu>
										</Dropdown>
										<Dropdown textAlign='right' item icon='bell outline' simple />
										<Dropdown textAlign='right' item icon='search' simple />
										<Dropdown textAlign='right' item icon='setting' simple />
									</Menu>									
							</Grid.Column>
							</Grid>
						</Segment>
						</Grid.Column>
					</Grid>
				</Segment>
			</div>
		)
	}
}
export default NHeader;











// class Example extends React.Component {
// 	createNotification = (type) => {
// 	  return () => {
// 		switch (type) {
// 		  case 'info':
// 			NotificationManager.info('Info message');
// 			break;
// 		  case 'success':
// 			NotificationManager.success('Success message', 'Title here');
// 			break;
// 		  case 'warning':
// 			NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
// 			break;
// 		  case 'error':
// 			NotificationManager.error('Error message', 'Click me!', 5000, () => {
// 			  alert('callback');
// 			});
// 			break;
// 		}
// 	  };
// 	};
   
// 	render() {
// 	  return (
// 		<div>
// 		  <button className='btn btn-info'
// 			onClick={this.createNotification('info')}>Info
// 		  </button>
// 		  <hr/>
// 		  <button className='btn btn-success'
// 			onClick={this.createNotification('success')}>Success
// 		  </button>
// 		  <hr/>
// 		  <button className='btn btn-warning'
// 			onClick={this.createNotification('warning')}>Warning
// 		  </button>
// 		  <hr/>
// 		  <button className='btn btn-danger'
// 			onClick={this.createNotification('error')}>Error
// 		  </button>
   
// 		  <NotificationContainer/>
// 		</div>
// 	  );
// 	}
//   }

