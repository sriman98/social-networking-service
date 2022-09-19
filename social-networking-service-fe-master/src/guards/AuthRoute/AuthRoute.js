import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const authRoute = ({ component: Component, ...rest }) => {

    const isToken = () => {
        const token = localStorage.getItem('token');
        return token ? true : false;
    }

    return (
        <Route {...rest} render={
            (props) => (
                isToken() ? <Redirect to="/homepage" /> : <Component {...props} />
            )
        } />
    );
}

export default authRoute;