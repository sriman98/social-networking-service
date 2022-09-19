import { takeEvery, all, put } from 'redux-saga/effects';
import * as commentActions from './comment.actions';
import * as postActions from '../post/post.actions';
import environment from '../../../../environment/environment';
import axios from 'axios';
import { showSuccess } from '../../../../shared/SnackBar/SnackBar';

const commentUrl = environment.SERVER + '/comments';
const postUrl = environment.SERVER + '/posts';

export function* getComments(action) {

    const getCommentsData = {
        postId: action.payload.postId
    }

    try {
        const response = yield axios.post(postUrl + '/comments', getCommentsData);
        yield put(commentActions.intializeComments(response.data.comments));
    } catch (error) {
        console.log(error);
    }
}

export function* createComment(action) {

    const createCommentData = {
        comment: action.payload.comment,
        postId: action.payload.postId
    }

    try {
        const response = yield axios.post(commentUrl, createCommentData);
        yield put(commentActions.addComment(response.data.comment));
        yield put(postActions.incCommentsCount({ index: action.payload.postIndex }));
        yield showSuccess('Comment added successfully');
    } catch (error) {
        console.log(error);
    }
}

export function* modifyComment(action) {

    const modifyCommentData = {
        comment: action.payload.comment
    }

    try {
        const response = yield axios.put(commentUrl + '/' + action.payload.commentId, modifyCommentData);
        yield put(commentActions.updateComment({ index: action.payload.index, comment: response.data.comment }));
        yield showSuccess('Comment updated successfully');
    } catch (error) {
        console.log(error);
    }
}

export function* deleteComment(action) {

    try {
        yield axios.delete(commentUrl + '/' + action.payload.commentId);
        yield put(commentActions.removeComment({ index: action.payload.index }));
        yield put(postActions.decCommentsCount({ index: action.payload.postIndex }));
        yield showSuccess('Comment deleted successfully');
    } catch (error) {
        console.log(error);
    }
}

export default function* commentsSaga() {

    yield all([
        takeEvery(commentActions.CREATE_COMMENT, createComment),
        takeEvery(commentActions.GET_COMMENTS, getComments),
        takeEvery(commentActions.DELETE_COMMENT, deleteComment),
        takeEvery(commentActions.MODIFY_COMMENT, modifyComment)
    ]);
}