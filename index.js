const BASE_URL = 'https://jsonplaceholder.typicode.com';
const ERROR_MESSAGE = 'Something goes wrong';
const SET_TIMEOUT_DELAY = 2000;

const ActionType = {
  GET_POSTS: 'data/GetPosts',
  GET_COMMENTS: 'data/getComments',
};

const ApiRoute = {
  POSTS: '/posts?_limit=10',
  COMMENTS: '/comments?_limit=10',
}

const getPosts = (posts) => ({
  type: ActionType.GET_POSTS,
  payload: posts,
});

const getComments = (comments) => ({
  type: ActionType.GET_COMMENTS,
  payload: comments,
});

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_POSTS:
      return {...state, posts: action.payload};
    case ActionType.GET_COMMENTS:
      return {...state, comments: action.payload};
    default:
      return state;
  }
};

const createStore = (reducer) => {
  let state = {};
  return {
    dispatch(action) {
      state = reducer(state, action);
    },
    getState() {
      return state;
    },
  };
};

const thunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    action(store);
    return;
  }
  return next(action);
};

const assyncLoadPosts = () => ({dispatch, _getState}) => {
  fetch(`${BASE_URL}${ApiRoute.POSTS}`)
    .then((response) => response.json())
    .then((data) => dispatch(getPosts(data)))
    .catch(() => console.log(ERROR_MESSAGE));
};

const assyncLoadComments = () => ({dispatch, _getState}) => {
  fetch(`${BASE_URL}${ApiRoute.COMMENTS}`)
    .then((response) => response.json())
    .then((data) => dispatch(getComments(data)))
    .catch(() => console.log(ERROR_MESSAGE));
}

const createStoreWithMiddleware = (middleware) => (createStore) => {
  const store = createStore(reducer);
  return {
    dispatch(action) {
      middleware(store)(store.dispatch)(action);
    },
    getState() {
      return store.getState();
    }
  };
};

const assyncStore = createStoreWithMiddleware(thunkMiddleware)(createStore);
assyncStore.dispatch(assyncLoadPosts());
assyncStore.dispatch(assyncLoadComments());

setTimeout(() => {
  console.log(assyncStore.getState());
}, SET_TIMEOUT_DELAY);
