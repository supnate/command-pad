import { expect } from 'chai';

import {
  HOME_SET_COL_WIDTH,
} from 'src/features/home/redux/constants';

import {
  setColWidth,
  reducer,
} from 'src/features/home/redux/setColWidth';

describe('home/redux/setColWidth', () => {
  it('returns correct action by setColWidth', () => {
    expect(setColWidth()).to.have.property('type', HOME_SET_COL_WIDTH);
  });

  it('handles action type HOME_SET_COL_WIDTH correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SET_COL_WIDTH }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
