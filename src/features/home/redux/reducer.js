import initialState from './initialState';
import { reducer as getInitData } from './getInitData';
import { reducer as runCmd } from './runCmd';
import { reducer as stopCmd } from './stopCmd';
import { reducer as saveCmd } from './saveCmd';
import { reducer as deleteCmd } from './deleteCmd';
import { reducer as reorderCmds } from './reorderCmds';
import { reducer as saveSettings } from './saveSettings';
import { reducer as clearOutput } from './clearOutput';
import { reducer as setColWidthReducer } from './setColWidth';
import { reducer as selectCmdReducer } from './selectCmd';
import { reducer as importCmdsReducer } from './importCmds';

const reducers = [
  getInitData,
  runCmd,
  stopCmd,
  saveCmd,
  deleteCmd,
  reorderCmds,
  saveSettings,
  clearOutput,
  setColWidthReducer,
  selectCmdReducer,
  importCmdsReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case 'CMD_FINISHED':
      return {
        ...state,
        cmdById: {
          ...state.cmdById,
          [action.data.cmdId]: {
            ...state.cmdById[action.data.cmdId],
            status: 'stopped',
            error: action.data.error || null,
          },
        },
      };

    case 'CMD_OUTPUT':
      return {
        ...state,
        cmdById: {
          ...state.cmdById,
          [action.data.cmdId]: {
            ...state.cmdById[action.data.cmdId],
            outputs: action.data.outputs,
          },
        },
      };

    // case 'CMDS_UPDATED':
    //   return {
    //     ...state,
    //     cmds: action.data.cmds,
    //   };

    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
