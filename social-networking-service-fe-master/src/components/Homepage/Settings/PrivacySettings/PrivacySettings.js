import React from 'react';
import classes from './PrivacySettings.css';
import { FormControlLabel, Switch } from '@material-ui/core';
import { connect } from 'react-redux';
import axios from 'axios';
import environment from '../../../../environment/environment';
import * as authActions from '../../../Auth/store/auth.actions';

const privacySettings = (props) => {

    const usersUrl = environment.SERVER + '/users';

    const privateAccountHandler = (event) => {

        const data = {
            privateAccount: event.target.checked
        }
        axios.post(usersUrl + '/privacysettings', data)
            .then(response => { props.updateUser({ user: response.data.user }) });
    }

    console.log('PrivacySettings.js render');

    return (
        <div className={classes.Root}>
            <FormControlLabel
                checked={props.user.privateAccount}
                control={<Switch color="primary" />}
                label="Private Account"
                labelPlacement="start"
                onChange={privateAccountHandler}
            />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (payload) => dispatch(authActions.updateUser(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(privacySettings));