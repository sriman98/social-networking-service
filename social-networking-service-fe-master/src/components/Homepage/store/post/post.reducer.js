import * as postActions from './post.actions';

const initialState = {
    posts: []
}

const postsReducer = (state = initialState, action) => {

    let updatedPost = null;
    let updatedPosts = null;

    switch (action.type) {
        case postActions.INITIALIZE_POSTS:
            return {
                ...state,
                posts: action.payload
            }
        case postActions.UPDATE_POST:
            updatedPost = { ...state.posts[action.payload.index], ...action.payload.post };
            updatedPosts = [...state.posts];
            updatedPosts[action.payload.index] = updatedPost;
            return {
                ...state,
                posts: updatedPosts
            }
        case postActions.SET_LIKED:
            updatedPost = {
                ...state.posts[action.payload.index],
                likes_count: state.posts[action.payload.index].likes_count + 1,
                likedByLoggedUser: true
            }
            updatedPosts = [...state.posts];
            updatedPosts[action.payload.index] = updatedPost;
            return {
                ...state,
                posts: updatedPosts
            }
        case postActions.SET_UNLIKED:
            updatedPost = {
                ...state.posts[action.payload.index],
                likes_count: state.posts[action.payload.index].likes_count - 1,
                likedByLoggedUser: false
            }
            updatedPosts = [...state.posts];
            updatedPosts[action.payload.index] = updatedPost;
            return {
                ...state,
                posts: updatedPosts
            }
        case postActions.INC_COMMENTS_COUNT:
            updatedPost = {
                ...state.posts[action.payload.index],
                comments_count: state.posts[action.payload.index].comments_count + 1
            }
            updatedPosts = [...state.posts];
            updatedPosts[action.payload.index] = updatedPost;
            return {
                ...state,
                posts: updatedPosts
            }
        case postActions.DEC_COMMENTS_COUNT:
            updatedPost = {
                ...state.posts[action.payload.index],
                comments_count: state.posts[action.payload.index].comments_count - 1
            }
            updatedPosts = [...state.posts];
            updatedPosts[action.payload.index] = updatedPost;
            return {
                ...state,
                posts: updatedPosts
            }
        case postActions.ADD_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            }
        case postActions.REMOVE_POST:
            updatedPosts = [...state.posts];
            updatedPosts.splice(action.payload.index, 1);
            return {
                ...state,
                posts: updatedPosts
            }
        case postActions.UPDATE_CREATED_USER:
            updatedPosts = [...state.posts];
            updatedPosts = updatedPosts.map(post => { return { ...post, createdUser: action.payload.user }});
            return {
                ...state,
                posts: updatedPosts
            }
        case postActions.CLEAR_POSTS:
            return {
                ...state,
                posts: initialState.posts
            }
        default:
            return state;
    }
}

export default postsReducer;