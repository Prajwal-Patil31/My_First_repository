/**@module BreadCrumb */

'use strict';
import React,{ Fragment } from 'react';

import { Breadcrumb} from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';

import { useLocation } from 'react-router-dom';

/**
 * Renders a BreadCrumb component after getting Location. 
 * Gets location using useLocation() hook.
 * 
 * @returns {jsx} Rendered BreadCrumb.
*/
const BreadCrumb = () => {
	let location = useLocation();
	const path = location.pathname;
	const results = path.split('/');
	return(
		<Fragment>
			<Breadcrumb data-testid="location-display">
				<Breadcrumb.Section>Home</Breadcrumb.Section>
				{results.map((result,index) => (
					<Fragment>
						<Breadcrumb.Section>{result}</Breadcrumb.Section>
						<Breadcrumb.Divider />
					</Fragment>
				))}
			</Breadcrumb>
		</Fragment>
	)
}

export default BreadCrumb;