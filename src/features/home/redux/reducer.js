import { findCmd, replaceCmd } from '../utils';
import initialState from './initialState';
import { reducer as getInitData } from './getInitData';
import { reducer as runCmd } from './runCmd';
import { reducer as stopCmd } from './stopCmd';

const reducers = [
  getInitData,
  runCmd,
  stopCmd,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case 'CMD_FINISHED': {
      const cmd = {
        ...findCmd(state.cmds, action.data.cmdId),
        status: 'stopped',
      };
      return {
        ...state,
        cmds: replaceCmd(state.cmds, cmd),
      };
    }

    case 'CMD_OUTPUT': {
      const cmd = {
        ...findCmd(state.cmds, action.data.cmdId),
        outputs: action.data.outputs,
      };
      return {
        ...state,
        cmds: replaceCmd(state.cmds, cmd),
      };
    }
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
