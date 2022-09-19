import React, { useState, Fragment } from 'react';
import { Card, Avatar, Box, Typography, IconButton, Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import classes from './Comment.css';
import * as commentActions from '../../../components/Homepage/store/comment/comment.actions';
import { connect } from 'react-redux';
import AddComment from '../AddComment/AddComment';
import { Link } from 'react-router-dom';
import environment from '../../../environment/environment';

const Comment = (props) => {

    console.log('Comment.js render');

    const [editMode, setEditMode] = useState(false);

    const editCommentHandler = () => {
        setEditMode(true);
    }

    const cancelEditHandler = () => {
        setEditMode(false);
    }

    const deleteCommentHandler = () => {
        const payload = {
            commentId: props.comment._id,
            index: props.index,
            postIndex: props.postIndex
        }
        props.deleteComment(payload);
    }

    let editDeleteButton = null;

    if (props.loggedUser._id === props.comment.createdUser._id) {
        editDeleteButton = (
            <Fragment>
                <IconButton className={classes.IconButton} onClick={editCommentHandler}><EditIcon className={classes.EditIcon} /></IconButton>
                <IconButton className={classes.IconButton} onClick={deleteCommentHandler}><DeleteIcon className={classes.EditIcon} /></IconButton>
            </Fragment>
        );
    } else if (props.loggedUser._id === props.postCreatedUser) {
        editDeleteButton = (
            <IconButton className={classes.IconButton} onClick={deleteCommentHandler}><DeleteIcon className={classes.EditIcon} /></IconButton>
        );
    }

    let footer = (
        <Fragment>
            {editDeleteButton}
            <Typography variant='caption'>{new Date(props.comment.createdAt).toLocaleString()}</Typography>
        </Fragment>
    );

    if (editMode) {
        footer = <Button className={classes.IconButton} onClick={cancelEditHandler}><Typography variant='caption'>cancel</Typography></Button>;
    }

    return (
        <Card className={classes.Card}>
            <Box display='flex' flexDirection='row' marginBottom='5px' alignItems='center' position='relative'>
                <Box marginRight='10px'>
                    <Avatar alt={props.comment.createdUser.name} src={environment.SERVER + '/' + props.comment.createdUser.profileImageUrl} className={classes.Avatar} />
                </Box>
                <Box display='flex' flexDirection='column'>
                    <Link to={"/homepage/profile/" + props.comment.createdUser._id} className={classes.Link}>
                        <Typography variant='caption'><b>{props.comment.createdUser.name}</b></Typography>
                    </Link>
                </Box>
            </Box>
            <Box>
                {editMode ? <AddComment comment={props.comment} index={props.index} closeEditMode={cancelEditHandler} /> : <Typography variant='subtitle1'>{props.comment.comment}</Typography>}
            </Box>
            <Box display='flex' flexDirection='row' alignItems='center'>
                {footer}
            </Box>
        </Card>
    );
}

const mapStateToProps = state => {
    return {
        loggedUser: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteComment: (payload) => dispatch(commentActions.deleteComment(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Comment));