import React, { Component } from 'react'
import { TextField, Box, Button } from '@material-ui/core';
import validate from '../../../util/validators';
import { connect } from 'react-redux';
import * as authActions from '..//store/auth.actions';
import classes from './SignUp.css';

class SignUp extends Component {

    state = {
        signUpForm: {
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
                },
                verifyPassword: {
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
        console.log('[SignUp.js] componentDidMount');
    }

    validateFormControl = (value, controlName) => {
        let valid = validate(value, this.state.signUpForm.controls[controlName].validation);
        if (controlName === 'verifyPassword') {
            valid = valid && this.state.signUpForm.controls.password.value === value;
        }
        return valid;
    }

    inputChangeHandler = (event, controlName) => {

        const updatedControls = {
            ...this.state.signUpForm.controls,
            [controlName]: {
                ...this.state.signUpForm.controls[controlName],
                value: event.target.value,
                valid: this.validateFormControl(event.target.value, controlName),
                touched: true
            }
        }

        if (controlName === 'password') {
            updatedControls.verifyPassword.valid = updatedControls.password.valid && updatedControls.verifyPassword.value === event.target.value;
        }

        let formValid = true;

        for (let control in this.state.signUpForm.controls) {
            formValid = formValid && updatedControls[control].valid;
        }

        const updatedForm = {
            ...this.state.signUpForm,
            controls: updatedControls,
            valid: formValid
        }

        this.setState({
            ...this.state,
            signUpForm: updatedForm
        });
    }

    submitSignUpForm = () => {
        const signUpData = {
            username: this.state.signUpForm.controls.username.value,
            password: this.state.signUpForm.controls.password.value,
            history: this.props.history
        }
        this.props.signUp(signUpData);
    }

    render() {
        return (
            <form className={classes.MarginTop}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box marginBottom="20px" width="80%">
                        <TextField label="Username"
                            value={this.state.signUpForm.controls.username.value}
                            onChange={(event) => this.inputChangeHandler(event, 'username')}
                            fullWidth type="text" variant="outlined"
                            error={this.state.signUpForm.controls.username.touched && !this.state.signUpForm.controls.username.valid}
                            helperText={this.state.signUpForm.controls.username.touched && !this.state.signUpForm.controls.username.valid ? 'Invalid Email' : ''}>
                        </TextField>
                    </Box>
                    <Box marginBottom="20px" width="80%">
                        <TextField label="Password"
                            value={this.state.signUpForm.controls.password.value}
                            onChange={(event) => this.inputChangeHandler(event, 'password')}
                            fullWidth type="password" variant="outlined"
                            error={this.state.signUpForm.controls.password.touched && !this.state.signUpForm.controls.password.valid}
                            helperText={(this.state.signUpForm.controls.password.touched && !this.state.signUpForm.controls.password.valid) ? 'Password must contain atleast 5 characters' : ''}>
                        </TextField>
                    </Box>
                    <Box marginBottom="20px" width="80%">
                        <TextField label="Confirm Password"
                            value={this.state.signUpForm.controls.verifyPassword.value}
                            onChange={(event) => this.inputChangeHandler(event, 'verifyPassword')}
                            fullWidth type="password" variant="outlined"
                            error={this.state.signUpForm.controls.verifyPassword.touched && !this.state.signUpForm.controls.verifyPassword.valid}
                            helperText={this.state.signUpForm.controls.verifyPassword.touched && !this.state.signUpForm.controls.verifyPassword.valid ? 'Password mismatch' : ''}>
                        </TextField>
                    </Box>
                    <Button variant="contained" color="primary" disabled={!this.state.signUpForm.valid} onClick={this.submitSignUpForm}>Sign Up</Button>
                </Box>
            </form>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (payload) => dispatch(authActions.signUp(payload))
    };
}

export default connect(null, mapDispatchToProps)(SignUp);