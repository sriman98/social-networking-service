import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextareaAutosize, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import classes from './AddPost.css';
import * as postActions from '../../components/Homepage/store/post/post.actions';
import { connect } from 'react-redux';

const AddPost = (props) => {

    const [postContent, setPostContent] = useState('');

    useEffect(() => {
        if (props.post) {
            setPostContent(props.post.content);
        }
    }, [props.post]);

    const inputChangeHandler = (event) => {
        setPostContent(event.target.value);
    }

    const createUpdatePost = () => {
        const payload = {
            postContent: postContent
        }
        if (props.post) {
            payload.index = props.index;
            payload.postId = props.post._id;
            props.modifyPost(payload);
        } else {
            props.createPost(payload);
            setPostContent('');
        }
        props.closeDialog();
    }

    console.log('AddPost.js render');

    return (
        <Dialog open={true} onClose={props.closeDialog} fullWidth>
            <DialogTitle>
                {props.post ? 'Update Post' : 'Create Post'}
                <IconButton className={classes.Close} onClick={props.closeDialog}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                <TextareaAutosize value={postContent} onChange={inputChangeHandler} rowsMin='10' placeholder="What's on your mind" className={classes.TextArea} />
            </DialogContent>
            <DialogActions>
                <Button color='primary' variant='contained' disabled={!postContent} onClick={createUpdatePost}>{props.post ? 'Update' : 'Post'}</Button>
            </DialogActions>
        </Dialog>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        createPost: (payload) => dispatch(postActions.createPost(payload)),
        modifyPost: (payload) => dispatch(postActions.modifyPost(payload))
    }
}

export default connect(null, mapDispatchToProps)(AddPost);