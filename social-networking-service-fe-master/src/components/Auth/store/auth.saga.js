import { takeEvery, all, put } from 'redux-saga/effects';
import * as authActions from './auth.actions';
import axios from 'axios';
import environment from '../../../environment/environment';
import { showSuccess, showInfo } from '../../../shared/SnackBar/SnackBar';

const signUpUrl = environment.SERVER + '/auth/signup';
const loginUrl = environment.SERVER + '/auth/login';
const forgotPasswordUrl = environment.SERVER + '/auth/forgot-password';
const resetPasswordUrl = environment.SERVER + '/auth/reset-password';
const userUrl = environment.SERVER + '/users';

export function* signUp(action) {

    const signUpData = {
        username: action.payload.username,
        password: action.payload.password
    }

    try {
        yield axios.post(signUpUrl, signUpData);
        yield action.payload.history.push('/auth/login');
        yield showSuccess('Registered successfully! Please login to continue');
    } catch (error) {
        console.log(error);
    }
}

export function* login(action) {

    const loginData = {
        username: action.payload.username,
        password: action.payload.password
    }

    try {
        const response = yield axios.post(loginUrl, loginData);
        yield put(authActions.authSuccess(response.data));
        yield localStorage.setItem('token', response.data.token);
        yield action.payload.history.push('/homepage');
    } catch (error) {
        console.log(error);
    }
}

export function* autoLogin(action) {

    try {
        const response = yield axios.get(userUrl + '/token');
        yield put(authActions.authSuccess(response.data));
    } catch (error) {
        console.log(error);
    }
}

export function* forgotPassword(action) {

    const forgotPasswordData = {
        username: action.payload.username
    }

    try {
        yield axios.post(forgotPasswordUrl, forgotPasswordData);
        yield showInfo('Am email has been sent to ' + forgotPasswordData.username);
        yield action.payload.history.push('/auth/login');
    } catch (error) {
        console.log(error);
    }
}

export function* resetPasswordValidate(action) {

    try {
        yield axios.get(resetPasswordUrl + '/' + action.payload.token);
    } catch (error) {
        console.log(error);
        yield action.payload.history.push('/auth/login');
    }
}

export function* resetPassword(action) {

    const resetPasswordData = {
        forgotPasswordToken: action.payload.token,
        password: action.payload.password
    }

    try {
        yield axios.post(resetPasswordUrl, resetPasswordData);
        yield showSuccess('Password reset successful! Please login to continue');
        yield action.payload.history.push('/auth/login');
    } catch (error) {
        console.log(error);
    }
}

export default function* authSaga() {
    yield all([
        takeEvery(authActions.SIGNUP, signUp),
        takeEvery(authActions.LOGIN, login),
        takeEvery(authActions.FORGOT_PASSWORD, forgotPassword),
        takeEvery(authActions.RESET_PASSWORD_START, resetPasswordValidate),
        takeEvery(authActions.RESET_PASSWORD, resetPassword),
        takeEvery(authActions.AUTO_LOGIN, autoLogin)
    ]);
}