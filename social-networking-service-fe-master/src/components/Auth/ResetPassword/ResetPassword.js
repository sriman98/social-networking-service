import React, { Component } from 'react'
import { TextField, Box, Button } from '@material-ui/core';
import classes from './ResetPassword.css';
import validate from '../../../util/validators';
import { connect } from 'react-redux';
import * as authActions from '../store/auth.actions';

class ResetPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            resetPasswordForm: {
                controls: {
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
                    },
                },
                valid: false
            }
        }

        const payload = {
            token: props.match.params.token,
            history: props.history
        }

        props.resetPasswordValidate(payload);
    }

    componentDidMount() {
        console.log('[ResetPassword.js] componentDidMount');
    }

    validateFormControl = (value, controlName) => {
        let valid = validate(value, this.state.resetPasswordForm.controls[controlName].validation);
        if (controlName === 'verifyPassword') {
            valid = valid && this.state.resetPasswordForm.controls.password.value === value;
        }
        return valid;
    }

    inputChangeHandler = (event, controlName) => {

        const updatedControls = {
            ...this.state.resetPasswordForm.controls,
            [controlName]: {
                ...this.state.resetPasswordForm.controls[controlName],
                value: event.target.value,
                valid: this.validateFormControl(event.target.value, controlName),
                touched: true
            }
        }

        if (controlName === 'password') {
            updatedControls.verifyPassword.valid = updatedControls.password.valid && updatedControls.verifyPassword.value === event.target.value;
        }

        let formValid = true;

        for (let control in this.state.resetPasswordForm.controls) {
            formValid = formValid && updatedControls[control].valid;
        }

        const updatedForm = {
            ...this.state.resetPasswordForm,
            controls: updatedControls,
            valid: formValid
        }

        this.setState({
            ...this.state,
            resetPasswordForm: updatedForm
        });
    }

    submitResetPasswordForm = () => {
        const resetPasswordData = {
            token: this.props.match.params.token,
            password: this.state.resetPasswordForm.controls.password.value,
            history: this.props.history
        }
        this.props.resetPassword(resetPasswordData);
    }

    render() {
        return (
            <form className={classes.FormStyle}>
                <h2>Reset Password</h2>
                <Box display="flex" flexDirection="column" alignItems="center" className={classes.MarginTop}>
                    <Box marginBottom="20px" width="80%">
                        <TextField label="Password"
                            value={this.state.resetPasswordForm.controls.password.value}
                            fullWidth type="password" variant="outlined"
                            onChange={(event) => this.inputChangeHandler(event, 'password')}
                            error={this.state.resetPasswordForm.controls.password.touched && !this.state.resetPasswordForm.controls.password.valid}
                            helperText={this.state.resetPasswordForm.controls.password.touched && !this.state.resetPasswordForm.controls.password.valid ? 'Password must contain atleast 5 characters' : ''}>
                        </TextField>
                    </Box>
                    <Box marginBottom="20px" width="80%">
                        <TextField label="Verify Password"
                            value={this.state.resetPasswordForm.controls.verifyPassword.value}
                            fullWidth type="password" variant="outlined"
                            onChange={(event) => this.inputChangeHandler(event, 'verifyPassword')}
                            error={this.state.resetPasswordForm.controls.verifyPassword.touched && !this.state.resetPasswordForm.controls.verifyPassword.valid}
                            helperText={this.state.resetPasswordForm.controls.verifyPassword.touched && !this.state.resetPasswordForm.controls.verifyPassword.valid ? 'Password mismatch' : ''}>
                        </TextField>
                    </Box>
                    <Button variant="contained" color="primary" disabled={!this.state.resetPasswordForm.valid} onClick={this.submitResetPasswordForm}>Reset</Button>
                </Box>
            </form>
        );
    }
}

const mapDispathToProps = dispatch => {
    return {
        resetPasswordValidate: (payload) => dispatch(authActions.resetPasswordStart(payload)),
        resetPassword: (payload) => dispatch(authActions.resetPassword(payload))
    }
};

export default connect(null, mapDispathToProps)(ResetPassword);