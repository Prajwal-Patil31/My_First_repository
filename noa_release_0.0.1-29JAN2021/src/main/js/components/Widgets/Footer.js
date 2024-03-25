'use strict';
import React, { Fragment } from 'react';
import {
	Grid,
	Header,
	Icon,
	Image,
	Segment,
	Search,
	Button,
  } from 'semantic-ui-react'
const when = require('when');

const footerStyle = {
  backgroundColor: "purple",
  fontSize: "20px",
  color: "white",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  padding: "10px",
  position: "fixed",
  left: "50%",
  transform: "translate(-50%, 0)",
  bottom: "0",
  height: "60px",
  width: "62%"
};

const phantomStyle = {
  display: "block",
  padding: "20px",
  height: "60px",
  width: "100%"
};

import { menuStyle, noBorder, noPadding, noBoxShadow, priBgnd } from '../../constants'
import 'semantic-ui-css/semantic.min.css';

class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div style={noPadding,noBorder,noBoxShadow}>
				<Grid style={noPadding, noBorder, noBoxShadow} textAlign='center'>
					<Segment.Group style={noPadding, noBorder, noBoxShadow} horizontal>
						<Segment style={noBorder, noBoxShadow, priBgnd}>
						<Header as='h4' verticalAlign='middle' style={Object.assign({fontFamily: 'CiscoSans'}, priBgnd, noPadding)}>
							Copyright (C) 2021 NOA Platform - United Telecoms. All Rights Reserved.
						</Header>
						</Segment>
					</Segment.Group>
				</Grid>
			</div>
		)
	}
}

export default Footer;