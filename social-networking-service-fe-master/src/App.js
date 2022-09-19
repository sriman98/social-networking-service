import React, { Fragment, Component } from 'react';
import './App.css';
import { Redirect, Switch } from 'react-router-dom';
import Auth from './components/Auth/Auth';
import SnackBar from './shared/SnackBar/SnackBar';
import Spinner from './shared/Spinner/Spinner';
import Homepage from './components/Homepage/Homepage';
import AuthenticatedRoute from './guards/AuthenticatedRoute/AuthenticatedRoute';
import AuthRoute from './guards/AuthRoute/AuthRoute';
import * as authActions from './components/Auth/store/auth.actions';
import { connect } from 'react-redux';

class App extends Component {

  componentWillMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.props.autoLogin();
    }
  }

  componentDidMount() {
    console.log('[App.js] componentDidMount');
  }

  render() {
    console.log('[App.js] render');
    return (
      <Fragment>
        <SnackBar></SnackBar>
        <Spinner></Spinner>
        <Switch>
          <Redirect exact path="/auth" to="/auth/login" />
          <Redirect exact path="/" to="/auth/login" />
          <Redirect exact path="/homepage" to="/homepage/newsfeed" />
          <Redirect exact path='/homepage/settings' to='/homepage/settings/privacy' />
          <AuthRoute path="/auth" component={Auth}></AuthRoute>
          <AuthenticatedRoute path="/homepage" component={Homepage}></AuthenticatedRoute>
        </Switch>
      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    autoLogin: () => dispatch(authActions.autoLogin())
  }
}

export default connect(null, mapDispatchToProps)(App);
