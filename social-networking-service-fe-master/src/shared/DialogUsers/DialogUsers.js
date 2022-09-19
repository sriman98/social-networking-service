import React from 'react';
import Users from '../Users/Users';
import { Dialog, DialogContent } from '@material-ui/core';

const dialogUsers = (props) => {

    return (
        <Dialog open={true} onClose={props.closeDialog} fullWidth>
        <DialogContent>
            <Users {...props} />
        </DialogContent>
    </Dialog>
    );
}

export default React.memo(dialogUsers);