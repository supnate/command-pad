import {
  STOP_CMD,
} from './constants';

export function stopCmd(cmdId) {
  bridge.ipcRenderer.send('STOP_CMD', cmdId);
  return {
    type: STOP_CMD,
    data: {
      cmdId,
    },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case STOP_CMD:
      return state;

    default:
      return state;
  }
}
