import React, { Fragment } from 'react';
import Post from './Post/Post';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import classes from './Posts.css';

const Posts = (props) => {

    console.log('Posts.js render');

    let renderElement = null;

    if (props.posts.length !== 0) {
        renderElement = (
            props.posts.map((post, index) => (
                <Post post={post} index={index} key={index} />
            ))
        );
    } else {
        renderElement = (
            <Typography className={classes.Empty}>No Posts</Typography>
        );
    }

    return (
        <Fragment>
            {renderElement}
        </Fragment>
    );
}

const mapStateToProps = state => {
    return {
        posts: state.posts.posts
    }
}

export default connect(mapStateToProps)(React.memo(Posts));