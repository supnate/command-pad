import { expect } from 'chai';

import {
  STOP_CMD,
} from 'features/home/redux/constants';

import {
  stopCmd,
  reducer,
} from 'features/home/redux/stopCmd';

describe('home/redux/stopCmd', () => {
  it('action: stopCmd', () => {
    const expectedAction = {
      type: STOP_CMD,
    };
    expect(stopCmd()).to.deep.equal(expectedAction);
  });

  it('reducer should handle STOP_CMD', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: STOP_CMD }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
