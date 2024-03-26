import React from 'react';

import Breadcrumb from '../Widgets/Breadcrumb';

import { 
	Grid, 
	Segment, 
	Container, 
	Header, 
	Divider,
} from 'semantic-ui-react';
	
import 'semantic-ui-css/semantic.min.css';

import {  noBoxShadow } from '../../constants';

const client = require('../../utils/client');

const URIPATH = "http://localhost:8080/api/restconf/data/network-topology:network-topology/topology=";
const TOPOLOGY = "topology-netconf";
const NODE = "odl-ofconfig-netconf";



class FlowTableDetails extends React.Component {
    render() {
        return(
            <Container>
			<Grid style={noBoxShadow} centered verticalAlign='middle'>
				<Grid.Row style={noBoxShadow}>
					<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Segment style={noBoxShadow}>
							<Grid columns={3} verticalAlign='middle'>
								<Grid.Column width={7} verticalAlign='middle' textAlign='left'>
									<Breadcrumb/>
									<Header size='medium'>Flow table</Header>
								</Grid.Column>
								<Grid.Column width={2} verticalAlign='middle' textAlign='left'></Grid.Column>
								<Grid.Column width={7} textAlign='right' verticalAlign='middle'>
                                </Grid.Column>
							</Grid>
						</Segment>
					</Grid.Column>
				</Grid.Row>
				<Divider />
				<Grid.Row style={noBoxShadow}>
					<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Segment style={noBoxShadow}>
							<Grid style={noBoxShadow} >
								<Grid.Column style={noBoxShadow} >
                                	<FlowTableList/>
                                </Grid.Column>
							</Grid>
						</Segment>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
        )
    }
}

class FlowTableList extends React.Component {
	render() {
	  return <FlowTableData/>;
	}
}

const FlowTableData = () => {
	return (
		<div>
			<Grid columns='equal'>
				<Grid.Row columns='3'>
					<Grid.Column width={5}></Grid.Column>
					<Grid.Column width={6}>
						<Grid columns='equal'>
							<Grid.Row>
								<Grid.Column textAlign='left'>Table ID: </Grid.Column>
								<Grid.Column textAlign='left'>1</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column textAlign='left'>Name: </Grid.Column>
								<Grid.Column textAlign='left'>Flow Table1</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column textAlign='left'>Max Entries: </Grid.Column>
								<Grid.Column textAlign='left'>3</Grid.Column>
							</Grid.Row>
							<Grid.Row>
								<Grid.Column textAlign='left'>Resource ID: </Grid.Column>
								<Grid.Column textAlign='left'>12252</Grid.Column>
							</Grid.Row>
						</Grid>
					</Grid.Column>
					<Grid.Column width={5}></Grid.Column>
				</Grid.Row>
			</Grid>
		</div>
	)   
};

export default FlowTableDetails;