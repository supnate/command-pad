import { findCmd, replaceCmd } from '../utils';
import {
  RUN_CMD_BEGIN,
  RUN_CMD_SUCCESS,
  RUN_CMD_FAILURE,
  RUN_CMD_DISMISS_ERROR,
} from './constants';

export function runCmd(cmdId) {
  return (dispatch) => {
    dispatch({
      type: RUN_CMD_BEGIN,
      data: { cmdId },
    });
    const promise = new Promise((resolve, reject) => {
      bridge.ipcRenderer.once('RUN_CMD_SUCCESS', (evt) => {
        dispatch({
          type: RUN_CMD_SUCCESS,
          data: { cmdId },
        });
        resolve();
      });

      // Seems no need to handle RUN_CMD_FAILURE
      // bridge.ipcRenderer.once('RUN_CMD_FAILURE', (evt, error) => {
      //   dispatch({
      //     type: RUN_CMD_FAILURE,
      //     data: { cmdId, error },
      //   });
      //   reject();
      // });

      bridge.ipcRenderer.send('RUN_CMD', cmdId);
    });

    return promise;
  };
}

export function dismissRunCmdError() {
  return {
    type: RUN_CMD_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case RUN_CMD_BEGIN:
      return {
        ...state,
        cmdById: {
          ...state.cmdById,
          [action.data.cmdId]: {
            ...state.cmdById[action.data.cmdId],
            status: 'starting',
            error: null,
          },
        },
      };

    case RUN_CMD_SUCCESS:
      return {
        ...state,
        cmdById: {
          ...state.cmdById,
          [action.data.cmdId]: {
            ...state.cmdById[action.data.cmdId],
            status: 'running',
            error: null,
          },
        },
      };

    case RUN_CMD_FAILURE:
      return {
        ...state,
        cmdById: {
          ...state.cmdById,
          [action.data.cmdId]: {
            ...state.cmdById[action.data.cmdId],
            status: 'stopped',
            error: action.data.error,
          },
        },
      };

    case RUN_CMD_DISMISS_ERROR:
      return {
        ...state,
        cmdById: {
          ...state.cmdById,
          [action.data.cmdId]: {
            ...state.cmdById[action.data.cmdId],
            runCmdError: null,
          },
        },
      };

    default:
      return state;
  }
}
