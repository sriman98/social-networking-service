import React, { Component } from 'react'
import { TextField, Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import classes from './Login.css';
import validate from '../../../util/validators';
import { connect } from 'react-redux';
import * as authActions from '..//store/auth.actions';

class Login extends Component {

    state = {
        loginForm: {
            controls: {
                username: {
                    value: '',
                    validation: {
                        required: true,
                        email: true
                    },
                    valid: false,
                    touched: false
                },
                password: {
                    value: '',
                    validation: {
                        required: true,
                        minLength: 5
                    },
                    valid: false,
                    touched: false
                }
            },
            valid: false
        }
    }

    componentDidMount() {
        console.log('[Login.js] componentDidMount');
    }

    inputChangeHandler = (event, controlName) => {

        const updatedControls = {
            ...this.state.loginForm.controls,
            [controlName]: {
                ...this.state.loginForm.controls[controlName],
                value: event.target.value,
                valid: validate(event.target.value, this.state.loginForm.controls[controlName].validation),
                touched: true
            }
        }

        let formValid = true;

        for (let control in this.state.loginForm.controls) {
            formValid = formValid && updatedControls[control].valid;
        }

        const updatedForm = {
            ...this.state.loginForm,
            controls: updatedControls,
            valid: formValid
        }

        this.setState({
            ...this.state,
            loginForm: updatedForm
        });
    }

    submitLoginForm = () => {
        const loginData = {
            username: this.state.loginForm.controls.username.value,
            password: this.state.loginForm.controls.password.value,
            history: this.props.history
        }
        this.props.login(loginData);
    }

    render() {
        return (
            <form className={classes.MarginTop}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box marginBottom="20px" width="80%">
                        <TextField label="Username"
                            value={this.state.loginForm.controls.username.value}
                            fullWidth type="text" variant="outlined"
                            onChange={(event) => this.inputChangeHandler(event, 'username')}
                            error={this.state.loginForm.controls.username.touched && !this.state.loginForm.controls.username.valid}
                            helperText={this.state.loginForm.controls.username.touched && !this.state.loginForm.controls.username.valid ? 'Invalid Email' : ''}>
                        </TextField>
                    </Box>
                    <Box marginBottom="20px" width="80%">
                        <TextField label="Password"
                            value={this.state.loginForm.controls.password.value}
                            onChange={(event) => this.inputChangeHandler(event, 'password')}
                            fullWidth type="password" variant="outlined"
                            error={this.state.loginForm.controls.password.touched && !this.state.loginForm.controls.password.valid}
                            helperText={(this.state.loginForm.controls.password.touched && !this.state.loginForm.controls.password.valid) ? 'Password must contain atleast 5 characters' : ''}>
                        </TextField>
                    </Box>
                    <Button variant="contained" color="primary" disabled={!this.state.loginForm.valid} onClick={this.submitLoginForm}>Login</Button>

                    <Link to="/auth/forgot-password" className={classes.ForgotPassword}>Forgot Password?</Link>
                </Box>
            </form>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (payload) => dispatch(authActions.login(payload))
    };
};

export default connect(null, mapDispatchToProps)(Login);