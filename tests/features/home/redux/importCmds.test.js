import { expect } from 'chai';

import {
  HOME_IMPORT_CMDS,
} from 'src/features/home/redux/constants';

import {
  importCmds,
  reducer,
} from 'src/features/home/redux/importCmds';

describe('home/redux/importCmds', () => {
  it('returns correct action by importCmds', () => {
    expect(importCmds()).to.have.property('type', HOME_IMPORT_CMDS);
  });

  it('handles action type HOME_IMPORT_CMDS correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_IMPORT_CMDS }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
