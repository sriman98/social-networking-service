import React from 'react';
import { Box, Avatar, Typography, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classes from './User.css';
import environment from '../../../environment/environment';

const user = (props) => {

    const followUnfollowHandler = (type) => {
        const data = {
            type: type,
            index: props.index
        }
        props.followUnfollowUser(data);
    }

    console.log('User.js render');

    let followButton = null;

    if (props.auth._id === props.user._id) {
        followButton = null;
    } else if (props.user.followedByLoggedUser) {
        followButton = (
            <Button variant='outlined' color='primary' onClick={() => followUnfollowHandler('unfollow')}>Unfollow</Button>
        );
    } else if (props.user.requestedByLoggedUser) {
        followButton = (
            <Button variant='outlined' color='primary' onClick={() => followUnfollowHandler('cancelRequest')}>Requested</Button>
        );
    } else {
        followButton = (
            <Button variant='contained' color='primary' onClick={() => followUnfollowHandler('follow')}>Follow</Button>
        );
    }

    return (
        <Box display='flex' flexDirection='row' position='relative' marginBottom='10px'>
            <Box display='flex' flexDirection='row' alignItems='center'>
                <Box marginRight='20px'><Avatar alt={props.user.name} src={environment.SERVER + '/' + props.user.profileImageUrl} /></Box>
                <Link to={"/homepage/profile/" + props.user._id} className={classes.Link}>
                    <Typography>{props.user.name}</Typography>
                </Link>
            </Box>
            <Box position='absolute' right='0px'>
                {followButton}
            </Box>
        </Box>
    );
}

const mapStateToProps = state => {
    return {
        auth: state.auth.user
    }
}

export default connect(mapStateToProps)(React.memo(user));