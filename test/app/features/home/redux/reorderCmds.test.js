import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  REORDER_CMDS_BEGIN,
  REORDER_CMDS_SUCCESS,
  REORDER_CMDS_FAILURE,
  REORDER_CMDS_DISMISS_ERROR,
} from 'features/home/redux/constants';

import {
  reorderCmds,
  dismissReorderCmdsError,
  reducer,
} from 'features/home/redux/reorderCmds';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/reorderCmds', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('action should handle reorderCmds success', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: REORDER_CMDS_BEGIN },
      { type: REORDER_CMDS_SUCCESS, data: {} },
    ];

    return store.dispatch(reorderCmds({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle reorderCmds failure', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: REORDER_CMDS_BEGIN },
      { type: REORDER_CMDS_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(reorderCmds({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle dismissReorderCmdsError', () => {
    const expectedAction = {
      type: REORDER_CMDS_DISMISS_ERROR,
    };
    expect(dismissReorderCmdsError()).to.deep.equal(expectedAction);
  });

  it('reducer should handle REORDER_CMDS_BEGIN', () => {
    const prevState = { reorderCmdsPending: true };
    const state = reducer(
      prevState,
      { type: REORDER_CMDS_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.reorderCmdsPending).to.be.true;
  });

  it('reducer should handle REORDER_CMDS_SUCCESS', () => {
    const prevState = { reorderCmdsPending: true };
    const state = reducer(
      prevState,
      { type: REORDER_CMDS_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.reorderCmdsPending).to.be.false;
  });

  it('reducer should handle REORDER_CMDS_FAILURE', () => {
    const prevState = { reorderCmdsPending: true };
    const state = reducer(
      prevState,
      { type: REORDER_CMDS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.reorderCmdsPending).to.be.false;
    expect(state.reorderCmdsError).to.exist;
  });

  it('reducer should handle REORDER_CMDS_DISMISS_ERROR', () => {
    const prevState = { reorderCmdsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: REORDER_CMDS_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.reorderCmdsError).to.be.null;
  });
});
