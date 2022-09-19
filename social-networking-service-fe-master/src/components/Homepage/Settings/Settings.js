import React, { Fragment } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { Route } from 'react-router-dom';
import PrivacySettings from './PrivacySettings/PrivacySettings';

const settings = (props) => {

    const tabsChangeHandler = (event, value) => {
        props.history.push(value);
    }

    return (
        <Fragment>
            <Tabs value={props.history.location.pathname} onChange={tabsChangeHandler} textColor="primary" indicatorColor="primary">
                <Tab label='Privacy Settings' value='/homepage/settings/privacy' />
            </Tabs>
            <Route path="/homepage/settings/privacy" component={PrivacySettings}></Route>
        </Fragment>
    );
}

export default settings;