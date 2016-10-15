import {
  SAVE_CMD_BEGIN,
  ADD_CMD_SUCCESS,
  SAVE_CMD_SUCCESS,
  SAVE_CMD_FAILURE,
  SAVE_CMD_DISMISS_ERROR,
} from './constants';

export function saveCmd(data, cmdId) {
  return (dispatch) => {
    dispatch({
      type: SAVE_CMD_BEGIN,
    });
    const promise = new Promise((resolve) => {
      bridge.ipcRenderer.once('SAVE_CMD_SUCCESS', (evt, cmd) => {
        dispatch({
          type: SAVE_CMD_SUCCESS,
          data: { cmd, cmdId },
        });
        resolve();
      });

      bridge.ipcRenderer.send('SAVE_CMD', data, cmdId);
    });

    return promise;
  };
}

export function dismissSaveCmdError() {
  return {
    type: SAVE_CMD_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case SAVE_CMD_BEGIN:
      return {
        ...state,
        saveCmdPending: true,
        saveCmdError: null,
      };

    case SAVE_CMD_SUCCESS:
      return {
        ...state,
        [action.data.cmdId ? null : 'cmdIds']: [...state.cmdIds, action.data.cmd.id],
        cmdById: {
          ...state.cmdById,
          [action.data.cmd.id]: {
            ...state.cmdById[action.data.cmd.id] || {},
            ...action.data.cmd,
            [action.data.cmdId ? null : 'status']: 'stopped',
          },
        },
      };

    case SAVE_CMD_FAILURE:
      return {
        ...state,
        saveCmdPending: false,
        saveCmdError: action.data.error,
      };

    case SAVE_CMD_DISMISS_ERROR:
      return {
        ...state,
        saveCmdError: null,
      };

    default:
      return state;
  }
}
