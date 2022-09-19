import React, { useState, useEffect } from 'react';
import { Button, Box, IconButton } from '@material-ui/core';
import classes from './AddComment.css';
import SaveIcon from '@material-ui/icons/Save';
import * as commentActions from '../../../components/Homepage/store/comment/comment.actions';
import { connect } from 'react-redux';

const AddComment = (props) => {

    const [comment, setComment] = useState('');

    useEffect(() => {
        if (props.comment) {
            setComment(props.comment.comment);
        }
    }, [props.comment]);

    const inputChangeHandler = (event) => {
        setComment(event.target.value);
    }

    const createCommentHandler = () => {
        const createCommentData = {
            comment: comment,
            postId: props.postId,
            postIndex: props.postIndex
        }
        props.createComment(createCommentData);
        setComment('');
    }

    const updateCommentHandler = () => {
        const modifyCommentData = {
            comment: comment,
            commentId: props.comment._id,
            index: props.index
        }
        props.modifyComment(modifyCommentData);
        props.closeEditMode();
    }

    console.log('AddComment.js render');

    let postButton = (
        <Button color='primary' variant='contained' disabled={!comment} onClick={createCommentHandler}>Post</Button>
    );

    if (props.comment) {
        postButton = (
            <IconButton disabled={!comment} color='primary' onClick={updateCommentHandler}><SaveIcon /></IconButton>
        );
    }

    return (
        <Box display='flex' flexDirection='row' alignItems='center' width='100%'>
            <Box width='90%' marginRight='10px'>
                <input type='text' placeholder='Write a comment...' value={comment} onChange={inputChangeHandler} className={classes.Input} />
            </Box>
            <Box width='10%'>
                {postButton}
            </Box>
        </Box>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        createComment: (payload) => dispatch(commentActions.createComment(payload)),
        modifyComment: (payload) => dispatch(commentActions.modifyComment(payload))
    }
}

export default connect(null, mapDispatchToProps)(AddComment);