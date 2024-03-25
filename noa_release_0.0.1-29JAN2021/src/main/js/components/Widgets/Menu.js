'use strict';
import React, { Fragment } from 'react';
import {
	Grid,
	Visibility,
	Menu,
	Container,
	Dropdown,
    Segment,
  } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Link } from "react-router-dom";

import { 
	menuStyle, fixedMenuStyle, overlayStyle, 
	fixedOverlayStyle, overlayMenuStyle, fixedOverlayMenuStyle, 
	noBorder, noPadding, noBoxShadow} from '../../constants';

class EMenu extends React.Component {
	state = {
        menuFixed: false,
        overlayFixed: false,
    }

    constructor(props) {
		super(props);
	}

    handleOverlayRef = (c) => {
        const { overlayRect } = this.state

        if (!overlayRect) {
            this.setState({ overlayRect: _.pick(
                c.getBoundingClientRect(), 'height', 'width') })
        }
    }

    stickOverlay = () => this.setState({ overlayFixed: true })
    stickTopMenu = () => this.setState({ menuFixed: true })
    unStickOverlay = () => this.setState({ overlayFixed: false })
    unStickTopMenu = () => this.setState({ menuFixed: false })

    render () {
        const { menuFixed, overlayFixed, overlayRect } = this.state
        return (
		<div>
            <Visibility style={Object.assign({}, noBorder, noBoxShadow)} textAlign='center'
                onBottomPassed={this.stickTopMenu}
                onBottomVisible={this.unStickTopMenu}
                once={false}
                >
                <Menu
                    stackable
                    compact
                    borderless
                    fixed={menuFixed ? 'top' : undefined}
                    style={menuFixed ? fixedMenuStyle : menuStyle}
                >
                    <Container text textAlign='center'>
                    <Dropdown header as='a' text='Security' pointing className='link item'>
                        <Dropdown.Menu>
                            <Dropdown.Item><Link to={`/security/users`}>
                                User Security</Link></Dropdown.Item>
                            <Dropdown.Item><Link to={`/security/policies`}>
                                Password Policy</Link></Dropdown.Item>
                            <Dropdown.Item><Link to={`/security/roles`}>
                                User Roles</Link></Dropdown.Item>
                            <Dropdown.Item><Link to={`/security/audits`}>
                                Audit Information</Link></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Menu position='right'>
                    </Menu.Menu>
                    </Container>
                </Menu>
            </Visibility>
        </div>
        )
    }
}

export default EMenu;