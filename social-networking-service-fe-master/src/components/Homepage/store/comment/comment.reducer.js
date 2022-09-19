import * as commentActions from './comment.actions';

const initialState = {
    comments: []
}

const commentReducer = (state = initialState, action) => {

    switch (action.type) {
        case commentActions.INITIALIZE_COMMENTS:
            return {
                ...state,
                comments: action.payload
            }
        case commentActions.ADD_COMMENT:
            return {
                ...state,
                comments: [action.payload, ...state.comments]
            }
        case commentActions.UPDATE_COMMENT:
            const updatedComment = { ...state.comments[action.payload.index], ...action.payload.comment };
            const updatedComments = [...state.comments];
            updatedComments[action.payload.index] = updatedComment;
            return {
                ...state,
                comments: updatedComments
            }
        case commentActions.REMOVE_COMMENT:
            const modifiedComments = [...state.comments];
            modifiedComments.splice(action.payload.index, 1);
            return {
                ...state,
                comments: modifiedComments
            }
        default:
            return state;
    }
}

export default commentReducer;