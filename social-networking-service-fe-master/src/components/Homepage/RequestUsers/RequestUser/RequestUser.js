import React from 'react';
import { Box, Avatar, Typography, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import classes from './RequestUser.css';
import environment from '../../../../environment/environment';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const requestUser = (props) => {

    const acceptCancelUser = (type) => {
        const data = {
            type: type,
            index: props.index
        }
        props.acceptCancelUser(data);
    }

    console.log('RequestUser.js render');

    return (
        <Box display='flex' flexDirection='row' position='relative' marginBottom='10px'>
            <Box display='flex' flexDirection='row' alignItems='center'>
                <Box marginRight='20px'><Avatar alt={props.user.name} src={environment.SERVER + '/' + props.user.profileImageUrl} /></Box>
                <Link to={"/homepage/profile/" + props.user._id} className={classes.Link}>
                    <Typography>{props.user.name}</Typography>
                </Link>
            </Box>
            <Box display='flex' flexDirection='row' position='absolute' right='0px'>
                <IconButton className={classes.ColorRed} onClick={() => acceptCancelUser('cancel')}><CancelIcon /></IconButton>
                <IconButton color='primary' onClick={() => acceptCancelUser('accept')}><CheckCircleIcon /></IconButton>
            </Box>
        </Box>
    );
}

export default React.memo(requestUser);