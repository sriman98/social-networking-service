import React, { Component } from 'react';
import Comment from './Comment/Comment';
import AddComment from './AddComment/AddComment';
import { Dialog, DialogContent, DialogTitle, IconButton, DialogActions, Box, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import classes from './Comments.css';
import { connect } from 'react-redux';

class Comments extends Component {

    render() {
        console.log('Comments.js render');

        let comments = null;

        if (this.props.comments.length !== 0) {
            comments = (
                this.props.comments.map((comment, index) => (
                    <Comment comment={comment} key={index} index={index} postIndex={this.props.postIndex} postCreatedUser={this.props.postCreatedUser} />
                ))
            );
        } else {
            comments = <Typography className={classes.Empty}>No Comments</Typography>
        }

        return (
            <Dialog open={true} onClose={this.props.closeDialog} fullWidth>
                <DialogTitle>
                    Comments
                <IconButton className={classes.Close} onClick={this.props.closeDialog}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    {comments}
                </DialogContent>
                <DialogActions className={classes.DialogActions}>
                    <Box width='95%'>
                        <AddComment postId={this.props.postId} postIndex={this.props.postIndex} />
                    </Box>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        comments: state.comments.comments
    }
}

export default connect(mapStateToProps)(Comments);