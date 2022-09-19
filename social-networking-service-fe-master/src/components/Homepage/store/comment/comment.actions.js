export const ADD_COMMENT = 'ADD_COMMENT';
export const CREATE_COMMENT = 'CREATE_COMMENT';
export const INITIALIZE_COMMENTS = 'INITIALIZE_COMMENTS';
export const GET_COMMENTS = 'GET_COMMENTS';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const REMOVE_COMMENT = 'REMOVE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const MODIFY_COMMENT = 'MODIFY_COMMENT';

export const addComment = (data) => {
    return {
        type: ADD_COMMENT,
        payload: data
    }
}

export const createComment = (data) => {
    return {
        type: CREATE_COMMENT,
        payload: data
    }
}

export const intializeComments = (data) => {
    return {
        type: INITIALIZE_COMMENTS,
        payload: data
    }
}

export const getComments = (data) => {
    return {
        type: GET_COMMENTS,
        payload: data
    }
}

export const deleteComment = (data) => {
    return {
        type: DELETE_COMMENT,
        payload: data
    }
}

export const removeComment = (data) => {
    return {
        type: REMOVE_COMMENT,
        payload: data
    }
}

export const updateComment = (data) => {
    return {
        type: UPDATE_COMMENT,
        payload: data
    }
}

export const modifyComment = (data) => {
    return {
        type: MODIFY_COMMENT,
        payload: data
    }
}