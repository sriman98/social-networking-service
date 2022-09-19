import { takeEvery, all, put } from 'redux-saga/effects';
import * as postActions from './post.actions';
import environment from '../../../../environment/environment';
import axios from 'axios';
import { showSuccess } from '../../../../shared/SnackBar/SnackBar';

const postUrl = environment.SERVER + '/posts';
const hashtagUrl = environment.SERVER + '/hashtags';

export function* createPost(action) {

    const createPostData = {
        postContent: action.payload.postContent
    };

    try {
        const response = yield axios.post(postUrl, createPostData);
        yield put(postActions.addPost(response.data.post));
        yield showSuccess('Post created successfully!');
    } catch (error) {
        console.log(error);
    }
}

export function* deletePost(action) {

    try {
        yield axios.delete(postUrl + '/' + action.payload.postId);
        yield put(postActions.removePost({ index: action.payload.index }));
        yield showSuccess('Post deleted successfully!');
    } catch (error) {
        console.log(error);
    }
}

export function* modifyPost(action) {

    const modifyPostData = {
        postContent: action.payload.postContent
    };

    try {
        const response = yield axios.put(postUrl + '/' + action.payload.postId, modifyPostData);
        yield put(postActions.updatePost({ index: action.payload.index, post: response.data.post }));
        yield showSuccess('Post updated successfully!');
    } catch (error) {
        console.log(error);
    }
}

export function* fetchPosts(action) {

    try {
        const response = yield axios.get(postUrl);
        yield put(postActions.initializePosts(response.data.posts));
    } catch (error) {
        console.log(error);
    }
}

export function* likeUnlikePost(action) {

    const likePostData = {
        postId: action.payload.postId
    }

    try {
        if (action.payload.like) {
            yield axios.post(postUrl + '/like', likePostData);
            yield put(postActions.setLiked({ index: action.payload.index }));
        } else {
            yield axios.post(postUrl + '/unlike', likePostData)
            yield put(postActions.setUnliked({ index: action.payload.index }));
        }
    } catch (error) {
        console.log(error);
    }
}

export function* getHashtagPosts(action) {

    try {
        const response = yield axios.get(hashtagUrl + '/' + action.payload.hashtag);
        yield put(postActions.initializePosts(response.data.posts));
    } catch (error) {
        console.log(error);
    }
}

export default function* postsSaga() {

    yield all([
        takeEvery(postActions.CREATE_POST, createPost),
        takeEvery(postActions.FETCH_POSTS, fetchPosts),
        takeEvery(postActions.LIKE_UNLIKE_POST, likeUnlikePost),
        takeEvery(postActions.DELETE_POST, deletePost),
        takeEvery(postActions.MODIFY_POST, modifyPost),
        takeEvery(postActions.GET_HASHTAG_POSTS, getHashtagPosts)
    ]);
}