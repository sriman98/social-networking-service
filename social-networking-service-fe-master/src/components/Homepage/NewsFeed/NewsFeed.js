import React, { Component } from 'react';
import Posts from '../../../shared/Posts/Posts';
import classes from './NewsFeed.css';
import * as postActions from '../store/post/post.actions';
import { connect } from 'react-redux';
import { Box, Card, Typography, Divider } from '@material-ui/core';
import axios from 'axios';
import environment from '../../../environment/environment';
import { Link } from 'react-router-dom';
import Users from '../../../shared/Users/Users';

class NewsFeed extends Component {

    state = {
        trendingHashtags: []
    }

    hashtagUrl = environment.SERVER + '/hashtags';
    userUrl = environment.SERVER + '/users';

    componentWillMount() {
        this.props.clearPosts();
    }

    componentDidMount() {
        this.props.fetchPosts();
        axios.get(this.hashtagUrl + '/trending')
            .then(response => {
                this.setState({ trendingHashtags: response.data.hashtags });
            });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true;
        }
        return false;
    }

    render() {
        console.log('NewsFeed.js render');
        return (
            <Box className={classes.Root} display='flex' flexDirection='row'>
                <Box width='70%' marginRight='2rem' className={classes.PostsBox}>
                    <Posts />
                </Box>
                <Box width='30%' display='flex' flexDirection='column'>
                    <Card className={classes.Card}>
                        <Typography>Suggestions</Typography>
                        <Divider />
                        <Box marginTop='10px'>
                            <Users type='suggestions' />
                        </Box>
                    </Card>
                    <Card className={classes.Card}>
                        <Typography>Trending Hashtags</Typography>
                        <Divider />
                        {this.state.trendingHashtags.map(hashtag => (
                            <Box display='flex' marginTop='5px' marginBottom='5px' flexDirection='column'>
                                <Link className={classes.Link} to={'/homepage/hashtags/' + hashtag._id}>#{hashtag._id}</Link>
                                <Typography variant='caption'>{hashtag.count} {hashtag.count > 1 ? 'mentions' : 'mention'}</Typography>
                            </Box>
                        ))}
                    </Card>
                </Box>
            </Box>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPosts: () => dispatch(postActions.fetchPosts()),
        clearPosts: () => dispatch(postActions.clearPosts())
    }
}

export default connect(null, mapDispatchToProps)(NewsFeed);