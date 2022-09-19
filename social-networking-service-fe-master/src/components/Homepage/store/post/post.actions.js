export const ADD_POST = 'ADD_POST';
export const CREATE_POST = 'CREATE_POST';
export const INITIALIZE_POSTS = 'INITIALIZE_POSTS';
export const CLEAR_POSTS = 'CLEAR_POSTS';
export const FETCH_POSTS = 'FETCH_POSTS';
export const UPDATE_POST = 'UPDATE_POST';
export const MODIFY_POST = 'MODIFY_POST';
export const DELETE_POST = 'DELETE_POST';
export const REMOVE_POST = 'REMOVE_POST';
export const UPDATE_CREATED_USER = 'UPDATE_CREATED_USER';
export const GET_HASHTAG_POSTS = 'GET_HASHTAG_POSTS';
export const LIKE_UNLIKE_POST = 'LIKE_UNLIKE_POST';
export const SET_LIKED = 'SET_LIKED';
export const SET_UNLIKED = 'SET_UNLIKED';
export const INC_COMMENTS_COUNT = 'INC_COMMENTS_COUNT';
export const DEC_COMMENTS_COUNT = 'DEC_COMMENTS_COUNT';

export const addPost = (data) => {
    return {
        type: ADD_POST,
        payload: data
    }
}

export const createPost = (data) => {
    return {
        type: CREATE_POST,
        payload: data
    }
}

export const initializePosts = (data) => {
    return {
        type: INITIALIZE_POSTS,
        payload: data
    }
}

export const clearPosts = () => {
    return {
        type: CLEAR_POSTS
    }
}

export const fetchPosts = () => {
    return {
        type: FETCH_POSTS
    }
}

export const likeUnlikePost = (data) => {
    return {
        type: LIKE_UNLIKE_POST,
        payload: data
    }
}

export const updatePost = (data) => {
    return {
        type: UPDATE_POST,
        payload: data
    }
}

export const modifyPost = (data) => {
    return {
        type: MODIFY_POST,
        payload: data
    }
}

export const deletePost = (data) => {
    return {
        type: DELETE_POST,
        payload: data
    }
}

export const removePost = (data) => {
    return {
        type: REMOVE_POST,
        payload: data
    }
}

export const updateCreatedUser = (data) => {
    return {
        type: UPDATE_CREATED_USER,
        payload: data
    }
}

export const setLiked = (data) => {
    return {
        type: SET_LIKED,
        payload: data
    }
}

export const setUnliked = (data) => {
    return {
        type: SET_UNLIKED,
        payload: data
    }
}

export const incCommentsCount = (data) => {
    return {
        type: INC_COMMENTS_COUNT,
        payload: data
    }
}

export const decCommentsCount = (data) => {
    return {
        type: DEC_COMMENTS_COUNT,
        payload: data
    }
}

export const getHashtagPosts = (data) => {
    return {
        type: GET_HASHTAG_POSTS,
        payload: data
    }
}