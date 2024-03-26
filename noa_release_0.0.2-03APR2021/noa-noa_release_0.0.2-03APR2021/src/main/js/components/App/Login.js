/**@module Login */

import React from 'react';
import { Redirect} from "react-router";
import { AuthConsumer } from './AuthContext';

import { 
    Grid,      
    Divider,Button, Checkbox, Form
} from 'semantic-ui-react';

import { tbButton } from '../../constants';

import 'semantic-ui-css/semantic.min.css';

import {Formik} from 'formik';

import * as yup from 'yup';

 /**
  * Validation Schema; Used for Login Form Validation.
  */
let loginSchema = yup.object().shape({
	username: yup.string()
				.min(4, "Too Short.")
				.required("Username is a Required Field."),
	password: yup.string().required("Password is a Required Field.")
})

/**
 * Component to render Login page; Implements Login Operation 
 * @class
 * @augments React.Component
 */
class Login extends React.Component {
    /**
     * Login Constructor. Initializes state to hold User data.
     * 
     * @constructor
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            user : 
            {
                username : "",
                password : ""
            },
            redirect : false
        }
        this.handleChange = this.handleChange.bind(this);
        this.setRedirect = this.setRedirect.bind(this);
    }

    setRedirect = () => {
        this.setState({redirect: true})
    }

    /**
     * Performs a Redirect opertion on same page.
     */
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

    /**
     * Renders a View with inputs for Login 
     * 
     */
    render() {
        const user = this.state.user;
        
        return (
            <div>
                <AuthConsumer>
                {({ isAuth, login, logout }) => (            
                    <Formik
                        initialValues={user}
                        validationSchema={loginSchema}
                        onSubmit = {(values) => {
                        this.setState({user: values});
                        login(this.state.user, this.setRedirect);
                        }}
                        >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleSubmit
                        }) => (
                        <Form onSubmit={handleSubmit}>
                        <Grid centered style={{paddingTop: '8px'}}>
                            <Grid.Column verticalAlign='middle'>
                            <Grid.Row style={{paddingTop: '8px'}}>
                                <Form.Input
                                    size='large' 
                                    icon='user'
                                    name='username'
                                    value={values.username}
                                    onChange={handleChange}
                                    iconPosition='left'
                                    placeholder='Username'
                                />
                                <p style={{color: 'red'}}>
                                    {errors.username 
                                    && touched.username 
                                    && errors.username}
                                </p>
                            </Grid.Row>
                            <Divider hidden/> 
                            <Grid.Row style={{paddingTop: '8px'}}>
                                <Form.Input
                                    size='large'
                                    icon='lock'
                                    name='password'
                                    value={values.password}
                                    onChange={handleChange}
                                    iconPosition='left'
                                    placeholder='Password'
                                    type='password'
                                />
                                <p style={{color: 'red'}}>
                                    {errors.password 
                                    && touched.password 
                                    && errors.password}
                                </p>
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
                                <Button style={tbButton} content='Login' 
                                        size='medium' primary type='submit'
                                />
                            </Grid.Row>
                            </Grid.Column>
                        </Grid>
                        </Form>
                    )}
                    </Formik>
                )}
                </AuthConsumer>
            </div>
        )
    }
}

export default Login;