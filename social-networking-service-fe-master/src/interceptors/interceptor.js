import axios from 'axios';
import { showFailure } from '../shared/SnackBar/SnackBar';
import { startLoading, stopLoading } from '../shared/Spinner/Spinner';

const setUpInterceptors = () => {

    axios.interceptors.request.use(req => {
        startLoading();
        const modifiedReq = req;
        const token = localStorage.getItem('token');
        if (token) {
            modifiedReq.headers.Authorization = 'Bearer ' + token;
        }
        return modifiedReq;
    });

    axios.interceptors.response.use(
        res => {
            stopLoading();
            return res;
        },
        error => {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location = '/auth/login';
            }
            showFailure(error.response.data.message);
            stopLoading();
            return Promise.reject(error);
        });

}

export default setUpInterceptors;