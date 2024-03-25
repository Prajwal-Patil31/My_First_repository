/**@module LoginLayout */

import React from 'react';

import { 
    Grid, Header,
    Image,
    Divider
 } from 'semantic-ui-react';
 
import Login from './Login';

import 'semantic-ui-css/semantic.min.css';

/**
 * Component to provide Layout for the Login page.
 * 
 * @class
 * @augments React.Component
 */
class LoginLayout extends React.Component {
    constructor(props) {
        super(props);
    }
    /**
     * Renders a view of Login Page .
    */
    render() {
        return (
            <div>
            <Grid columns={2} 
                  verticalAlign='middle' 
                  style={{backgroundColor: '#FFFFFF', height: '100vh'}}>
                <Grid.Column>
                    <Grid centered style={{backgroundColor: '#F5F5F5', height: '100vh'}}>
                        <Grid.Column verticalAlign='middle'>
                            <Image centered size="large" src="/images/unoa-l.png"/>
                            <Header as='h2' 
                                    textAlign='center' 
                                    style={{fontFamily: 'CiscoSans'}}>
                                Network Orchestration & Automation Platform
                            </Header>
                        </Grid.Column>
                    </Grid>
                </Grid.Column>
                <Grid.Column>
                    <Grid columns={3} centered style={{width: '100vh'}}>
                        <Grid.Column width={1}></Grid.Column>
                        <Grid.Column width={6} verticalAlign='middle'>
                            <Header as='h2' textAlign='center' 
                                    style={{fontFamily: 'CiscoSans'}}>
                                NOA Administration Console
                            </Header>
                            <Divider/>
                            <Login/>
                        </Grid.Column>
                        <Grid.Column width={1}></Grid.Column>
                    </Grid>
                </Grid.Column> 
            </Grid>
            </div>
        )
    }
}

export default LoginLayout;