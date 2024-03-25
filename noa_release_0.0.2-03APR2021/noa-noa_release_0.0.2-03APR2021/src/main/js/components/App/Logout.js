/**@module Logout */

import React from 'react';
import { AuthConsumer } from './AuthContext';
import { Redirect } from "react-router-dom";

/**
 * Component for Logging Out the User.
 * 
 * @class
 * @augments React.Component
 */
class Logout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect : false
        }
        this.setRedirect = this.setRedirect.bind(this);
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    /**
     * Redirects to Home Page on Logout.
     * @returns {jsx} Redirects to Index
     * 
    */
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }

    render() {
        return (
            <div>
                {this.renderRedirect()}
                <AuthConsumer>
                    {({ isAuth, login, logout }) => {
                        logout(this.setRedirect)
                    }}
                </AuthConsumer>
            </div>
        )
    }
}

export default Logout;