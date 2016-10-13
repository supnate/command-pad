import _ from 'lodash';
import { findCmd, replaceCmd } from '../utils';
import {
  RUN_CMD,
} from './constants';

export function runCmd(cmdId) {
  bridge.ipcRenderer.send('RUN_CMD', cmdId);
  return {
    type: RUN_CMD,
    data: {
      cmdId,
    },
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case RUN_CMD: {
      const cmd = {
        ...findCmd(state.cmds, action.data.cmdId),
        status: 'running',
      };
      return {
        ...state,
        cmds: replaceCmd(state.cmds, cmd),
      };
    }
    default:
      return state;
  }
}
