import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, TextField, IconButton, Divider, Popper, Paper, ClickAwayListener } from '@material-ui/core';
import classes from './Header.css';
import { connect } from 'react-redux';
import * as authActions from '../../Auth/store/auth.actions';
import axios from 'axios';
import environment from '../../../environment/environment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { Redirect } from 'react-router-dom';
import Notifications from '../Notifications/Notifications';
import RequestUsers from '../RequestUsers/RequestUsers';

class Header extends Component {

    state = {
        anchorEl: null,
        notifyAnchorEl: null,
        friendRequestAnchorEl: null,
        friendRequestOpen: false,
        notifyOpen: false,
        users: [],
        redirectUrl: null
    }

    openMenu = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    }

    closeMenu = () => {
        this.setState({ anchorEl: null });
    }

    logout = () => {
        localStorage.removeItem('token');
        this.props.logout();
        this.setState({ redirectUrl: '/auth/login' });
    }

    searchChangeHandler = (event) => {

        const usersUrl = environment.SERVER + '/users';
        clearTimeout(this.timer);

        const search = event.target.value;

        this.timer = setTimeout(() => {
            if (search.trim() !== '') {
                axios.get(usersUrl + '?search=' + search)
                    .then(response => {
                        this.setState(prevState => {
                            return { ...prevState, users: response.data.users };
                        })
                    });
            }
        }, 1000);
    }

    searchOptionChangeHandler = (option, value) => {
        if (value) {
            this.setState({ redirectUrl: '/homepage/profile/' + value._id });
        }
    }

    notificationHandler = (event) => {
        this.setState({ notifyAnchorEl: event.currentTarget, notifyOpen: !this.state.notifyOpen });
    }

    friendRequestHandler = (event) => {
        this.setState({ friendRequestAnchorEl: event.currentTarget, friendRequestOpen: !this.state.friendRequestOpen });
    }

    render() {
        console.log('Header.js render');

        return (
            <AppBar className={classes.AppBar} position='fixed'>
                {this.state.redirectUrl ? <Redirect to={this.state.redirectUrl} /> : null}
                <Toolbar>
                    <Typography variant="h5">Babji</Typography>
                    <Autocomplete id="combo-box" freeSolo options={this.state.users} getOptionLabel={(option) => option.name} onChange={this.searchOptionChangeHandler} className={classes.Autocomplete}
                        renderInput={(params) => <TextField {...params} placeholder='Search...' onChange={this.searchChangeHandler} variant='outlined' size="small" className={classes.TextField} />}
                    />
                    <div className={classes.ButtonMenu}>
                        <Box display='flex' flexDirection='row'>
                            <Divider orientation="vertical" flexItem className={classes.Divider} />
                            <IconButton onClick={this.friendRequestHandler}><SupervisorAccountIcon fontSize='large' className={classes.NotificationButton} /></IconButton>
                            <Divider orientation="vertical" flexItem className={classes.Divider} />
                            <IconButton onClick={this.notificationHandler}><NotificationsIcon fontSize='large' className={classes.NotificationButton} /></IconButton>
                            <Divider orientation="vertical" flexItem className={classes.Divider} />
                            <Button aria-controls="simple-menu" onClick={this.openMenu} className={classes.Button} endIcon={<ArrowDropDownIcon />}>
                                {this.props.user ? this.props.user.name : ''}
                            </Button>
                        </Box>
                        <Menu id="simple-menu" anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onClose={this.closeMenu}>
                            <MenuItem onClick={() => this.setState({ redirectUrl: '/homepage/settings', anchorEl: null })}>Settings</MenuItem>
                            <MenuItem onClick={this.logout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
                <Popper open={this.state.friendRequestOpen} anchorEl={this.state.friendRequestAnchorEl} placement='bottom-end' className={classes.Popper} transition>
                    <ClickAwayListener onClickAway={() => this.setState({ friendRequestOpen: false })}>
                        <Paper>
                            <RequestUsers />
                        </Paper>
                    </ClickAwayListener>
                </Popper>
                <Popper open={this.state.notifyOpen} anchorEl={this.state.notifyAnchorEl} placement='bottom-end' className={classes.Popper} transition>
                    <ClickAwayListener onClickAway={() => this.setState({ notifyOpen: false })}>
                        <Paper>
                            <Notifications />
                        </Paper>
                    </ClickAwayListener>
                </Popper>
            </AppBar>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(authActions.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

