import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

const URIPATH = "http://localhost:8080/api/restconf/data/network-topology:network-topology/topology="
const TOPOLOGY = "topology-netconf"
const NODE = "odl-ofconfig-netconf"

const client = require('../../utils/client');

class FlowTables extends React.Component {
    render() {
        return(
            <Fragment>
                    <li><Link to="/network/elements/capableswitch/flowtable">flow-table</Link></li>
            </Fragment>
        )
    }
}

export default FlowTables;