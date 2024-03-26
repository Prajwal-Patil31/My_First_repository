import React from 'react';
import { Redirect} from "react-router";
import { AuthConsumer } from './AuthContext';
import { 
    Form, Grid, Header, Input,      
    Image, Message, Segment, 
    Divider,Button, Checkbox
} from 'semantic-ui-react';
import { tbButton } from '../../constants';
import 'semantic-ui-css/semantic.min.css';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : {
                username: "",
                password: ""
            },
            redirect : false
        }
        this.handleChange = this.handleChange.bind(this);
        this.setRedirect = this.setRedirect.bind(this);
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }

    handleChange = (event,data) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		let user = {...this.state.user};
		user[name] = value;
		this.setState({user});
    };

    render() {
        const {user} = this.state;
        
        return (
            <div>
                <Grid centered style={{paddingTop: '8px'}}>
                    <Grid.Column verticalAlign='middle'>
                    <Grid.Row style={{paddingTop: '8px'}}>
                        <Input
                            size='large' 
                            icon='user'
                            name='username'
                            value={user.username}
                            onChange={this.handleChange}
                            iconPosition='left'
                            placeholder='Username'
                        />
                    </Grid.Row>
                    <Divider hidden/> 
                    <Grid.Row style={{paddingTop: '8px'}}>
                        <Input
                            size='large'
                            icon='lock'
                            name='password'
                            value={user.password}
                            onChange={this.handleChange}
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <Grid columns={2} style={{paddingTop: '32px'}}>
                            <Grid.Column>
                                <Checkbox label='Remember Me'/>
                            </Grid.Column>
                            <Grid.Column>
                                Forgot Password?
                            </Grid.Column>
                        </Grid>
                    </Grid.Row>  
                    <Grid.Row>
                        <AuthConsumer>
                            {({ isAuth, login, logout }) => (
                                <Button style={tbButton} onClick={() => login(this.state.user, this.setRedirect)} 
                                        size='medium' primary>Login</Button>
                            )}
                        </AuthConsumer>
                    </Grid.Row>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default Login;