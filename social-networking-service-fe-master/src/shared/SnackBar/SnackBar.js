import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

export let showSuccess;
export let showFailure;
export let showInfo;
export let showWarning;

const SnackBar = () => {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('dsfg');
    const [severity, setSeverity] = useState('success');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    showSuccess = (message, autoHideDuration) => {
        setSeverity('success');
        setRemaining(message, autoHideDuration);
    };

    showFailure = (message, autoHideDuration) => {
        setSeverity('error');
        setRemaining(message, autoHideDuration);
    };

    showInfo = (message, autoHideDuration) => {
        setSeverity('info');
        setRemaining(message, autoHideDuration);
    };

    showWarning = (message, autoHideDuration) => {
        setSeverity('warning');
        setRemaining(message, autoHideDuration);
    };

    const setRemaining = (message, autoHideDuration = 5000) => {
        setMessage(message);
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
        }, autoHideDuration);
    }

    return (
        <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleClose}>
            <MuiAlert variant="filled" onClose={handleClose} severity={severity}>
                {message}
            </MuiAlert>
        </Snackbar>
    );
}

export default SnackBar;