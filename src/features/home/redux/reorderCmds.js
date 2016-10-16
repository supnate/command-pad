import _ from 'lodash';
import {
  REORDER_CMDS_BEGIN,
  REORDER_CMDS_SUCCESS,
  REORDER_CMDS_FAILURE,
  REORDER_CMDS_DISMISS_ERROR,
} from './constants';

export function reorderCmds(cmdIds) {
  return (dispatch) => {
    dispatch({
      type: REORDER_CMDS_BEGIN,
    });
    const promise = new Promise((resolve) => {
      bridge.ipcRenderer.once('REORDER_CMDS_SUCCESS', () => {
        dispatch({
          type: REORDER_CMDS_SUCCESS,
          data: { cmdIds },
        });
        resolve();
      });

      bridge.ipcRenderer.send('REORDER_CMDS', cmdIds);
    });

    return promise;
  };
}

export function dismissReorderCmdsError() {
  return {
    type: REORDER_CMDS_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case REORDER_CMDS_BEGIN:
      return {
        ...state,
        reorderCmdsPending: true,
        reorderCmdsError: null,
      };

    case REORDER_CMDS_SUCCESS:
      return {
        ...state,
        cmdIds: action.data.cmdIds,
        reorderCmdsPending: false,
        reorderCmdsError: null,
      };

    case REORDER_CMDS_FAILURE:
      return {
        ...state,
        reorderCmdsPending: false,
        reorderCmdsError: action.data.error,
      };

    case REORDER_CMDS_DISMISS_ERROR:
      return {
        ...state,
        reorderCmdsError: null,
      };

    default:
      return state;
  }
}
