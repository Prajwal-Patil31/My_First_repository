// @flow

import React, { Fragment, useState, useEffect } from 'react';

import BreadCrumb from '../Widgets/BreadCrumb';

import NextContainer, { NxTopologyConfig, TopologyData, EventHandlers } from "../Modules/Next";

const client = require('../../utils/client');

import {
	Grid, 
	Button,
	Header,
	Divider
} from 'semantic-ui-react';

import "../../lib/next/css/next.min.css";
import 'semantic-ui-css/semantic.min.css';
import { noBoxShadow, } from '../../constants';

const sampleConfig: NxTopologyConfig = {
  'adaptive': true,
  'showIcon': true,
  'nodeConfig': {
      'label': 'model.name',
      'iconType': 'router',
      'color': '#0how00'
  },
  'linkConfig': {
      'linkType': 'curve'
  },
  'identityKey': 'name',
  'dataProcessor': 'force',
  'enableSmartLabel': true,
  'enableGradualScaling': true,
  'supportMultipleLink': true
};

const sampleTopology: TopologyData = {"nodes": [
  {"id": 0, "function": "core", "name": "sfc", "latitude": 63.391326, "ipaddress": "29.29.29.29", "isisarea": "72", "site": "sfc", 
  "longitude": -149.8286774, "y": 550.31264292335, "protected": "F", "active": "T", "x": -1021.91217850693, "type": "physical"},
  {"id": 1, "function": "core", "name": "sea", "latitude": 47.6062, "ipaddress": "28.28.28.28", "isisarea": "72", "site": "sea", 
  "longitude": -122.332, "y": -9.8292223022888, "protected": "F", "active": "T", "x": -552.893870303646, "type": "physical"},
  {"id": 2, "function": "core", "name": "hst", "latitude": 29.7633, "ipaddress": "20.20.20.20", "isisarea": "72", "site": "hst", 
  "longitude": -95.3633, "y": 1185.49743746152, "protected": "F", "active": "T", "x": 93.011342707737, "type": "physical"},
  {"id": 3, "function": "core", "name": "chi", "latitude": 41.85, "ipaddress": "19.19.19.19", "isisarea": "72", "site": "chi", 
  "longitude": -87.65, "y": -1.78890844737532, "protected": "F", "active": "T", "x": 347.621281446664, "type": "physical"},
  {"id": 4, "function": "core", "name": "atl", "latitude": 33.7861178428426, "ipaddress": "17.17.17.17", "isisarea": "72", "site": "atl", 
  "longitude": -84.1959236252621, "y": 1188.17754207982, "protected": "F", "active": "T", "x": 476.26630312528, "type": "physical"},
  {"id": 5, "function": "core", "name": "min", "latitude": 44.98, "ipaddress": "24.24.24.24", "isisarea": "72", "site": "min", 
  "longitude": -93.2638, "y": -4.46901306567981, "protected": "F", "active": "T", "x": -67.7949343905326, "type": "physical"},
  {"id": 6, "function": "core", "name": "lax", "latitude": 34.0522, "ipaddress": "22.22.22.22", "isisarea": "72", "site": "lax", 
  "longitude": -118.244, "y": 941.607917195807, "protected": "F", "active": "T", "x": -702.979728928698, "type": "physical"},
  {"id": 7, "function": "core", "name": "kcy", "latitude": 39.0997, "ipaddress": "21.21.21.21", "isisarea": "72", "site": "kcy", 
  "longitude": -94.5786, "y": 539.592224450132, "protected": "F", "active": "T", "x": -65.1148297722282, "type": "physical"},
  {"id": 8, "function": "core", "name": "nyc", "latitude": 40.7879, "ipaddress": "25.25.25.25", "isisarea": "72", "site": "nyc", 
  "longitude": -74.0143, "y": 378.785947351863, "protected": "F", "active": "T", "x": 679.954254116421, "type": "physical"},
  {"id": 9, "function": "core", "name": "wdc", "latitude": 38.8951, "ipaddress": "31.31.31.31", "isisarea": "72", "site": "wdc", 
  "longitude": -77.0364, "y": 767.401117006014, "protected": "F", "active": "T", "x": 599.551115567286, "type": "physical"},
  {"id": 10, "function": "core", "name": "por", "latitude": 45.5234, "ipaddress": "26.26.26.26", "isisarea": "72", "site": "por", 
  "longitude": -122.676, "y": -15.1894315388978, "protected": "F", "active": "T", "x": -1016.55196927032, "type": "physical"},
  {"id": 11, "function": "core", "name": "alb", "latitude": 42.6526, "ipaddress": "16.16.16.16", "isisarea": "72", "site": "alb", 
  "longitude": -73.7562, "y": 0.891196170929173, "protected": "F", "active": "T", "x": 1041.76837758753, "type": "physical"},
  {"id": 12, "function": "core", "name": "mia", "latitude": 25.7743, "ipaddress": "23.23.23.23", "isisarea": "72", "site": "mia", 
  "longitude": -80.1937, "y": 1177.4571236066, "protected": "F", "active": "T", "x": 1023.0076452594, "type": "physical"},
  {"id": 13, "function": "core", "name": "san", "latitude": 32.7153, "ipaddress": "27.27.27.27", "isisarea": "72", "site": "san", 
  "longitude": -117.157, "y": 1180.13722822491, "protected": "F", "active": "T", "x": -400.12790706029, "type": "physical"},
  {"id": 14, "function": "core", "name": "bos", "latitude": 42.3584, "ipaddress": "18.18.18.18", "isisarea": "72", "site": "bos", 
  "longitude": -71.0598, "y": 378.785947351863, "protected": "F", "active": "T", "x": 1341.94009483763, "type": "physical"},
  {"id": 15, "function": "core", "name": "sjc", "latitude": 36.137242513163, "ipaddress": "30.30.30.30", "isisarea": "72", "site": "sjc", 
  "longitude": -120.754451723841, "y": 547.632538305046, "protected": "F", "active": "T", "x": -558.254079540255, "type": "physical"}
  ], "links": [
  {"source": "atl", "targetInterface": "GigabitEthernet0/0/0/1", "target": "wdc", "sourceInterface": "GigabitEthernet0/0/0/3"},
  {"source": "atl", "targetInterface": "GigabitEthernet0/0/0/1", "target": "hst", "sourceInterface": "GigabitEthernet0/0/0/1"},
  {"source": "wdc", "targetInterface": "GigabitEthernet0/0/0/2", "target": "mia", "sourceInterface": "GigabitEthernet0/0/0/3"},
  {"source": "kcy", "targetInterface": "GigabitEthernet0/0/0/2", "target": "san", "sourceInterface": "GigabitEthernet0/0/0/4"},
  {"source": "kcy", "targetInterface": "GigabitEthernet0/0/0/1", "target": "sjc", "sourceInterface": "GigabitEthernet0/0/0/5"},
  {"source": "kcy", "targetInterface": "GigabitEthernet0/0/0/2", "target": "min", "sourceInterface": "GigabitEthernet0/0/0/3"},
  {"source": "nyc", "targetInterface": "GigabitEthernet0/0/0/4", "target": "chi", "sourceInterface": "GigabitEthernet0/0/0/3"},
  {"source": "sea", "targetInterface": "GigabitEthernet0/0/0/3", "target": "min", "sourceInterface": "GigabitEthernet0/0/0/1"},
  {"source": "sfc", "targetInterface": "GigabitEthernet0/0/0/4", "target": "sjc", "sourceInterface": "GigabitEthernet0/0/0/2"},
  {"source": "nyc", "targetInterface": "GigabitEthernet0/0/0/4", "target": "wdc", "sourceInterface": "GigabitEthernet0/0/0/4"},
  {"source": "por", "targetInterface": "GigabitEthernet0/0/0/2", "target": "sea", "sourceInterface": "GigabitEthernet0/0/0/1"},
  {"source": "san", "targetInterface": "GigabitEthernet0/0/0/3", "target": "hst", "sourceInterface": "GigabitEthernet0/0/0/1"},
  {"source": "sjc", "targetInterface": "GigabitEthernet0/0/0/2", "target": "lax", "sourceInterface": "GigabitEthernet0/0/0/2"},
  {"source": "mia", "targetInterface": "GigabitEthernet0/0/0/2", "target": "atl", "sourceInterface": "GigabitEthernet0/0/0/1"},
  {"source": "sfc", "targetInterface": "GigabitEthernet0/0/0/2", "target": "por", "sourceInterface": "GigabitEthernet0/0/0/1"},
  {"source": "san", "targetInterface": "GigabitEthernet0/0/0/1", "target": "lax", "sourceInterface": "GigabitEthernet0/0/0/3"},
  {"source": "min", "targetInterface": "GigabitEthernet0/0/0/3", "target": "chi", "sourceInterface": "GigabitEthernet0/0/0/1"},
  {"source": "nyc", "targetInterface": "GigabitEthernet0/0/0/3", "target": "alb", "sourceInterface": "GigabitEthernet0/0/0/1"},
  {"source": "alb", "targetInterface": "GigabitEthernet0/0/0/1", "target": "chi", "sourceInterface": "GigabitEthernet0/0/0/2"},
  {"source": "kcy", "targetInterface": "GigabitEthernet0/0/0/2", "target": "wdc", "sourceInterface": "GigabitEthernet0/0/0/6"},
  {"source": "kcy", "targetInterface": "GigabitEthernet0/0/0/2", "target": "hst", "sourceInterface": "GigabitEthernet0/0/0/2"},
  {"source": "sjc", "targetInterface": "GigabitEthernet0/0/0/3", "target": "sea", "sourceInterface": "GigabitEthernet0/0/0/3"},
  {"source": "bos", "targetInterface": "GigabitEthernet0/0/0/1", "target": "alb", "sourceInterface": "GigabitEthernet0/0/0/1"},
  {"source": "nyc", "targetInterface": "GigabitEthernet0/0/0/2", "target": "bos", "sourceInterface": "GigabitEthernet0/0/0/2"},
  {"source": "chi", "targetInterface": "GigabitEthernet0/0/0/1", "target": "kcy", "sourceInterface": "GigabitEthernet0/0/0/2"}
]};

const sampleEvtHandlers: EventHandlers = {
  clickLink: (sender, event) => {
    /* alert(`You clicked a link with id ${event.id()}`); */
  },
  selectNode: (sender, event) => {
    /* alert(`You clicked a node with id ${event.id()}`); */
  }
};

const pathHops = ["atl","hst","kcy","sjc","sea"];

const NetworkTopology = () => {
  const [topology, setTopology] = useState();
  const [loaded, setLoaded] = useState(0);

  function getLinksBetweenNodes(topo, src, dest){
    var sid = src.id();
    var did = dest.id();

    var linkSet = topo.getLinkSet(sid, did);
    if (linkSet !== null) {
      return window.nx.util.values(linkSet.links());
    }
    return false;
  }

  function getLinkList(topo, nodesDict, pathHops){

    var linkList = [];
  
    for(var i = 0; i < pathHops.length - 1; i++){
  
      var srcNode = nodesDict.getItem(pathHops[i]);
      var destNode = nodesDict.getItem(pathHops[i + 1]);
  
      var links = getLinksBetweenNodes(topo, srcNode, destNode);
      if (links != false)
        linkList.push(links[0]);
    }
  
    return linkList;
  }

  function drawPath() {
    /* TODO: Explore topology.on() for post-render callback */
    /* topology.on("topologyGenerated", function(){}); */

	var pathLayer = topology.getLayer("paths");
	var nodesDict = topology.getLayer("nodes").nodeDictionary();
	var linkList = getLinkList(topology, nodesDict, pathHops);

	var pathInst = new window.nx.graphic.Topology.Path({
	"pathWidth": 3,
	"links": linkList,
	"arrow": "cap",
	"sourceNode": nodesDict.toArray()[0],
	"pathStyle": {
		"fill": "#f00"
	}
	});

	pathLayer.addPath(pathInst);
  }

  useEffect(() => {
    fetch("http://localhost:8080/restconf/data/network-topology:network-topology?content=nonconfig")
     .then(resp => resp.json())
     .then((data) => {
      setTopology(data);
     })
     .catch(console.log)
    }, []);

    const setContext = (nxApp: any) => {
      setTopology(nxApp);
  }

  return (
    <div>
    {/* <Container> */}
			<Grid style={noBoxShadow} centered verticalAlign='middle'>
				<Grid.Row style={noBoxShadow}>
					<Grid.Column style={noBoxShadow} verticalAlign='middle'>
							<Grid columns={3} verticalAlign='middle'>
								<Grid.Column width={4} verticalAlign='middle' textAlign='left'>
									<BreadCrumb/>
									<Header size='medium'>Network Topology</Header>
                  <Button basic onClick={drawPath}>Draw Path</Button>
								</Grid.Column>
								<Grid.Column width={5} verticalAlign='middle' textAlign='left'></Grid.Column>
								<Grid.Column width={7} textAlign='right' verticalAlign='middle'>
									<Fragment>
									</Fragment>
								</Grid.Column>
							</Grid>
					</Grid.Column>
				</Grid.Row>
				<Divider />
        <Grid.Row style={noBoxShadow}>
					<Grid.Column style={noBoxShadow} verticalAlign='middle'>
							<Grid style={noBoxShadow}>
								<Grid.Column style={noBoxShadow}>
                <NextContainer topologyData={sampleTopology} 
                               topologyConfig={sampleConfig} 
                               eventHandlers={sampleEvtHandlers}
                               callback={setContext}
                               style={{ width: "100%", height: "85vh" }}/>
								</Grid.Column>
							</Grid>
					</Grid.Column>
				</Grid.Row>
			</Grid>
  </div>
  )
};

export default NetworkTopology;