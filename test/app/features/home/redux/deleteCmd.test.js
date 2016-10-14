import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  DELETE_CMD_BEGIN,
  DELETE_CMD_SUCCESS,
  DELETE_CMD_FAILURE,
  DELETE_CMD_DISMISS_ERROR,
} from 'features/home/redux/constants';

import {
  deleteCmd,
  dismissDeleteCmdError,
  reducer,
} from 'features/home/redux/deleteCmd';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/deleteCmd', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('action should handle deleteCmd success', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: DELETE_CMD_BEGIN },
      { type: DELETE_CMD_SUCCESS, data: {} },
    ];

    return store.dispatch(deleteCmd({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle deleteCmd failure', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: DELETE_CMD_BEGIN },
      { type: DELETE_CMD_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(deleteCmd({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle dismissDeleteCmdError', () => {
    const expectedAction = {
      type: DELETE_CMD_DISMISS_ERROR,
    };
    expect(dismissDeleteCmdError()).to.deep.equal(expectedAction);
  });

  it('reducer should handle DELETE_CMD_BEGIN', () => {
    const prevState = { deleteCmdPending: true };
    const state = reducer(
      prevState,
      { type: DELETE_CMD_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCmdPending).to.be.true;
  });

  it('reducer should handle DELETE_CMD_SUCCESS', () => {
    const prevState = { deleteCmdPending: true };
    const state = reducer(
      prevState,
      { type: DELETE_CMD_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCmdPending).to.be.false;
  });

  it('reducer should handle DELETE_CMD_FAILURE', () => {
    const prevState = { deleteCmdPending: true };
    const state = reducer(
      prevState,
      { type: DELETE_CMD_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCmdPending).to.be.false;
    expect(state.deleteCmdError).to.exist;
  });

  it('reducer should handle DELETE_CMD_DISMISS_ERROR', () => {
    const prevState = { deleteCmdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: DELETE_CMD_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.deleteCmdError).to.be.null;
  });
});
