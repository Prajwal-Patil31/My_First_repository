// @flow

import * as React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
	Container,
	Sidebar,
	Sidenav,
	Icon,
	Header,
	Content,
	Dropdown,
	Nav,
	DOMHelper,
	Navbar
} from 'rsuite';

import 'rsuite/dist/styles/rsuite-default.css';

import '../../App.css';

export const styles = {
  icon: 
  {
    width: 56,
    height: 56,
    lineHeight: '56px',
    textAlign: 'center'
  },
  navItem: 
  {
    width: 56,
    textAlign: 'center' as const
  }
};

type TProps = {
  expand?: boolean,
  onChange?: () => void
};

/**
 * Component to Render Navbar on Toggle.
 * @param {boolean} expand State of Navbar.
 * @param {function} onChange To change the state of Expand.
 * @returns {jsx} Rendered Navbar.
 * 
*/
const NavToggle = ({ expand, onChange }: TProps) => {
  return (
    <Navbar appearance="default" className="nav-toggle" style={{color: 'darkslategray'}}>
      <Navbar.Body>
        <Nav pullRight>
          <Nav.Item onClick={onChange} style={styles.navItem}>
            <Icon icon={expand ? 'chevron-left' : 'chevron-right'} />
          </Nav.Item>
        </Nav>
      </Navbar.Body>
    </Navbar>
  );
};

const { getHeight, on } = DOMHelper;

/**
 * List of Navbar Items and their Respective Children.
 * 
*/
const navs = [
  {
    key: '1',
    icon: <Icon icon="attribution" />,
    text: 'Dashboard',
    link: '/user/dashboard'
  },
  {
    key: '2',
    icon: <Icon icon="sitemap" />,
    text: 'Network Elements',
    children: [
      {
        key: '2-1',
        text: 'Network Topology',
        link: '/network/topology'
      },
      {
        key: '2-2',
        text: 'Element Reports',
        link: '/network/reports'
	  },
	  {
		key: '2-3',
        text: 'Element Inventory',
        link: '/network/elements'
	  }
    ]
  },
  {
    key: '3',
    icon: <Icon icon="dot-circle-o" />,
    text: 'Network Slices',
    children: [
      {
        key: '3-1',
        text: 'Network Topology',
        link: '/network/topology'
      },
      {
        key: '3-2',
        text: 'Network Trails',
        link: '/network/trails'
      },
      {
        key: '3-3',
        text: 'Slice Administration',
        link: '/network/slice'
      },
      {
        key: '3-4',
        text: 'Network Reports',
        link: '/network/reports'
      }
    ]
  },
  {
    key: '4',
    icon: <Icon icon="cubes" />,
    text: 'Network Services',
    children: [
      {
        key: '3-1',
        text: 'Service List',
        link: '/network/service'
      },
      {
        key: '3-2',
        text: 'Service Administration',
        link: '/network/service/admin'
      },
      {
        key: '3-3',
        text: 'Service Reports',
        link: '/network/service/reports'
      },
      {
        key: '3-4',
        text: 'Tenant Administration',
        link: '/network/tenant'
      }
    ]
  },
  {
    key: '5',
    icon: <Icon icon="random" />,
    text: 'Control Plane',
    children: [
      {
        key: '5-1',
        text: 'Control Plane Topology',
        link: '/network/cplane/topology'
      },
      {
        key: '5-2',
        text: 'Routing Configuration',
        link: '/network/cplane/routing'
      },
      {
        key: '5-3',
        text: 'Traffic Engineering',
        link: '/network/cplane/teng'
      }
    ]
  },
  {
    key: '6',
    icon: <Icon icon="exclamation-triangle" />,
    text: 'Fault Management',
    children: [
      {
        key: '5-1',
        text: 'Fault List',
        link: '/faults/faults'
      },
      {
        key: '5-2',
        text: 'Escalation Policy',
        link: '/faults/policies/escalate'
      },
      {
        key: '5-3',
        text: 'Acknowledgement Policy',
        link: '/faults/policies/acknowledge'
	  },
	  {
        key: '5-4',
        text: 'Fault Configuration',
        link: '/faults/config'
      },
    ]
  },
  {
    key: '7',
    text: 'Security',
    icon: <Icon icon="shield" />,
    children: [
      {
        key: '7-1',
        text: 'AAA Configuration',
        link: '/security/aaa'
      },
      {
        key: '7-2',
        text: 'User Administration',
        link: '/security/users'
	  },
	  {
        key: '7-3',
        text: 'User Groups',
        link: '/security/user/groups'
	  },
      {
        key: '7-4',
        text: 'Role Administration',
        link: '/security/roles'
      },
      {
        key: '7-5',
        text: 'Security Policy',
        link: '/security/policies/password'
      },
      {
        key: '7-6',
        text: 'Active Sessions',
        link: '/security/sessions'
      },
      {
        key: '7-7',
        text: 'Audit Reports',
        link: '/security/audit'
      },
      {
        key: '7-8',
        text: 'Resources',
        link: '/security/resources'
      },
      {
        key: '7-9',
        text: 'Resource Groups',
        link: '/security/resourcegroups'
      }
    ]
  },
  {
    key: '8',
    text: 'Platform Administration',
    icon: <Icon icon="adjust" />,
    children: [
      {
        key: '8-1',
        text: 'Configuration Backup',
        link: '/platform/system/conf'
      },
      {
        key: '8-2',
        text: 'Cluster Administration',
        link: '/platform/system/cluster'
      },
      {
        key: '8-3',
        text: 'External Services',
        link: '/platform/system/services'
      },
      {
        key: '8-4',
        text: 'Performance Control',
        link: '/platform/system/perf'
      },
      {
        key: '8-5',
        text: 'Scheduling Configuration',
        link: '/platform/system/schedule'
      },
      {
        key: '8-6',
        text: 'Audit Reports',
        link: '/platform/system/lat'
      }
    ]
  }
];

type State = {
  windowHeight: number,
  expand: boolean
};

type Props = {
  children: React.ReactNode 
};

/**
 * Component to Render Navbar which expands on Click.
 * 
 */
class NavFrame extends React.Component<Props, State> {
	resizeListenner = null;
	static contextTypes = {
		router: PropTypes.object
	};

	constructor(props: Props) {
		super(props);
		this.state = {
		windowHeight: getHeight(window),
		expand: true
		};
		this.resizeListenner = on(window, 'resize', this.updateHeight);
	}

	updateHeight = () => {
		this.setState({windowHeight: getHeight(window)});
	};

	handleToggle = () => {
		this.setState({expand: !this.state.expand});
	};

	componentWillUnmount() {
		if (this.resizeListenner) {
		this.resizeListenner.off();
		}
	}

	/**
	 * Renders a Dropdown of List of Items inside Navbar and their respective Childs if any
	 * @returns  {jsx} Renders Dropdown for List of Items and their Childs if any.   
	*/
  renderNavs() {
		return navs.map(item => {
		if (item.children) {
			return (
			<Dropdown
				key={item.key}
				eventKey={item.key}
				trigger="hover"
				title={item.text}
				icon={item.icon}
			>
				{item.children.map(child => {
				return (
					<Dropdown.Item
					key={child.key}
					eventKey={child.key}
					componentClass={Link}
					to={child.link}
					activeClassName="nav-item-active"
					>
					{child.text}
					</Dropdown.Item>
				);
				})}
			</Dropdown>
			);
		}

		return (
			<Nav.Item
			key={item.key}
			eventKey={item.key}
			icon={item.icon}
			componentClass={Link}
			to={item.link}
			activeClassName="nav-item-active"
			>
			{item.text}
			</Nav.Item>
		);
    });
  	}
	/**
     * Renders a Navbar view to Access different Pages. 
	 * 
    */ 
	render() {
		const { children } = this.props;
		const { expand, windowHeight } = this.state;

		const containerClasses = classNames('page-container', {
		'container-full': !expand
		});

		let navBodyStyle = null;
		if (expand) {
		navBodyStyle = {
			height: windowHeight - 56,
			overflow: 'auto',
			color: 'darkslategray'
		};
	}

    return (
		<Container className="frame">
			<Sidebar
			style={{ display: 'flex', flexDirection: 'column' }}
			width={expand ? 260 : 56}
			collapsible
			className="thinScroll"
			>
			<Sidenav.Header>
				<NavToggle expand={expand} onChange={this.handleToggle} />
			</Sidenav.Header>
			<Sidenav expanded={expand} defaultOpenKeys={[]} activeKey={[]} appearance="default" style={{ height: '100%' }}>
				<Sidenav.Body style={navBodyStyle}>
				<Nav>
					{this.renderNavs()}
				</Nav>
				</Sidenav.Body>
			</Sidenav>
			</Sidebar>

			<Container className={containerClasses}>
			<Content>{children}</Content>
			</Container>
		</Container>
    );
  }
}

export default NavFrame;
