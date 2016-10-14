import {
  DELETE_CMD_BEGIN,
  DELETE_CMD_SUCCESS,
  DELETE_CMD_FAILURE,
  DELETE_CMD_DISMISS_ERROR,
} from './constants';

export function deleteCmd(args) {
  return (dispatch) => {
    dispatch({
      type: DELETE_CMD_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (!args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: DELETE_CMD_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: DELETE_CMD_FAILURE,
            data: {
              error: 'some error',
            },
          });
          reject();
        }
      }, 50);
    });

    return promise;
  };
}

export function dismissDeleteCmdError() {
  return {
    type: DELETE_CMD_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case DELETE_CMD_BEGIN:
      return {
        ...state,
        deleteCmdPending: true,
        deleteCmdError: null,
      };

    case DELETE_CMD_SUCCESS:
      return {
        ...state,
        deleteCmdPending: false,
        deleteCmdError: null,
      };

    case DELETE_CMD_FAILURE:
      return {
        ...state,
        deleteCmdPending: false,
        deleteCmdError: action.data.error,
      };

    case DELETE_CMD_DISMISS_ERROR:
      return {
        ...state,
        deleteCmdError: null,
      };

    default:
      return state;
  }
}
