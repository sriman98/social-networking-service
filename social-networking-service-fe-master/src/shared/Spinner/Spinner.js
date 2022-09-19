import React, { useState } from 'react';
import { Fade, CircularProgress } from '@material-ui/core';
import classes from './Spinner.css';

export let startLoading;
export let stopLoading;

const Spinner = () => {

    const [loading, setLoading] = useState(false);

    startLoading = () => {
        setLoading(true);
    }

    stopLoading = () => {
        setLoading(false);
    }

    return (
        <Fade in={loading} unmountOnExit>
            <CircularProgress className={classes.Spinner} variant="indeterminate" />
        </Fade>
    );
}

export default Spinner;