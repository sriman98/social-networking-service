import React, { Component } from 'react'
import { TextField, Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import classes from './ForgotPassword.css';
import validate from '../../../util/validators';
import { connect } from 'react-redux';
import * as authActions from '..//store/auth.actions';

class ForgotPassword extends Component {

    state = {
        forgotPasswordForm: {
            controls: {
                username: {
                    value: '',
                    validation: {
                        required: true,
                        email: true
                    },
                    valid: false,
                    touched: false
                }
            },
            valid: false
        }
    }

    componentDidMount() {
        console.log('[ForgotPassword.js] componentDidMount');
    }

    inputChangeHandler = (event, controlName) => {

        const updatedControls = {
            ...this.state.forgotPasswordForm.controls,
            [controlName]: {
                ...this.state.forgotPasswordForm.controls[controlName],
                value: event.target.value,
                valid: validate(event.target.value, this.state.forgotPasswordForm.controls[controlName].validation),
                touched: true
            }
        }

        let formValid = true;

        for (let control in this.state.forgotPasswordForm.controls) {
            formValid = formValid && updatedControls[control].valid;
        }

        const updatedForm = {
            ...this.state.forgotPasswordForm,
            controls: updatedControls,
            valid: formValid
        }

        this.setState({
            ...this.state,
            forgotPasswordForm: updatedForm
        });
    }

    submitForgotPasswordForm = () => {
        const forgotPasswordData = {
            username: this.state.forgotPasswordForm.controls.username.value,
            history: this.props.history
        }
        this.props.forgotPassword(forgotPasswordData);
    }

    render() {
        return (
            <form className={classes.FormStyle}>
                <h2>Forgot Password</h2>
                <Box display="flex" flexDirection="column" alignItems="center" className={classes.MarginTop}>
                    <Box marginBottom="20px" width="80%">
                        <TextField label="Username"
                            value={this.state.forgotPasswordForm.controls.username.value}
                            fullWidth type="text" variant="outlined"
                            onChange={(event) => this.inputChangeHandler(event, 'username')}
                            error={this.state.forgotPasswordForm.controls.username.touched && !this.state.forgotPasswordForm.controls.username.valid}
                            helperText={this.state.forgotPasswordForm.controls.username.touched && !this.state.forgotPasswordForm.controls.username.valid ? 'Invalid Email' : ''}>
                        </TextField>
                    </Box>
                    <Button variant="contained" color="primary" disabled={!this.state.forgotPasswordForm.valid} onClick={this.submitForgotPasswordForm}>Next</Button>

                    <Link to="/auth/login" className={classes.Login}>Login?</Link>
                </Box>
            </form>
        );
    }
}

const mapDispathToProps = dispatch => {
    return {
        forgotPassword: (payload) => dispatch(authActions.forgotPassword(payload))
    }
};

export default connect(null, mapDispathToProps)(ForgotPassword);