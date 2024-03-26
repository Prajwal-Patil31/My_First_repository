/**@module NHeader */

'use strict';
import React from 'react';
import { Link } from "react-router-dom";
import { AuthConsumer } from '../App/AuthContext';

import {
	Grid,
	Header,
	Image,
	Segment,
	Menu,
	Dropdown,
} from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';
  
import { noPadding, noBoxShadow, noMarginTB } from '../../constants'

/**
 * Component to Render a Header at the Top of the page.
 * 
 * @class
 * @augments React.Component
*/
class NHeader extends React.Component {
	constructor(props) {
		super(props);
	}

	/**
     * Renders Header view .
	 * 
    */
	render() {
		return (
			<div>
				<Segment style={noBoxShadow}>
					<Grid style={Object.assign({}, noBoxShadow)} columns={2} 
						stackable verticalAlign='middle'>
						<Grid.Column style={noPadding} 
									 width={8}  
									 textAlign='left' 
									 verticalAlign='middle'>
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
										<Header as='h5' 
												style={{fontFamily: 'CiscoSans'}}>Welcome, {firstName} {lastName}</Header>
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