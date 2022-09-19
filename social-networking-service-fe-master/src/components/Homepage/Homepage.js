import React, { Component } from 'react';
import { Toolbar, Drawer, List, ListItem, ListItemText, ListItemIcon, Box } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import classes from './Homepage.css';
import { Route, Link } from 'react-router-dom';
import Profile from './Profile/Profile';
import NewsFeed from './NewsFeed/NewsFeed';
import Hashtag from './Hashtag/Hashtag';
import Header from './Header/Header';
import { connect } from 'react-redux';
import Settings from './Settings/Settings';
import NotificationPost from './NotificationPost/NotificationPost';

class Homepage extends Component {

    render() {
        console.log('Homepage.js render');

        const profileUrl = this.props.user ? '/homepage/profile/' + this.props.user._id : '';

        return (
            <Box display='flex'>

                <Header />

                <Drawer variant="permanent" className={classes.Drawer} classes={{ paper: classes.Drawer }}>
                    <Toolbar />
                    <List>
                        <ListItem button selected={this.props.location.pathname === profileUrl}>
                            <Link to={profileUrl} className={classes.Link}>
                                <Box display='flex' flexDirection='row'>
                                    <ListItemIcon><PersonIcon /></ListItemIcon>
                                    <ListItemText primary='Profile' />
                                </Box>
                            </Link>
                        </ListItem>
                        <ListItem button selected={this.props.location.pathname === '/homepage/newsfeed'}>
                            <Link to='/homepage/newsfeed' className={classes.Link}>
                                <Box display='flex' flexDirection='row'>
                                    <ListItemIcon><HomeIcon /></ListItemIcon>
                                    <ListItemText primary='News Feed' />
                                </Box>
                            </Link>
                        </ListItem>
                    </List>
                </Drawer>

                <div className={classes.Width100}>
                    <Toolbar />
                    <Route path='/homepage/profile/:userId' component={Profile} />
                    <Route path='/homepage/newsfeed' component={NewsFeed} />
                    <Route path='/homepage/hashtags/:hashtag' component={Hashtag} />
                    <Route path='/homepage/settings' component={Settings} />
                    <Route path='/homepage/posts/:postId' component={NotificationPost} />
                </div>
            </Box>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(Homepage);