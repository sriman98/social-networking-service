import React, { useState, useEffect, Fragment } from 'react';
import { Card, Avatar, Box, Typography, IconButton, Menu, MenuItem, Divider, Button } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';
import classes from './Post.css';
import * as postActions from '../../../components/Homepage/store/post/post.actions';
import * as commentActions from '../../../components/Homepage/store/comment/comment.actions';
import { connect } from 'react-redux';
import Comments from '../../Comments/Comments';
import AddPost from '../../AddPost/AddPost';
import DialogUsers from '../../../shared/DialogUsers/DialogUsers';
import { Link } from 'react-router-dom';
import environment from '../../../environment/environment';

const Post = (props) => {

    console.log('Post.js render');

    const [anchorEl, setAnchorEl] = useState(null);
    const [openComments, setOpenComments] = useState(false);
    const [updatePost, setUpdatePost] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [content, setContent] = useState('');

    useEffect(() => {
        const cont = [];
        if (props.post) {
            let i = 0;
            while (i < props.post.content.length) {
                if (props.post.content[i] !== '#') {
                    cont.push(props.post.content[i]);
                    i++;
                } else {
                    let text = '';
                    while (props.post.content[i] !== ' ' && i < props.post.content.length) {
                        text = text + props.post.content[i];
                        i++;
                    }
                    cont.push(<Link className={classes.Link} to={'/homepage/hashtags/' + text.substring(1)}>{text}</Link>);
                }
            }
            setContent(cont);
        }
    }, [props.post]);

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const closeMenu = () => {
        setAnchorEl(null);
    }

    const likeUnlikeHandler = () => {
        const likePostData = {
            postId: props.post._id,
            index: props.index,
            like: !props.post.likedByLoggedUser
        }
        props.likeUnlikePost(likePostData);
    }

    const openCommentsHandler = () => {
        const getCommentsData = {
            postId: props.post._id
        }
        props.getComments(getCommentsData);
        setOpenComments(true);
    }

    const closeCommentsHandler = () => {
        setOpenComments(false);
    }

    const deletePostHandler = () => {
        const deletePostData = {
            postId: props.post._id,
            index: props.index
        }
        props.deletePost(deletePostData);
        setAnchorEl(null);
    }

    const updatePostHandler = () => {
        setUpdatePost(true);
        setAnchorEl(null);
    }

    const closeUpdatePostHandler = () => {
        setUpdatePost(false);
    }

    const likesHandler = () => {
        setShowUsers(true);
    }

    const closeUsersHandler = () => {
        setShowUsers(false);
    }

    let updateDeleteMenu = null;

    if (props.loggedUser._id === props.post.createdUser._id) {
        updateDeleteMenu = (
            <Fragment>
                <IconButton aria-controls="simple-menu" onClick={openMenu} className={classes.MoreButton}><MoreHorizIcon /></IconButton>
                <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                    <MenuItem onClick={updatePostHandler}>Update</MenuItem>
                    <MenuItem onClick={deletePostHandler}>Delete</MenuItem>
                </Menu>
            </Fragment>
        );
    }

    return (

        <Card className={classes.Card}>
            <Box display='flex' flexDirection='row' marginBottom='20px' alignItems='center' position='relative'>
                <Box marginRight='10px'>
                    <Avatar alt={props.post.createdUser.name} src={props.post.createdUser.profileImageUrl ? environment.SERVER + '/' + props.post.createdUser.profileImageUrl : ''} />
                </Box>
                <Box display='flex' flexDirection='column'>
                    <Link to={"/homepage/profile/" + props.post.createdUser._id} className={classes.Link}>
                        <Typography variant='subtitle1'><b>{props.post.createdUser.name}</b></Typography>
                    </Link>
                    <Typography variant='subtitle2'>{new Date(props.post.createdAt).toLocaleString()}</Typography>
                </Box>
                {updateDeleteMenu}
            </Box>
            <Box marginBottom='20px'>
                <Typography className={classes.Typography}>{content}</Typography>
            </Box>
            <Divider />
            <Box display='flex' flexDirection='row'>
                <Button className={classes.LikesButton} onClick={likesHandler}>{props.post.likes_count} {props.post.likes_count === 1 ? 'like' : 'likes'}</Button>
                <Button className={classes.LikesButton} onClick={openCommentsHandler}>{props.post.comments_count} {props.post.comments_count === 1 ? 'comment' : 'comments'}</Button>
            </Box>
            <Divider />
            <Box marginTop='10px' display='flex' flexDirection='row'>
                <Box marginRight='20px'>
                    <Button
                        startIcon={props.post.likedByLoggedUser ? <ThumbUpIcon color='primary' /> : <ThumbUpOutlinedIcon />}
                        onClick={likeUnlikeHandler}>
                        Like
                    </Button>
                </Box>
                <Box>
                    <Button startIcon={<CommentOutlinedIcon />} onClick={openCommentsHandler}>Comment</Button>
                </Box>
            </Box>
            {openComments ? <Comments postId={props.post._id} postIndex={props.index} postCreatedUser={props.post.createdUser._id} closeDialog={closeCommentsHandler} /> : null}
            {updatePost ? <AddPost post={props.post} index={props.index} closeDialog={closeUpdatePostHandler} /> : null}
            {showUsers ? <DialogUsers type='likes' id={props.post._id} closeDialog={closeUsersHandler} /> : null}
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
        likeUnlikePost: (payload) => dispatch(postActions.likeUnlikePost(payload)),
        getComments: (payload) => dispatch(commentActions.getComments(payload)),
        deletePost: (payload) => dispatch(postActions.deletePost(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Post));