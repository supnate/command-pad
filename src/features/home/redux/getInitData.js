import {
  GET_INIT_DATA_BEGIN,
  GET_INIT_DATA_SUCCESS,
  GET_INIT_DATA_FAILURE,
  GET_INIT_DATA_DISMISS_ERROR,
} from './constants';

export function getInitData() {
  return (dispatch) => {
    dispatch({
      type: GET_INIT_DATA_BEGIN,
    });
    const promise = new Promise((resolve) => {
      bridge.ipcRenderer.once('SET_INIT_DATA', (evt, data) => {
        dispatch({
          type: GET_INIT_DATA_SUCCESS,
          data,
        });
        resolve();
      });

      bridge.ipcRenderer.send('GET_INIT_DATA');
    });

    return promise;
  };
}

export function dismissGetInitDataError() {
  return {
    type: GET_INIT_DATA_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case GET_INIT_DATA_BEGIN:
      return {
        ...state,
        getInitDataPending: true,
        getInitDataError: null,
      };

    case GET_INIT_DATA_SUCCESS:
      return {
        ...state,
        appVersion: action.data.appVersion,
        cmds: action.data.cmds,
        getInitDataPending: false,
        getInitDataError: null,
      };

    case GET_INIT_DATA_FAILURE:
      return {
        ...state,
        getInitDataPending: false,
        getInitDataError: action.data.error,
      };

    case GET_INIT_DATA_DISMISS_ERROR:
      return {
        ...state,
        getInitDataError: null,
      };

    default:
      return state;
  }
}
