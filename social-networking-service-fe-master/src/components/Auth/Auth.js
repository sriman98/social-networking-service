import React, { Component, Fragment } from 'react';
import { Card, CardContent, Tabs, Tab } from '@material-ui/core';
import { Route } from 'react-router-dom';
import classes from './Auth.css';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import BackgroundLogo from '../../assets/logo.png';
import ResetPassword from './ResetPassword/ResetPassword';

class Auth extends Component {

    componentDidMount() {
        console.log('[Auth.js] componentDidMount')
    }

    shouldComponentUpdate() {
        console.log('[Auth.js] shouldComponentUpdate');
        return true;
    }

    tabsChangeHandler = (event, value) => {
        this.props.history.push(value);
    }

    render() {

        let tabs = null;

        if (this.props.history.location.pathname !== '/auth/forgot-password' && !this.props.history.location.pathname.startsWith('/auth/reset-password')) {
            tabs = (
                <Fragment>
                    <Tabs value={this.props.history.location.pathname} onChange={this.tabsChangeHandler} textColor="primary" indicatorColor="primary" variant="fullWidth">
                        <Tab label="Login" value="/auth/login" />
                        <Tab label="Sign Up" value="/auth/signup" />
                    </Tabs>
                </Fragment>
            );
        }

        return (
            <div>
                <img src={BackgroundLogo} alt="Background Logo" className={classes.BackgroundImage}></img>
                <Card className={classes.CardStyle}>
                    <CardContent>
                        {tabs}
                        <Route path="/auth/login" component={Login}></Route>
                        <Route path="/auth/signup" component={SignUp}></Route>
                        <Route path="/auth/forgot-password" component={ForgotPassword}></Route>
                        <Route path="/auth/reset-password/:token" component={ResetPassword}></Route>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default Auth;