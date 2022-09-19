import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { combineReducers, applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import setUpInterceptors from './interceptors/interceptor';

import authReducer from './components/Auth/store/auth.reducer';
import postReducer from './components/Homepage/store/post/post.reducer';
import commentReducer from './components/Homepage/store/comment/comment.reducer';

import authSaga from './components/Auth/store/auth.saga';
import postSaga from './components/Homepage/store/post/post.saga';
import commentSaga from './components/Homepage/store/comment/comment.saga';

const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  posts: postReducer,
  comments: commentReducer
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(authSaga);
sagaMiddleware.run(postSaga);
sagaMiddleware.run(commentSaga);

setUpInterceptors();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
