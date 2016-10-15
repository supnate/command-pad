import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  RUN_CMD_BEGIN,
  RUN_CMD_SUCCESS,
  RUN_CMD_FAILURE,
  RUN_CMD_DISMISS_ERROR,
} from 'features/home/redux/constants';

import {
  runCmd,
  dismissRunCmdError,
  reducer,
} from 'features/home/redux/runCmd';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/runCmd', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('action should handle runCmd success', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: RUN_CMD_BEGIN },
      { type: RUN_CMD_SUCCESS, data: {} },
    ];

    return store.dispatch(runCmd({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle runCmd failure', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: RUN_CMD_BEGIN },
      { type: RUN_CMD_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(runCmd({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle dismissRunCmdError', () => {
    const expectedAction = {
      type: RUN_CMD_DISMISS_ERROR,
    };
    expect(dismissRunCmdError()).to.deep.equal(expectedAction);
  });

  it('reducer should handle RUN_CMD_BEGIN', () => {
    const prevState = { runCmdPending: true };
    const state = reducer(
      prevState,
      { type: RUN_CMD_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runCmdPending).to.be.true;
  });

  it('reducer should handle RUN_CMD_SUCCESS', () => {
    const prevState = { runCmdPending: true };
    const state = reducer(
      prevState,
      { type: RUN_CMD_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runCmdPending).to.be.false;
  });

  it('reducer should handle RUN_CMD_FAILURE', () => {
    const prevState = { runCmdPending: true };
    const state = reducer(
      prevState,
      { type: RUN_CMD_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runCmdPending).to.be.false;
    expect(state.runCmdError).to.exist;
  });

  it('reducer should handle RUN_CMD_DISMISS_ERROR', () => {
    const prevState = { runCmdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: RUN_CMD_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.runCmdError).to.be.null;
  });
});
