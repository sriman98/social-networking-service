import React, { useEffect } from 'react';
import classes from './NotificationPost.css';
import axios from 'axios';
import environment from '../../../environment/environment';
import * as postActions from '../store/post/post.actions';
import { connect } from 'react-redux';
import Posts from '../../../shared/Posts/Posts';

const NotificationPost = (props) => {

    const postUrl = environment.SERVER + '/posts';
    const postId = props.match.params.postId;

    const initializePosts = props.initializePosts;

    useEffect(() => {
        axios.get(postUrl + '/' + postId)
            .then(response => initializePosts([response.data.post]));
    }, [postUrl, postId, initializePosts]);

    console.log('NotificationPost.js render');

    return (
        <div className={classes.Root}>
            <Posts />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        posts: state.posts.posts
    }
}

const mapDispatchToProps = dispatch => {
    return {
        initializePosts: (payload) => dispatch(postActions.initializePosts(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(NotificationPost));