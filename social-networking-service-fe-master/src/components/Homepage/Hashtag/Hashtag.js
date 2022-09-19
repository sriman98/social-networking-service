import React, { Component } from 'react';
import Posts from '../../../shared/Posts/Posts';
import * as postActions from '../store/post/post.actions';
import { connect } from 'react-redux';
import classes from './Hashtag.css';
import { Card, Avatar, Box, Typography } from '@material-ui/core';
import HashtagImage from '../../../assets/hashtag.jpg';

class Hashtag extends Component {

    componentWillMount() {
        this.props.clearPosts();
        const payload = {
            hashtag: this.props.match.params.hashtag
        }
        this.props.getHashtagPosts(payload);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.match.params.hashtag !== nextProps.match.params.hashtag) {
            this.props.clearPosts();
            const payload = {
                hashtag: nextProps.match.params.hashtag
            }
            this.props.getHashtagPosts(payload);
            return true;
        }
        return false;
    }

    render() {
        console.log('Hashtag.js render');
        return (
            <div className={classes.Root}>
                <Card className={classes.Card}>
                    <Box display='flex' flexDirection='row' alignItems='center'>
                        <Box marginRight='30px' marginLeft='30px'>
                            <Avatar alt='#' src={HashtagImage} className={classes.Avatar} />
                        </Box>
                        <Box>
                            <Typography variant='h4'>#{this.props.match.params.hashtag}</Typography>
                            <Typography variant='subtitle2'>Explore</Typography>
                        </Box>
                    </Box>
                </Card>
                <div className={classes.Posts}>
                    <Posts />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getHashtagPosts: (payload) => dispatch(postActions.getHashtagPosts(payload)),
        clearPosts: () => dispatch(postActions.clearPosts())
    }
}

export default connect(null, mapDispatchToProps)(Hashtag);