import React, { Fragment } from 'react';

import { 
	Grid, 
	Container,
	Header,
	Segment,
	Divider,
} from 'semantic-ui-react';

import BreadCrumb from'../Widgets/BreadCrumb';
import { noBoxShadow } from '../../constants';

import 'semantic-ui-css/semantic.min.css';
import Ports from './Ports';
import LogicalSwitchCapabilities from './LogicalSwitchCapabilities';
import FlowTables from './FlowTables';

const client = require('../../utils/client');

const URIPATH = "http://localhost:8080/api/restconf/data/network-topology:network-topology/topology=";
const TOPOLOGY = "topology-netconf";
const NODE = "odl-ofconfig-netconf";
const YANG = "/yang-ext:mount/of-config:capable-switch/logical-switches";

class LogicalSwitchDetails extends React.Component {
    constructor(props) {
		super(props);
        this.state = {
            switches : []
        }
        this.getSwitches = this.getSwitches.bind(this);
    }

    getSwitches() {
		client({
			method: 'GET', 
			path: URIPATH + TOPOLOGY + '/node=' + NODE + YANG ,
			headers: { 
				contenttype: 'application/json',
				accept: 'application/json' 
			}})
			.done(response => {
			this.setState({switches: response.entity["of-config:logical-switches"]["switch"]});
			}, response => {
			if (response.status.code === 401) {
			console.log('UNAUTHORIZED');
			}
			if (response.status.code === 403) {
			console.log('FORBIDDEN');
			}
		});
    }
    
    componentDidMount() {
        this.getSwitches();
    }
    render() {
        const switches = this.state.switches
        return(
            <Container>
			<Grid style={noBoxShadow} centered verticalAlign='middle'>
				<Grid.Row style={noBoxShadow}>
					<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Segment style={noBoxShadow}>
							<Grid columns={3} verticalAlign='middle'>
								<Grid.Column width={7} verticalAlign='middle' textAlign='left'>
									<BreadCrumb/>
									<Header size='medium'>Logical Switch</Header>
								</Grid.Column>
								<Grid.Column width={2} verticalAlign='middle' textAlign='left'></Grid.Column>
								<Grid.Column width={7} textAlign='right' verticalAlign='middle'></Grid.Column>
							</Grid>
						</Segment>
					</Grid.Column>
				</Grid.Row>
				<Divider />
				<Grid.Row style={noBoxShadow}>
					<Grid.Column style={noBoxShadow} verticalAlign='middle'>
						<Segment style={noBoxShadow}>
							<Grid style={noBoxShadow} columns={1}>
								<Grid.Column style={noBoxShadow} width={16}>
									<DetailsHeader switches={switches} />
                                    <DetailView />
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

class DetailsHeader extends React.Component {
    render() {
        const switches = this.props.switches;
        return(
            <Fragment>
            <Grid>
            <Grid.Row>
                <Grid columns='3'>
                    <Grid.Row>
                        {switches.map(eswitch => (
                            <Fragment>
                                <Grid.Column width={3}>
                                    <Header>Id : {eswitch.id}</Header>
                                </Grid.Column>
                                <Grid.Column width={5}>
                                    <Header>Datapath-Id : {eswitch["datapath-id"]}</Header> 
                                </Grid.Column>
                                <Grid.Column width={7}>
                                    <Header>Lost Connection Behavior : {eswitch["lost-connection-behavior"]}</Header>
                                </Grid.Column>
                            </Fragment>
                        ))}
                    </Grid.Row>
                </Grid>
            </Grid.Row>
            </Grid>
            </Fragment>
        )
    }
}

class DetailView extends React.Component {
    state = { activeIndex: 0 }

    handleClick = (e, titleProps) => {
      const { index } = titleProps
      const { activeIndex } = this.state
      const newIndex = activeIndex === index ? -1 : index
  
      this.setState({ activeIndex: newIndex })
    }

    render() {
        const { activeIndex } = this.state
       
return(
    <Fragment>
            <Grid>
                <Header>Capabilities</Header>
                <LogicalSwitchCapabilities/>
            </Grid>
            <Grid>
                <div>
                    <Header>Controllers</Header>
                    <li>Controllers</li>
                </div> 
            </Grid>
            <Grid columns={3}>
                <Header>Resources</Header>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Header>Ports</Header>
                        <Ports/>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Header>Queues</Header>
                        <li>queue</li>
                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Header>Flow Tables</Header>
                        <FlowTables />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
    </Fragment>
    )
}
}


export default LogicalSwitchDetails;