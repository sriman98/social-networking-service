import React, { Component } from 'react';
import RequestUser from './RequestUser/RequestUser';
import environment from '../../../environment/environment';
import axios from 'axios';
import { Typography, Box } from '@material-ui/core';
import classes from './RequestUsers.css';

class RequestUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            emptyText: 'No Requests'
        }

        this.usersUrl = environment.SERVER + '/users';
    }

    componentDidMount() {
        axios.get(this.usersUrl + '/requests')
            .then(response => {
                if (response.data.users.length !== 0) {
                    this.setState({ users: response.data.users, emptyText: '' });
                }
            });
    }

    acceptCancelUser = (data) => {

        const requestData = {
            userId: this.state.users[data.index]._id
        }

        if (data.type === 'accept') {
            axios.post(this.usersUrl + '/acceptrequest', requestData).then(response => this.removeUser(data.index));
        } else {
            axios.post(this.usersUrl + '/rejectrequest', requestData).then(response => this.removeUser(data.index));
        }
    }

    removeUser = (index) => {
        const updatedUsers = [...this.state.users];
        updatedUsers.splice(index, 1);
        if (updatedUsers.length === 0) {
            this.setState({ users: updatedUsers, emptyText: 'No Requests' });
        } else {
            this.setState({ users: updatedUsers });
        }
    }

    render() {
        console.log('RequestUsers.js render');

        let renderElement = null;

        if (this.state.users.length !== 0) {
            renderElement = this.state.users.map((user, index) => (
                <RequestUser user={user} key={index} index={index} acceptCancelUser={this.acceptCancelUser} />
            )
            );
        } else {
            renderElement = (
                <Typography className={classes.Empty}>{this.state.emptyText}</Typography>
            );
        }

        return (
            <div className={classes.Root}>
                <Box marginBottom='10px'>
                    <Typography variant='h6'>Follow Requests</Typography>
                </Box>
                {renderElement}
            </div>
        );
    }
}

export default RequestUsers;