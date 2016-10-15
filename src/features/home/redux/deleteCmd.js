import _ from 'lodash';
import {
  DELETE_CMD_BEGIN,
  DELETE_CMD_SUCCESS,
  DELETE_CMD_FAILURE,
  DELETE_CMD_DISMISS_ERROR,
} from './constants';

export function deleteCmd(cmdId) {
  return (dispatch) => {
    dispatch({
      type: DELETE_CMD_BEGIN,
    });
    const promise = new Promise((resolve) => {
      bridge.ipcRenderer.once('DELETE_CMD_SUCCESS', () => {
        dispatch({
          type: DELETE_CMD_SUCCESS,
          data: { cmdId },
        });
        resolve();
      });

      bridge.ipcRenderer.send('DELETE_CMD', cmdId);
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

    case DELETE_CMD_SUCCESS: {
      const cmdId = action.data.cmdId;
      const cmdIds = state.cmdIds.slice();
      _.pull(cmdIds, cmdId);
      const cmdById = { ...state.cmdById };
      delete cmdById[cmdId];

      return {
        ...state,
        cmdIds,
        cmdById,
      };
    }

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
