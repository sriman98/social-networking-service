import React, { Component, Fragment } from 'react';
import User from './User/User';
import environment from '../../environment/environment';
import axios from 'axios';
import { Typography } from '@material-ui/core';
import classes from './Users.css';

class Users extends Component {

    state = {
        users: [],
        emptyText: ''
    }

    usersUrl = environment.SERVER + '/users';
    postsUrl = environment.SERVER + '/posts';

    componentWillMount() {

        switch (this.props.type) {
            case 'following':
                this.setState({ emptyText: 'No Following' });
                axios.get(this.usersUrl + '/' + this.props.id + '/following').then(response => this.initializeUsers(response.data.users));
                break;
            case 'followers':
                this.setState({ emptyText: 'No Followers' });
                axios.get(this.usersUrl + '/' + this.props.id + '/followers').then(response => this.initializeUsers(response.data.users));
                break;
            case 'likes':
                this.setState({ emptyText: 'No Likes' });
                axios.get(this.postsUrl + '/' + this.props.id + '/likes').then(response => this.initializeUsers(response.data.users));
                break;
            case 'suggestions':
                this.setState({ emptyText: 'No Suggestions' });
                axios.get(this.usersUrl + '/suggestions').then(response => {
                    const modifiedUers = response.data.users.map(user => {
                        return {
                            ...user,
                            followedByLoggedUser: false,
                            requestedByLoggedUser: false
                        }
                    });
                    this.initializeUsers(modifiedUers);
                });
                break;
            default:
                break;
        }
    }

    initializeUsers = (users) => {
        if (users.length !== 0) {
            this.setState({ users: users, emptyText: ''});
        }
    }

    followUnfollowUser = (data) => {

        const requestData = {
            userId: this.state.users[data.index]._id
        }

        switch (data.type) {
            case 'follow':
                axios.post(this.usersUrl + '/follow', requestData).then(response => {
                    if (this.state.users[data.index].privateAccount) {
                        this.setFollow(data.index, false, true);
                    } else {
                        this.setFollow(data.index, true, false);
                    }
                });
                break;
            case 'cancelRequest':
                axios.post(this.usersUrl + '/cancelrequest', requestData).then(response => this.setFollow(data.index, false, false));
                break;  
            case 'unfollow':
                axios.post(this.usersUrl + '/unfollow', requestData).then(response => this.setFollow(data.index, false, false));
                break;
            default:
                break;
        }
    }

    setFollow = (index, followedByLoggedUser, requestedByLoggedUser) => {
        const updatedUser = {
            ...this.state.users[index],
            followedByLoggedUser: followedByLoggedUser,
            requestedByLoggedUser: requestedByLoggedUser
        }
        const updatedUsers = [...this.state.users];
        updatedUsers[index] = updatedUser;
        this.setState({ users: updatedUsers });
    }

    render() {
        console.log('Users.js render');

        let renderElement = null;

        if (this.state.users.length !== 0) {
            renderElement = this.state.users.map((user, index) => (
                    <User user={user} key={index} index={index} followUnfollowUser={this.followUnfollowUser} />
                )
            );
        } else {
            renderElement = (
                <Typography className={classes.Empty}>{this.state.emptyText}</Typography>
            );
        }

        return (
            <Fragment>
                {renderElement}
            </Fragment>
        );
    }
}

export default Users;