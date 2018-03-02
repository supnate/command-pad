import { expect } from 'chai';

import {
  HOME_SELECT_CMD,
} from 'src/features/home/redux/constants';

import {
  selectCmd,
  reducer,
} from 'src/features/home/redux/selectCmd';

describe('home/redux/selectCmd', () => {
  it('returns correct action by selectCmd', () => {
    expect(selectCmd()).to.have.property('type', HOME_SELECT_CMD);
  });

  it('handles action type HOME_SELECT_CMD correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SELECT_CMD }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
