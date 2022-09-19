import * as authActions from './auth.actions';

const initialState = {
    user: {
        _id: null,
        name: '',
        username: '',
        token: '',
        profileImageUrl: '',
        privateAccount: false
    }
};

const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case authActions.AUTH_SUCCESS:
            return {
                ...state,
                user: action.payload
            }
        case authActions.UPDATE_USER:
            const updatedUser = { ...state.user, ...action.payload.user };
            return {
                ...state,
                user: updatedUser
            }
        case authActions.LOGOUT:
            return {
                ...state,
                user: initialState.user
            }
        default:
            return state;
    }
}

export default authReducer;