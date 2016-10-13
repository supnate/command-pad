import { expect } from 'chai';

import {
  RUN_CMD,
} from 'features/home/redux/constants';

import {
  runCmd,
  reducer,
} from 'features/home/redux/runCmd';

describe('home/redux/runCmd', () => {
  it('action: runCmd', () => {
    const expectedAction = {
      type: RUN_CMD,
    };
    expect(runCmd()).to.deep.equal(expectedAction);
  });

  it('reducer should handle RUN_CMD', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: RUN_CMD }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });
});
