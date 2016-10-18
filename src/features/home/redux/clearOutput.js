import {
  CLEAR_OUTPUT_BEGIN,
  CLEAR_OUTPUT_SUCCESS,
  CLEAR_OUTPUT_FAILURE,
  CLEAR_OUTPUT_DISMISS_ERROR,
} from './constants';

export function clearOutput(cmdId) {
  return (dispatch) => {
    dispatch({
      type: CLEAR_OUTPUT_BEGIN,
    });
    const promise = new Promise((resolve) => {
      bridge.ipcRenderer.once('CLEAR_OUTPUT_SUCCESS', () => {
        dispatch({
          type: CLEAR_OUTPUT_SUCCESS,
          data: { cmdId },
        });
        resolve();
      });

      bridge.ipcRenderer.send('CLEAR_OUTPUT', cmdId);
    });

    return promise;
  };
}

export function dismissClearOutputError() {
  return {
    type: CLEAR_OUTPUT_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case CLEAR_OUTPUT_BEGIN:
      return {
        ...state,
        clearOutputPending: true,
        clearOutputError: null,
      };

    case CLEAR_OUTPUT_SUCCESS:
      return {
        ...state,
        cmdById: {
          ...state.cmdById,
          [action.data.cmdId]: {
            ...state.cmdById[action.data.cmdId],
            outputs: [],
          },
        },
        clearOutputPending: false,
        clearOutputError: null,
      };

    case CLEAR_OUTPUT_FAILURE:
      return {
        ...state,
        clearOutputPending: false,
        clearOutputError: action.data.error,
      };

    case CLEAR_OUTPUT_DISMISS_ERROR:
      return {
        ...state,
        clearOutputError: null,
      };

    default:
      return state;
  }
}
