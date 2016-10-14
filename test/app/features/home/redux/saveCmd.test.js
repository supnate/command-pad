import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  SAVE_CMD_BEGIN,
  SAVE_CMD_SUCCESS,
  SAVE_CMD_FAILURE,
  SAVE_CMD_DISMISS_ERROR,
} from 'features/home/redux/constants';

import {
  saveCmd,
  dismissSaveCmdError,
  reducer,
} from 'features/home/redux/saveCmd';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/saveCmd', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('action should handle saveCmd success', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: SAVE_CMD_BEGIN },
      { type: SAVE_CMD_SUCCESS, data: {} },
    ];

    return store.dispatch(saveCmd({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle saveCmd failure', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: SAVE_CMD_BEGIN },
      { type: SAVE_CMD_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(saveCmd({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle dismissSaveCmdError', () => {
    const expectedAction = {
      type: SAVE_CMD_DISMISS_ERROR,
    };
    expect(dismissSaveCmdError()).to.deep.equal(expectedAction);
  });

  it('reducer should handle SAVE_CMD_BEGIN', () => {
    const prevState = { saveCmdPending: true };
    const state = reducer(
      prevState,
      { type: SAVE_CMD_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCmdPending).to.be.true;
  });

  it('reducer should handle SAVE_CMD_SUCCESS', () => {
    const prevState = { saveCmdPending: true };
    const state = reducer(
      prevState,
      { type: SAVE_CMD_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCmdPending).to.be.false;
  });

  it('reducer should handle SAVE_CMD_FAILURE', () => {
    const prevState = { saveCmdPending: true };
    const state = reducer(
      prevState,
      { type: SAVE_CMD_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCmdPending).to.be.false;
    expect(state.saveCmdError).to.exist;
  });

  it('reducer should handle SAVE_CMD_DISMISS_ERROR', () => {
    const prevState = { saveCmdError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: SAVE_CMD_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.saveCmdError).to.be.null;
  });
});
