import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const authenticatedRoute = ({ component: Component, ...rest }) => {

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return token ? true : false;
    }

    return (
        <Route {...rest} render={
            (props) => (
                isAuthenticated() ? <Component {...props} /> : <Redirect to="/auth/login" />
            )
        } />
    );
}

export default authenticatedRoute;