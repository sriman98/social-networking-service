import React, { useState, useEffect } from 'react';
import { Avatar, Box, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import classes from './Notification.css';
import environment from '../../../../environment/environment';

const Notification = (props) => {

    const [text, setText] = useState('');
    const [link, setLink] = useState('/homepage');
    const [linkClass, setLinkClass] = useState([]);

    useEffect(() => {
        switch (props.notification.type) {
            case 'like':
                setText('liked your post');
                setLink('/homepage/posts/' + props.notification.content.postId);
                break;
            case 'comment':
                setText('commented on your post');
                setLink('/homepage/posts/' + props.notification.content.postId + '?commentId=' + props.notification.content.commentId);
                break;
            case 'follow':
                setText('started following you');
                setLink('/homepage/profile/' + props.notification.sender._id);
                break;
            case 'accept_follow_request':
                setText('accepted your follow request');
                setLink('/homepage/profile/' + props.notification.sender._id);
                break;
            default:
                break;
        }
        if (props.notification.read === true) {
            setLinkClass([classes.Link, classes.ColorRead]);
        } else {
            setLinkClass([classes.Link, classes.ColorBlack]);
        }
    }, [props.notification]);

    console.log('Notification.js render');

    return (
        <Link to={link} className={linkClass.join(' ')}>
            <Box display='flex' flexDirection='row' marginTop='10px'>
                <Avatar alt={props.notification.sender.name} src={environment.SERVER + '/' + props.notification.sender.profileImageUrl} />
                <Box display='flex' flexDirection='column' marginLeft='5px'>
                    <Typography variant='subtitle2'><b>{props.notification.sender.name}</b> {text}</Typography>
                    <Typography variant='caption'>{new Date(props.notification.createdAt).toLocaleString()}</Typography>
                </Box>
            </Box>
        </Link>
    );
}

export default React.memo(Notification);