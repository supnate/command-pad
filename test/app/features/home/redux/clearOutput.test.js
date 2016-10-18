import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';
import { expect } from 'chai';

import {
  CLEAR_OUTPUT_BEGIN,
  CLEAR_OUTPUT_SUCCESS,
  CLEAR_OUTPUT_FAILURE,
  CLEAR_OUTPUT_DISMISS_ERROR,
} from 'features/home/redux/constants';

import {
  clearOutput,
  dismissClearOutputError,
  reducer,
} from 'features/home/redux/clearOutput';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/clearOutput', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('action should handle clearOutput success', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: CLEAR_OUTPUT_BEGIN },
      { type: CLEAR_OUTPUT_SUCCESS, data: {} },
    ];

    return store.dispatch(clearOutput({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle clearOutput failure', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: CLEAR_OUTPUT_BEGIN },
      { type: CLEAR_OUTPUT_FAILURE, data: { error: 'some error' } },
    ];

    return store.dispatch(clearOutput({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('action should handle dismissClearOutputError', () => {
    const expectedAction = {
      type: CLEAR_OUTPUT_DISMISS_ERROR,
    };
    expect(dismissClearOutputError()).to.deep.equal(expectedAction);
  });

  it('reducer should handle CLEAR_OUTPUT_BEGIN', () => {
    const prevState = { clearOutputPending: true };
    const state = reducer(
      prevState,
      { type: CLEAR_OUTPUT_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.clearOutputPending).to.be.true;
  });

  it('reducer should handle CLEAR_OUTPUT_SUCCESS', () => {
    const prevState = { clearOutputPending: true };
    const state = reducer(
      prevState,
      { type: CLEAR_OUTPUT_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.clearOutputPending).to.be.false;
  });

  it('reducer should handle CLEAR_OUTPUT_FAILURE', () => {
    const prevState = { clearOutputPending: true };
    const state = reducer(
      prevState,
      { type: CLEAR_OUTPUT_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.clearOutputPending).to.be.false;
    expect(state.clearOutputError).to.exist;
  });

  it('reducer should handle CLEAR_OUTPUT_DISMISS_ERROR', () => {
    const prevState = { clearOutputError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: CLEAR_OUTPUT_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.clearOutputError).to.be.null;
  });
});
