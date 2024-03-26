'use strict';
import React,{Fragment, useState} from 'react';
import {
	Grid,
	Breadcrumb,
	Segment,
  } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

import { noPadding, noBorder, priBgnd, noBoxShadow, noMarginTB} from '../../constants';
import { useLocation } from 'react-router-dom';

const BreadCrumb = () => {
	let location = useLocation();
	const path = location.pathname;
	const result = path.split('/');
	return(
		<Fragment>
			<Breadcrumb>
				<Breadcrumb.Section>Home</Breadcrumb.Section>
				<Breadcrumb.Divider />
				<Breadcrumb.Section>{result[1]}</Breadcrumb.Section>
				<Breadcrumb.Divider />
				<Breadcrumb.Section>{result[2]}</Breadcrumb.Section>
				<Breadcrumb.Divider />
				<Breadcrumb.Section>{result[3]}</Breadcrumb.Section>
			</Breadcrumb>
		</Fragment>
	)
}

export default BreadCrumb;