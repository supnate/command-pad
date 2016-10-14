import {
  REORDER_CMDS_BEGIN,
  REORDER_CMDS_SUCCESS,
  REORDER_CMDS_FAILURE,
  REORDER_CMDS_DISMISS_ERROR,
} from './constants';

export function reorderCmds(args) {
  return (dispatch) => {
    dispatch({
      type: REORDER_CMDS_BEGIN,
    });
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (!args.error) { // NOTE: args.error is only used for demo purpose
          dispatch({
            type: REORDER_CMDS_SUCCESS,
            data: {},
          });
          resolve();
        } else {
          dispatch({
            type: REORDER_CMDS_FAILURE,
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
