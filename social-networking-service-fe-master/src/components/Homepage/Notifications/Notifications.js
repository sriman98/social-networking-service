import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@material-ui/core';
import classes from './Notifications.css';
import Notification from './Notification/Notification';
import axios from 'axios';
import environment from '../../../environment/environment';

const Notifications = () => {

    const notificationUrl = environment.SERVER + '/notifications';

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        console.log('Notifications.js componentDidMount');
        axios.get(notificationUrl)
            .then(response => setNotifications(response.data.notifications));
    }, [notificationUrl]);

    console.log('Notifications.js render');

    return (
        <div className={classes.Root}>
            <Box marginBottom='10px'>
                <Typography variant='h6'>Notifications</Typography>
            </Box>
            <Box>
                {notifications.map((notification, index) => (
                    <Notification notification={notification} key={index} index={index} />
                ))}
            </Box>
        </div>
    );
}

export default React.memo(Notifications);