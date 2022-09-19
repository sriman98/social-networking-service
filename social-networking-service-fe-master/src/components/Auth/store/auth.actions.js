export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const RESET_PASSWORD_START = 'RESET_PASSWORD_START';
export const AUTO_LOGIN = 'AUTO_LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER = 'UPDATE_USER';

export const signUp = (data) => {
    return {
        type: SIGNUP,
        payload: data
    }
}

export const login = (data) => {
    return {
        type: LOGIN,
        payload: data
    }
}

export const authSuccess = (data) => {
    return {
        type: AUTH_SUCCESS,
        payload: data
    }
}

export const forgotPassword = (data) => {
    return {
        type: FORGOT_PASSWORD,
        payload: data
    }
}

export const resetPassword = (data) => {
    return {
        type: RESET_PASSWORD,
        payload: data
    }
}

export const resetPasswordStart = (data) => {
    return {
        type: RESET_PASSWORD_START,
        payload: data
    }
}

export const autoLogin = () => {
    return {
        type: AUTO_LOGIN
    }
}

export const logout = () => {
    return {
        type: LOGOUT
    }
}

export const updateUser = (data) => {
    return {
        type: UPDATE_USER,
        payload: data
    }
}